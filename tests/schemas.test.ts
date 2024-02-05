import * as v from 'valibot'
import { describe, test, expect } from 'vitest'
import { INT16_MAX, INT16_MIN, INT32_MAX, INT32_MIN, INT8_MAX, INT8_MIN, UINT16_MAX, UINT32_MAX, UINT8_MAX } from '../src/constants'
import { BigUintSchema, Int16Schema, Int32Schema, Int8Schema, SerialNumberSchema, Uint16Schema, Uint32Schema, Uint8Schema } from '../src/schemas'

describe('Integers', () => {
  test('Int8', () => {
    let value: number
    let result: ReturnType<typeof v.safeParse>
    // Less than min
    value = INT8_MIN - 10
    result = v.safeParse(Int8Schema, value)
    expect(result.success).toBeFalsy()
    if (!result.success) {
      expect(result.issues[0].message).toBe(`It should be greater than ${INT8_MIN - 1}`)
    }
    // More than max
    value = INT8_MAX + 10
    result = v.safeParse(Int8Schema, value)
    expect(result.success).toBeFalsy()
    if (!result.success) {
      expect(result.issues[0].message).toBe(`It should be less than ${INT8_MAX + 1}`)
    }
  })

  test('Int16', () => {
    let value: number
    let result: ReturnType<typeof v.safeParse>
    // Less than min
    value = INT16_MIN - 10
    result = v.safeParse(Int16Schema, value)
    expect(result.success).toBeFalsy()
    if (!result.success) {
      expect(result.issues[0].message).toBe(`It should be greater than ${INT16_MIN - 1}`)
    }
    // More than max
    value = INT16_MAX + 10
    result = v.safeParse(Int16Schema, value)
    expect(result.success).toBeFalsy()
    if (!result.success) {
      expect(result.issues[0].message).toBe(`It should be less than ${INT16_MAX + 1}`)
    }
  })

  test('Int32', () => {
    let value: number
    let result: ReturnType<typeof v.safeParse>
    // Less than min
    value = INT32_MIN - 10
    result = v.safeParse(Int32Schema, value)
    expect(result.success).toBeFalsy()
    if (!result.success) {
      expect(result.issues[0].message).toBe(`It should be greater than ${INT32_MIN - 1}`)
    }
    // More than max
    value = INT32_MAX + 10
    result = v.safeParse(Int32Schema, value)
    expect(result.success).toBeFalsy()
    if (!result.success) {
      expect(result.issues[0].message).toBe(`It should be less than ${INT32_MAX + 1}`)
    }
  })
})

describe('Unsigned Integers', () => {
  test('Uint8', () => {
    let value: number
    let result: ReturnType<typeof v.safeParse>
    // Less than min
    value = - 10
    result = v.safeParse(Uint8Schema, value)
    expect(result.success).toBeFalsy()
    if (!result.success) {
      expect(result.issues[0].message).toBe('It should be greater than 0')
    }
    // More than max
    value = UINT8_MAX + 10
    result = v.safeParse(Uint8Schema, value)
    expect(result.success).toBeFalsy()
    if (!result.success) {
      expect(result.issues[0].message).toBe(`It should be less than ${UINT8_MAX + 1}`)
    }
  })

  test('Int16', () => {
    let value: number
    let result: ReturnType<typeof v.safeParse>
    // Less than min
    value = - 10
    result = v.safeParse(Uint16Schema, value)
    expect(result.success).toBeFalsy()
    if (!result.success) {
      expect(result.issues[0].message).toBe('It should be greater than 0')
    }
    // More than max
    value = UINT16_MAX + 10
    result = v.safeParse(Uint16Schema, value)
    expect(result.success).toBeFalsy()
    if (!result.success) {
      expect(result.issues[0].message).toBe(`It should be less than ${UINT16_MAX + 1}`)
    }
  })

  test('Int32', () => {
    let value: number
    let result: ReturnType<typeof v.safeParse>
    // Less than min
    value = - 10
    result = v.safeParse(Uint32Schema, value)
    expect(result.success).toBeFalsy()
    if (!result.success) {
      expect(result.issues[0].message).toBe('It should be greater than 0')
    }
    // More than max
    value = UINT32_MAX + 10
    result = v.safeParse(Uint32Schema, value)
    expect(result.success).toBeFalsy()
    if (!result.success) {
      expect(result.issues[0].message).toBe(`It should be less than ${UINT32_MAX + 1}`)
    }
  })

  test('BigUint', () => {
    // Less than min
    const value = - 10n
    const result = v.safeParse(BigUintSchema, value)
    expect(result.success).toBeFalsy()
    if (!result.success) {
      expect(result.issues[0].message).toBe('It should be greater than 0n')
    }
  })
})

describe('Serial Numbers', () => {
  test('Non valid type of inputs', () => {
    [
      [123, 'It should be a string'],
      ['abc', 'It should be a positive integer string number'],
      ['12a', 'It should be a positive integer string number'],
      ['12.7', 'It should be a positive integer string number'],
      ['-12', 'It should be a positive integer string number'],
    ].forEach(([serialNumber, message]) => {
      const result = v.safeParse(SerialNumberSchema, serialNumber)
      expect(result.success).toBeFalsy()
      if (!result.success) {
        expect(result.issues[0].message).toBe(message)
      }
    })
  })

  test('Non valid length', () => {
    [
      ['12345', 'It should have at least 6 digits'],
      ['12345678', 'It should have 7 digits at most']
    ].forEach(([serialNumber, message]) => {
      const result = v.safeParse(SerialNumberSchema, serialNumber)
      expect(result.success).toBeFalsy()
      if (!result.success) {
        expect(result.issues[0].message).toBe(message)
      }
    })
  })
  test('Valid values', () => {
    ['123456', '1234567'].forEach(serialNumber => expect(v.parse(SerialNumberSchema, serialNumber)).toBe(serialNumber))
  })
})
