import * as v from 'valibot'
import {
  BigUintSchema, EmitterSchema, FrequencySchema, Int16Schema, Int32Schema, Int8Schema, ReceiverConfigSchema, SerialNumberSchema, Uint16Schema, Uint32Schema, Uint8Schema
} from "./schemas";
// INTEGERS
export type Int8 = v.Input<typeof Int8Schema>
export type Int16 = v.Input<typeof Int16Schema>
export type Int32 = v.Input<typeof Int32Schema>
// NATURALS
export type Uint8 = v.Input<typeof Uint8Schema>
export type Uint16 = v.Input<typeof Uint16Schema>
export type Uint32 = v.Input<typeof Uint32Schema>
export type BigUint = v.Input<typeof BigUintSchema>
// Hydrophone
export type SerialNumber = v.Input<typeof SerialNumberSchema>
export type Frequency = v.Input<typeof FrequencySchema>
export type Emitter = v.Input<typeof EmitterSchema>
export type ReceiverConfig = v.Input<typeof ReceiverConfigSchema>
