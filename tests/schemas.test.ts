import * as v from 'valibot'
import { describe, test, expect } from 'vitest'
import { FREQUENCY_MAX, FREQUENCY_MIN, INT16_MAX, INT16_MIN, INT32_MAX, INT32_MIN, INT8_MAX, INT8_MIN, UINT16_MAX, UINT32_MAX, UINT8_MAX } from '../src/constants'
import { BigUintSchema, EmitterSchema, FrequencySchema, Int16Schema, Int32Schema, Int8Schema, ReceiverConfigSchema, SerialNumberSchema, Uint16Schema, Uint32Schema, Uint8Schema } from '../src/schemas'
import { Emitter, ReceiverConfig } from '../src/types'

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

test('Frequency', () => {
  // Invalid values
  [
    [63.3, 'It should be an integer'],
    [62, 'It should greater equal to 63'],
    [78, 'It should lesser equal to 77']
  ].forEach(([freq, message]) => {
    const result = v.safeParse(FrequencySchema, freq)
    expect(result.success).toBeFalsy()
    if (!result.success) {
      expect(result.issues[0].message).toBe(message)
    }
  });
  // Valid values
  [
    63,
    77,
    Math.floor(Math.random() * (FREQUENCY_MAX - FREQUENCY_MIN + 1) + FREQUENCY_MIN)
  ].forEach(freq => expect(v.safeParse(FrequencySchema, freq).success).toBeTruthy())
})

test('Emitter', () => {
  const emitter: Emitter = { serialNumber: '1234567', frequency: 70 }
  expect(v.safeParse(EmitterSchema, emitter).success).toBeTruthy()
})

describe('ReceiverConfig', () => {
  test('Invalid number of emitters', () => {
    let receiver: ReceiverConfig = {
      serialNumber: '1234567',
      frequency: 70,
      emitters: []
    }
    // None emitters
    let result = v.safeParse(ReceiverConfigSchema, receiver)
    expect(result.success).toBeFalsy()
    if (!result.success) {
      expect(result.issues[0].message).toBe('It should be at least one emitter')
    }
    // Invalid number of emitters
    const emitters: Emitter[] = [
      { serialNumber: '111111', frequency: 66 },
      { serialNumber: '2222222', frequency: 66 },
      { serialNumber: '333333', frequency: 66 },
      { serialNumber: '4444444', frequency: 66 },
    ]
    receiver.emitters = emitters
    result = v.safeParse(ReceiverConfigSchema, receiver)
    expect(result.success).toBeFalsy()
    if (!result.success) {
      expect(result.issues[0].message).toBe('It should be only three emitters as maximum')
    }
  })

  test('Invalid emitters', () => {
    let receiver: ReceiverConfig = {
      serialNumber: '1234567',
      frequency: 70,
      emitters: []
    }
    // Same emitters serial number
    let emitters: Emitter[] = [
      { serialNumber: '111111', frequency: 66 },
      { serialNumber: '111111', frequency: 68 },
      { serialNumber: '111111', frequency: 64 },
    ]
    receiver.emitters = emitters
    let result = v.safeParse(ReceiverConfigSchema, receiver)
    expect(result.success).toBeFalsy()
    if (!result.success) {
      expect(result.issues[0].message).toBe('All emitters serial number should be different between them')
    }
    // Same emitters frequencies
    receiver.emitters = [
      { serialNumber: '111111', frequency: 66 },
      { serialNumber: '222222', frequency: 66 },
      { serialNumber: '333333', frequency: 66 },
    ]
    result = v.safeParse(ReceiverConfigSchema, receiver)
    expect(result.success).toBeFalsy()
    if (!result.success) {
      expect(result.issues[0].message).toBe('All emitters frequencies should be different between them')
    }
    // Frequencies should +- 2 KHz of receiver frequency
    receiver.emitters = [
      { serialNumber: '111111', frequency: 50 },
      { serialNumber: '222222', frequency: 80 },
      { serialNumber: '333333', frequency: 200 },
    ]
    result = v.safeParse(ReceiverConfigSchema, receiver)
    expect(result.success).toBeFalsy()
    if (!result.success) {
      expect(result.issues[0].message).toBe(`All emitters frequencies should be between ${FREQUENCY_MIN} and ${FREQUENCY_MAX} kHz`)
    }
    // Frequencies should +- 2 KHz of receiver frequency
    receiver.emitters = [
      { serialNumber: '111111', frequency: 70 },
      { serialNumber: '222222', frequency: 69 },
      { serialNumber: '333333', frequency: 71 },
    ]
    result = v.safeParse(ReceiverConfigSchema, receiver)
    expect(result.success).toBeFalsy()
    if (!result.success) {
      expect(result.issues[0].message).toBe('All emitters frequencies should be equal to TB-Live frequency or ± 2 kHz')
    }
  })

  test('Valid emitters', () => {
    let receiver: ReceiverConfig = {
      serialNumber: '1234567',
      frequency: 70,
      emitters: []
    }
    // Three emitters
    let emitters: Emitter[] = [
      { serialNumber: '111111', frequency: 68 },
      { serialNumber: '222222', frequency: 70 },
      { serialNumber: '333333', frequency: 72 },
    ]
    receiver.emitters = emitters
    let result = v.safeParse(ReceiverConfigSchema, receiver)
    expect(result.success).toBeTruthy()
    // two emitters
    emitters.pop()
    receiver.emitters = emitters
    result = v.safeParse(ReceiverConfigSchema, receiver)
    expect(result.success).toBeTruthy()
    // one emitters
    emitters.pop()
    receiver.emitters = emitters
    result = v.safeParse(ReceiverConfigSchema, receiver)
    expect(result.success).toBeTruthy()
    // none emitters
    emitters.pop()
    receiver.emitters = emitters
    result = v.safeParse(ReceiverConfigSchema, receiver)
    expect(result.success).toBeFalsy()
  })
})