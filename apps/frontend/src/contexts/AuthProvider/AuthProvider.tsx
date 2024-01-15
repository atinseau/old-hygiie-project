'use client';

import { type Authentificator, CookieAdapter } from "@cipher-health/sdk";
import { AuthentificatorProvider } from "@cipher-health/sdk/react";
import { useEffect, useRef } from "react";
import { userAtom, authStore } from "./authStore";
import { useMount } from "@cipher-health/utils/react";

type AuthProviderProps = {
  children: React.ReactNode
}


export default function AuthProvider(props: AuthProviderProps) {

  const authentificatorRef = useRef<Authentificator>(null)

  useMount(() => {
    const authentificator = authentificatorRef.current
    if (authentificator === null) return

    authentificator.isConnected().then(async (isConnected) => {
      if (!isConnected) return
      const user = await authentificator.me().catch(() => null)
      authStore.set(userAtom, user)
    })

  })

  return <AuthentificatorProvider
    baseUrl={process.env.NEXT_PUBLIC_API_HOST}
    adapter={new CookieAdapter()}
    ref={authentificatorRef}
  >
    {props.children}
  </AuthentificatorProvider>
}