/** Receiver Log
 * Field |  Type  | Description
 *     0 | string | Receiver serial number
 *     1 | uint32 | Timestamp in seconds since Epoch (or power up if a clock has not been set)
 *     2 | string | Identifier for Log Messages
 *     3 |  int16 | Temperature
 *     4 |  uint8 | Average background noise
 *     5 |  uint8 | Peak background noise
 *     6 |  uint8 | Detection SNR
 *     7 | uint32 | Number of strings sent since power up
*/

// Sample: $1000042,0000000600,TBR Sensor,297,15,29,69,6