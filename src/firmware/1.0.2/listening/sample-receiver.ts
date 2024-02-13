/** Receiver Log
 * Field |  Type  | Description
 *     0 | string | Receiver serial number
 *     1 | uint32 | UTC UNIX timestamp (automatically reset to 1. Jan. 2000 when power is off)
 *     2 | string | tranceiver sensor readings (TB Live has a factory calibrated temperature chip inside the housing for water temperature documentation, and monitors background noise with the hydrophone)
 *     3 |  int16 | Temperature ((data-50)/10 -> °C)
 *     4 |  uint8 | Average background noise, range = 0 to 255 (based on ADC samples logged during the last second if no signal is present)
 *     5 |  uint8 | Peak background noise, range = 0 to 255 (based on low pass filtered peak ADC samples)
 *     6 |  uint8 | Receiver listening frequency,  range 63-77 kHz
*/

// Sample: $001129,1551087600,TBR Sensor,280,3,8,69