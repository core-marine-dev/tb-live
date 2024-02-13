/** Acoustic detection
 * Field |  Type  | Description
 *     0 | string | Receiver serial number
 *     1 | uint32 | UTC UNIX timestamp (automatically reset to 1. Jan. 2000 when power is off) 
 *     2 | uint16 | Milliseconds of timestamp
 *     3 | string | Transmit Protocol
 *     4 | string | Transmitter serial number
 *     5 | uint16 | Transmitter Data Value (",," blank for non-data transmit protocols)
 *                | Bits  | Type   | Description
 *                | 00-09 | uint10 | Average inclination -> (0 - 1023) / 10 => 0.0° - 102.3° with ±0.10° resolution
 *                | 10-15 | uint6  | Standard deviation  -> (0 - 64) / 4    => 0.0° - 15.75° with ±0.15° resolution
 *     6 |  uint8 | Detection SNR (0-255)
 *                  weak signal    ===  0 <= SNR <= 6
 *                  regular signal ===  6 < SNR < 25
 *                  strong signal  === 25 <= SNR
 *                  typical values ===  6 < SNR < 60 typical values 
 *     7 |  uint8 | Transmitter Detection Frequency in kHz, range 63-77 kHz
*/

// Sample: $001129,1551087572,897,OPs,15,32,33,69