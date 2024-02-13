/** Acoustic detection
 * Field |  Type  | Description
 *     0 | string | Receiver serial number
 *     1 | uint32 | Timestamp in seconds since Epoch (or power up if a clock has not been set)
 *     2 | uint16 | Milliseconds of timestamp
 *     3 | string | Transmitter Protocol
 *     4 | string | Transmitter serial number
 *     5 | uint16 | Transmitter Data Value
 *                | Bits  | Type   | Description
 *                | 00-09 | uint10 | Average inclination -> (0 - 1023) / 10 => 0.0° - 102.3° with ±0.10° resolution
 *                | 10-15 | uint6  | Standard deviation  -> (0 - 64) / 4    => 0.0° - 15.75° with ±0.15° resolution
 *     6 |  uint8 | Detection SNR (0-255)
 *                | signal  | SNR
 *                |    weak | 0 <= SNR <= 6
 *                | regular | 6 < SNR < 25
 *                |  strong | 25 <= SNR
 *                | typical | 6 < SNR < 60 typical values 
 *     7 |  uint8 | Transmitter Detection Frequency in kHz, range 63-77 kHz
 *     8 | uint32 | Number of strings sent since power up
*/

// Sample: $1000042,0000002202,615,S64K,1285,0,24,69,11

import { SerialNumber } from "../../types"

type Response = {
  serialNumber: SerialNumber

}

export const acousticDetection = (fields: string[]) => {

}