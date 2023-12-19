import { Injectable } from "@nestjs/common";
import { randomBytes, scrypt, subtle, timingSafeEqual } from "crypto";
import { generate } from "generate-passphrase";

@Injectable()
export class CryptoService {

  /**
   * Generate a hash from a text with a random salt
   */
  hash(text: string) {
    const salt = randomBytes(16).toString('hex')

    return new Promise<string>((resolve, reject) => {
      scrypt(text, salt, 64, (err, derivedKey) => {
        if (err) {
          reject(err)
          return
        }
        resolve(salt + ':' + derivedKey.toString('hex'))
      })
    })
  }

  /**
   * the text is clear text and the hash is the hash
   * generated by the hash function and is stored in the database
   * with the salt prepended to it (separated by a colon)
   */
  compare(text: string, hash: string) {
    const [salt, key] = hash.split(':')

    if (!salt || !key) {
      throw new Error('Invalid hash')
    }

    return new Promise<boolean>((resolve, reject) => {
      scrypt(text, salt, 64, (err, derivedKey) => {
        if (err) {
          reject(err)
          return
        }
        const keyBuffer = Buffer.from(key, 'hex')
        const match = timingSafeEqual(derivedKey, keyBuffer);

        resolve(match)
      })
    })
  }

  /**
   * Generate a passphrase using generate-passphrase library
   */
  createPassphrase() {
    const passphrase = generate({
      length: 32,
      numbers: false,
      separator: ' ',
      fast: true,
    })
    return passphrase
  }

  createPrivateKey(length: number = 64) {
    return randomBytes(length).toString('hex').slice(0, length)
  }

  private async getDerivedKey(privateKey: string, salt: string) {
    const key = await subtle.importKey(
      'raw',
      Buffer.from(privateKey),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    )

    const derivedKey = await subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: Buffer.from(salt),
        iterations: 10000,
        hash: 'SHA-256'
      },
      key,
      {
        name: 'AES-GCM',
        length: 256
      },
      false,
      [
        'encrypt',
        'decrypt'
      ]
    )

    return derivedKey
  }

  /**
   * Encrypt a text using a private key only with NodeJS.crypto
   */
  async encrypt(text: string, privateKey: string) {

    const salt = randomBytes(16)
    const derivedKey = await this.getDerivedKey(privateKey, salt.toString('hex'))
    const iv = randomBytes(16)

    const encrypted = await subtle.encrypt(
      {
        name: 'AES-GCM',
        length: 256,
        iv: iv
      },
      derivedKey,
      Buffer.from(text)
    )
    return Buffer.concat([salt, iv, Buffer.from(encrypted)])
  }

  async decrypt(encrypted: Buffer, privateKey: string) {
    // Destructure the encrypted data into its parts
    // salt (16 bytes), iv (16 bytes), data (the rest)
    const salt = encrypted.subarray(0, 16)
    const iv = encrypted.subarray(16, 32)
    const data = encrypted.subarray(32)
    const derivedKey = await this.getDerivedKey(privateKey, salt.toString('hex'))

    const decrypted = await subtle.decrypt(
      {
        name: 'AES-GCM',
        length: 256,
        iv,
      },
      derivedKey,
      data
    )
    return Buffer.from(decrypted)
  }

  async createEncryptionProfil(password: string) {

    // this is the key that will be used to recover the user data
    // if the user forgets his password, it will be used to encrypt
    // the encryption key so later the user can decrypt his data without
    // knowing his password
    const passphrase = this.createPassphrase()

    // this is the key that will be used to encrypt the user data
    // (COMPLETELY SECURE, NEVER STORED ANYWHERE)
    const encryptionKey = this.createPrivateKey()

    // encrypt the encryption key with the passphrase and the user password
    // double encryption, password and passphrase can both be used to decrypt
    // the encryption key (used to encrypt/decrypt the user data)
    const [recoveryKey, userKey] = await Promise.all([
      this.encrypt(encryptionKey, passphrase),
      this.encrypt(encryptionKey, password)
    ])

    return {
      keys: {
        recoveryKey,
        userKey
      },
      passphrase
    }
  }
}