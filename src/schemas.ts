import * as v from 'valibot'
import { INT16_MAX, INT16_MIN, INT32_MAX, INT32_MIN, INT8_MAX, INT8_MIN } from './constants'
// COMMONS
export const StringSchema = v.string()
export const StringArraySchema = v.array(StringSchema)
export const BooleanSchema = v.boolean()
export const NumberSchema = v.number()
// INTEGERS
export const IntegerSchema = v.number([v.integer()])
export const Int8Schema = v.number([v.integer(), v.minValue(INT8_MIN), v.maxValue(INT8_MAX)])
export const Iint16Schema = v.number([v.integer(), v.minValue(INT16_MIN), v.maxValue(INT16_MAX)])
export const Int32Schema = v.number([v.integer(), v.minValue(INT32_MIN), v.maxValue(INT32_MAX)])
// export const Int64Schema = IntegerSchema.min(INT64_MIN).max(INT64_MAX)
export const BigIntegerSchema = v.bigint()
// NATURALS
export const NaturalSchema = v.number([v.integer(), v.minValue(0)])
export const Uint8Schema = v.number([v.integer(), v.minValue(0), v.maxValue(INT8_MAX)])
export const Uint16Schema = v.number([v.integer(), v.minValue(0), v.maxValue(INT16_MAX)])
export const Uint32Schema = v.number([v.integer(), v.minValue(0), v.maxValue(INT32_MAX)])
// export const Uint64Schema = NaturalSchema.max(UINT64_MAX)
export const BigUintSchema = v.bigint([v.minValue(0n)])
