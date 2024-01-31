import * as v from 'valibot'
import { BigUintSchema, Iint16Schema, Int32Schema, Int8Schema, SerialNumberSchema, Uint16Schema, Uint32Schema, Uint8Schema } from "./schemas";
// INTEGERS
export type Int8 = v.Input<typeof Int8Schema>
export type Int16 = v.Input<typeof Iint16Schema>
export type Int32 = v.Input<typeof Int32Schema>
// NATURALS
export type Uint8 = v.Input<typeof Uint8Schema>
export type Uint16 = v.Input<typeof Uint16Schema>
export type Uint32 = v.Input<typeof Uint32Schema>
export type BigUint = v.Input<typeof BigUintSchema>
// Hydrophone
export type SerialNumber = v.Input<typeof SerialNumberSchema>


// export type Sensor = {
//   serialNumber: 
// }





// export interface  {
//   parseData: (input: string): 
// }
