import * as v from 'valibot'
import {
  EmitterSchema, FirmwareSchema, FrequencySchema, ModeSchema, ReceiverSchema, SerialNumberSchema
} from "./schemas";
import { LISTENING_FRAMES } from './constants';

// TB LIVE
export type SerialNumber = v.Input<typeof SerialNumberSchema>
export type Frequency = v.Input<typeof FrequencySchema>
export type Firmware = v.Input<typeof FirmwareSchema>
export type Mode = v.Input<typeof ModeSchema>
export type Emitter = v.Input<typeof EmitterSchema>
export type Receiver = v.Input<typeof ReceiverSchema>

export type ListeningFrame = typeof LISTENING_FRAMES[number]

export type TODO = any

export type FramesParser = (text: string) => [TODO[], string]
export type MapModeParser = Map<Mode, FramesParser>
export type MapFirmwareParser = Map<Firmware, MapModeParser>

// LISTENING
// type AcousticSensorSample = {
//   raw: string,           // Raw string with the sample data
// 	serial_number: string, // 6 digits - odd numbers - excluded 104-105-106-107-110-111
// 	frequency: Uint8,      // 63 - 77 KHz
// 	protocol: string,
// 	angle: {
// 		average: Float32,   // 0.0° - 102.3° ±0.1° -> 10 bits = 0 - 1023 / 10
// 		deviation: Float32, // 0.0° - 15.75° ±0.15° -> 6 bits = 0 - 63   /  4
// 	  raw: uint16,
// 	},
// 	snr: uint8,           // snr <= 6 = weak signal | 6 < snr < 25 = regular signal | 25 <= snr = strong signal ||  6 < snr < 60 typical values  
// 	timestamp: {
// 		sample: string,    // UNIX Epoch in milliseconds
// 		read: string       // UNIX Epoch in milliseconds
// 	},
//   sample_number?: uint32
// }

// type AcousticSensor = {
// 	serial_number: string, // 6 digits - odd numbers - excluded 104-105-106-107-110-111
// 	frequency: uint8,      // 63 - 77 KHz
// 	samples: AcousticSensorSample[]	
// }

// type HydrophoneSample = {
//   raw: string,           // Raw string with the sample data
// 	serial_number: string, // 6 digits - odd numbers - excluded 104-105-106-107-110-111
// 	frequency: uint8,      // 63 - 77 KHz
// 	log: string,
// 	temperature: int16,    // (data - 50) / 10 -> °C
// 	noise: {
// 		average: uint8,
// 		peak: uint8.
// 	},
// 	timestamp: {
// 		sample: string,    // UNIX Epoch in milliseconds
// 		read: string       // UNIX Epoch in milliseconds
// 	},
//   sample_number?: uint32
// }

// type Hydrophone = {
// 	serial_number: string, // 6 digits - odd numbers - excluded 104-105-106-107-110-111
// 	frequency: uint8,      // 63 - 77 KHz
// 	samples: HydrophoneSample[],
// 	sensors: AcousticSensor[]
// }