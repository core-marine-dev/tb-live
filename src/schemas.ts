import * as v from 'valibot'
import { FREQUENCY_MAX, FREQUENCY_MIN, INT16_MAX, INT16_MIN, INT32_MAX, INT32_MIN, INT8_MAX, INT8_MIN, UINT16_MAX, UINT32_MAX, UINT8_MAX } from './constants'
// COMMONS
export const StringSchema = v.string()
export const StringArraySchema = v.array(StringSchema)
export const BooleanSchema = v.boolean()
export const NumberSchema = v.number()
// INTEGERS
export const Int8Schema = v.number(
  'It should be a number',
  [
    v.integer('It should be an integer number'),
    v.minValue(INT8_MIN, `It should be greater than ${INT8_MIN - 1}`),
    v.maxValue(INT8_MAX, `It should be less than ${INT8_MAX + 1}`)
  ]
)
export const Int16Schema = v.number(
  'It should be a number',
  [
    v.integer('It should be an integer number'),
    v.minValue(INT16_MIN, `It should be greater than ${INT16_MIN - 1}`),
    v.maxValue(INT16_MAX, `It should be less than ${INT16_MAX + 1}`)
  ]
)
export const Int32Schema = v.number(
  'It should be a number',
  [
    v.integer('It should be an integer number'),
    v.minValue(INT32_MIN, `It should be greater than ${INT32_MIN - 1}`),
    v.maxValue(INT32_MAX, `It should be less than ${INT32_MAX + 1}`)
  ]
)
export const BigIntSchema = v.bigint('It should be a BigInt')
// UNSIGNED INTEGERS
export const Uint8Schema = v.number(
  'It should be a number',
  [
    v.integer('It should be an integer number'),
    v.minValue(0, 'It should be greater than 0'),
    v.maxValue(UINT8_MAX, `It should be less than ${UINT8_MAX + 1}`)
  ]
)
export const Uint16Schema = v.number(
  'It should be a number',
  [
    v.integer('It should be an integer number'),
    v.minValue(0, 'It should be greater than 0'),
    v.maxValue(UINT16_MAX, `It should be less than ${UINT16_MAX + 1}`)
  ]
)
export const Uint32Schema = v.number(
  'It should be a number',
  [
    v.integer('It should be an integer number'),
    v.minValue(0, 'It should be greater than 0'),
    v.maxValue(UINT32_MAX, `It should be less than ${UINT32_MAX + 1}`)
  ]
)
export const BigUintSchema = v.bigint(
  'It should be a BigInt',
  [v.minValue(0n, 'It should be greater than 0n')]
)
// HARDWARE
export const SerialNumberSchema = v.string('It should be a string', [
  v.custom((input: string) => {
    const num = Number(input)
    return !Number.isNaN(num) && Number.isInteger(num) && num > -1
  }, 'It should be a positive integer string number'),
  v.minLength(6, 'It should have at least 6 digits'),
  v.maxLength(7, 'It should have 7 digits at most')
])

export const FrequencySchema = v.number([
  v.integer('It should be an integer'),
  v.minValue(63, 'It should greater equal to 63'),
  v.maxValue(77, 'It should lesser equal to 77')
])

export const EmitterSchema = v.object({
  serialNumber: SerialNumberSchema,
  frequency: Uint8Schema
})

export const ReceiverConfig = v.object(
  {
    serialNumber: SerialNumberSchema,
    frequency: FrequencySchema,
    emitters: v.array(EmitterSchema, [v.maxLength(3, 'It should be only three emitters as maximum')])
  },
  [
    v.forward(
      v.custom(
        ({ emitters }) => (new Set(emitters.map(emitter => emitter.frequency))).size === emitters.length,
        'All emitters frequencies should be different between them'
      ),
      ['emitters']
    ),
    v.forward(
      v.custom(
        ({ frequency, emitters }) => emitters.map(emitter => emitter.frequency).filter(freq => [frequency - 2, frequency, frequency + 2].includes(freq)).length === emitters.length,
        `All emitters frequencies should be equal to TB-Live frequency or ± 2 kHz`),
      ['emitters']
    ),
    v.forward(
      v.custom(
        ({ emitters }) => emitters.map(emitter => emitter.frequency).every(freq => (freq >= FREQUENCY_MIN) && (freq <= FREQUENCY_MAX)),
        `All emitters frequencies should be between ${FREQUENCY_MIN} and ${FREQUENCY_MAX} kHz`),
      ['emitters']
    )
  ]
)
