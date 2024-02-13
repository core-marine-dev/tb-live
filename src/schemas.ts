import * as v from 'valibot'

import { FIRMWARES_AVAILABLE, FREQUENCY_MAX, FREQUENCY_MIN, INT16_MAX, INT16_MIN, INT32_MAX, INT32_MIN, INT8_MAX, INT8_MIN, MODES, PING_FLAG_END, PING_FLAG_LENGTH_MAX, PING_FLAG_LENGTH_MIN, PING_FLAG_START, UINT16_MAX, UINT32_MAX, UINT8_MAX } from './constants'
// COMMONS
export const StringSchema = v.string()
export const StringArraySchema = v.array(StringSchema)
export const BooleanSchema = v.boolean()
export const NumberSchema = v.number()
// INTEGERS
export const Int8Schema = v.number(
  'Int8: It should be a number',
  [
    v.integer('Int8: It should be an integer number'),
    v.minValue(INT8_MIN, `Int8: It should be greater than ${INT8_MIN - 1}`),
    v.maxValue(INT8_MAX, `Int8: It should be less than ${INT8_MAX + 1}`)
  ]
)
export const Int16Schema = v.number(
  'Int16: It should be a number',
  [
    v.integer('Int16: It should be an integer number'),
    v.minValue(INT16_MIN, `Int16: It should be greater than ${INT16_MIN - 1}`),
    v.maxValue(INT16_MAX, `Int16: It should be less than ${INT16_MAX + 1}`)
  ]
)
export const Int32Schema = v.number(
  'Int32: It should be a number',
  [
    v.integer('It should be an integer number'),
    v.minValue(INT32_MIN, `Int32: It should be greater than ${INT32_MIN - 1}`),
    v.maxValue(INT32_MAX, `Int32: It should be less than ${INT32_MAX + 1}`)
  ]
)
export const BigIntSchema = v.bigint('BigInt: It should be a BigInt')
// UNSIGNED INTEGERS
export const Uint8Schema = v.number(
  'Uint8: It should be a number',
  [
    v.integer('Uint8: It should be an integer number'),
    v.minValue(0, 'Uint8: It should be greater than 0'),
    v.maxValue(UINT8_MAX, `Uint8: It should be less than ${UINT8_MAX + 1}`)
  ]
)
export const Uint16Schema = v.number(
  'Uint16: It should be a number',
  [
    v.integer('Uint16: It should be an integer number'),
    v.minValue(0, 'Uint16: It should be greater than 0'),
    v.maxValue(UINT16_MAX, `Uint16: It should be less than ${UINT16_MAX + 1}`)
  ]
)
export const Uint32Schema = v.number(
  'Uint32: It should be a number',
  [
    v.integer('Uint32: It should be an integer number'),
    v.minValue(0, 'Uint32: It should be greater than 0'),
    v.maxValue(UINT32_MAX, `Uint32: It should be less than ${UINT32_MAX + 1}`)
  ]
)
export const BigUintSchema = v.bigint(
  'BigUint: It should be a BigInt',
  [v.minValue(0n, 'BigUint: It should be greater than 0n')]
)
// HARDWARE
export const SerialNumberSchema = v.string('SerialNumber: It should be a string', [
  v.custom((input: string) => {
    const num = Number(input)
    return !Number.isNaN(num) && Number.isInteger(num) && num > -1
  }, 'SerialNumber: It should be a positive integer string number'),
  v.minLength(6, 'SerialNumber: It should have at least 6 digits'),
  v.maxLength(7, 'SerialNumber: It should have 7 digits at most')
])

export const FrequencySchema = v.number(
  'Frequency: It should be a number',
  [
    v.integer('Frequency: It should be an integer'),
    v.minValue(63, 'Frequency: It should greater equal to 63'),
    v.maxValue(77, 'Frequency: It should lesser equal to 77')
])

export const FirmwareSchema = v.picklist(FIRMWARES_AVAILABLE, 'Firmware: It should be "1.0.1" or "1.0.2"')

export const ModeSchema = v.picklist(MODES, 'Mode: It should be "listening" or "command" or "update"')

export const EmitterSchema = v.object({
  serialNumber: SerialNumberSchema,
  frequency: Uint8Schema
})

export const ReceiverSchema = v.object(
  {
    serialNumber: SerialNumberSchema,
    frequency: FrequencySchema,
    firmware: FirmwareSchema,
    mode: ModeSchema,
    emitters: v.array(EmitterSchema, [
      v.minLength(1, 'Receiver: It should be at least one emitter'),
      v.maxLength(3, 'Receiver: It should be only three emitters as maximum')
    ])
  },
  [
    v.forward(
      v.custom(
        ({ emitters }) => (new Set(emitters.map(emitter => emitter.serialNumber))).size === emitters.length,
        'Receiver: All emitters serial number should be different between them'
      ),
      ['emitters']
    ),
    v.forward(
      v.custom(
        ({ emitters }) => (new Set(emitters.map(emitter => emitter.frequency))).size === emitters.length,
        'Receiver: All emitters frequencies should be different between them'
      ),
      ['emitters']
    ),
    v.forward(
      v.custom(
        ({ emitters }) => emitters.map(emitter => emitter.frequency).every(freq => (freq >= FREQUENCY_MIN) && (freq <= FREQUENCY_MAX)),
        `Receiver: All emitters frequencies should be between ${FREQUENCY_MIN} and ${FREQUENCY_MAX} kHz`),
      ['emitters']
    ),
    v.forward(
      v.custom(
        ({ frequency, emitters }) => emitters.map(emitter => emitter.frequency).filter(freq => [frequency - 2, frequency, frequency + 2].includes(freq)).length === emitters.length,
        `Receiver: All emitters frequencies should be equal to TB-Live frequency or ± 2 kHz`),
      ['emitters']
    ),
  ]
)
// FRAMES
export const PingResponseInputSchema = v.string([
  v.startsWith(PING_FLAG_START, `PingResponse: It should start with ${PING_FLAG_START}`),
  v.endsWith(PING_FLAG_END, `PingResponse: It should end with ${PING_FLAG_END}`),
  v.minLength(PING_FLAG_LENGTH_MIN, `PingResponse: It should have a minimal length of ${PING_FLAG_LENGTH_MIN}`),
  v.maxLength(PING_FLAG_LENGTH_MAX, `PingResponse: It should have a maximal length of ${PING_FLAG_LENGTH_MAX}`),
  v.custom(input => {
    const sn = ((input.split(PING_FLAG_START))[1].split(PING_FLAG_END))[0]
    return v.safeParse(SerialNumberSchema, sn).success
  },   'PingResponse: It should contain a valid serial number')
])

export const PingResponseOutputSchema = v.transform(
  PingResponseInputSchema,
  (input: string) => {
    const sn = ((input.split(PING_FLAG_START))[1].split(PING_FLAG_END))[0]
    return v.parse(SerialNumberSchema, sn)
  }
)