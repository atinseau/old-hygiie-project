import { dateIsExpired } from "@/utils/functions"
import { getMinimalMajorBirthDate } from "@/utils/functions/getMinimalMajorBirthDate"

describe('getMinimalMajorBirthDate', () => {

  it('should return a date', () => {

    const minimalDate = getMinimalMajorBirthDate()

    const date1 = new Date()
    const date2 = new Date()

    date1.setFullYear(date1.getFullYear() - 19)
    date2.setFullYear(date2.getFullYear() - 0)

    expect(minimalDate).toBeInstanceOf(Date)

    const diff1 = (date1.getTime() - minimalDate.getTime()) / (1000 * 60 * 60 * 24)
    const diff2 = (date2.getTime() - minimalDate.getTime()) / (1000 * 60 * 60 * 24)

    expect(diff1).toBeLessThanOrEqual(0) // is major
    expect(diff2).toBeGreaterThan(0) // is minor
  })

  it('should test if a date is expired or not', () => {

    const date1 = new Date()

    date1.setDate(date1.getDate() - 1) // 1 day ago

    // this date is expired because it's 1 day in the past
    expect(dateIsExpired(date1)).toBe(true)

    // move the cursor to 1 day in the future
    // this date is not expired because it's 1 day in the future
    expect(dateIsExpired(date1, 1000 * 60 * 60 * 24)).toBe(false)

    const date2 = new Date()
    date2.setMinutes(date2.getMinutes() + 1) // 1 minute in the future

    // this date is not expired because it's 1 minute in the future
    expect(dateIsExpired(date2)).toBe(false)

    // move the cursor to 1 minute in the past
    // -1000 * 60 -> remove 1 minute
    // -1000 * 60 * 2 -> remove 1 minute + the minute we added before
    expect(dateIsExpired(date2, -1000 * 60 * 2)).toBe(true)

  })

}) 