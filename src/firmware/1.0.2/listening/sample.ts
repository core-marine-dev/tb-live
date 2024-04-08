import { SAMPLE_END, SAMPLE_SPLIT, SAMPLE_START } from '../../../constants'
import type { ListeningEmitterFrame, Frame, ListeningReceiverFrame } from '../../../types'
import { getLineData, getLineSNR, getLinesTemperature } from '../../../utils'

export const parseSample = (raw: string): Frame | ListeningEmitterFrame | ListeningReceiverFrame => {
  const data = raw.slice(SAMPLE_START.length, -SAMPLE_END.length).split(SAMPLE_SPLIT)
  // Emitter
  if (data.length === 8) return { ...emitter(data), raw }
  // Receiver
  if (data.length === 7) return { ...receiver(data), raw }
  // Unknown
  return { name: 'sample', raw, error: 'unknown frame', data }
}

/** Emitter: Acoustic detection
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
export const emitter = (elements: string[]): Omit<ListeningEmitterFrame, 'raw'> => {
  const name = 'emitter'
  const receiver: string = elements[0]
  const seconds: number = parseInt(elements[1])
  const milliseconds: number = parseInt(elements[2])
  const protocol: string = elements[3]
  const emitter: string = elements[4]
  const data: number = parseInt(elements[5])
  const line = getLineData(data)
  const snr: number = parseInt(elements[6])
  const signal = getLineSNR(snr)
  const frequency: number = parseInt(elements[7])
  return {
    name,
    data: [receiver, seconds, milliseconds, protocol, emitter, data, snr, frequency],
    fields: [
      { name: 'receiver', type: 'string', data: receiver },
      { name: 'seconds', type: 'uint32', units: 'seconds', data: seconds },
      { name: 'milliseconds', type: 'uint16', units: 'milliseconds', data: milliseconds },
      { name: 'protocol', type: 'string', data: protocol },
      { name: 'emitter', type: 'string', data: emitter },
      { name: 'data', type: 'uint16', units: 'degrees', data, metadata: line },
      { name: 'snr', type: 'uint8', data: snr, metadata: signal },
      { name: 'frequency', type: 'uint8', units: 'kHz', data: frequency }
    ],
    metadata: {
      receiver,
      sample: {
        timestamp: parseInt(`${seconds}${milliseconds}`),
        emitter,
        frequency,
        protocol,
        angle: {
          avg: line.angle.degrees,
          std: line.deviation.degrees,
        },
        snr: {
          value: signal.raw,
          signal: signal.signal
        }
      }
    }
  }
}
/** Receiver: Receiver Log
 * Field |  Type  | Description
 *     0 | string | Receiver serial number
 *     1 | uint32 | UTC UNIX timestamp (automatically reset to 1. Jan. 2000 when power is off)
 *     2 | string | Tranceiver sensor readings (TB Live has a factory calibrated temperature chip inside the housing for water temperature documentation, and monitors background noise with the hydrophone)
 *     3 |  int16 | Temperature ((data-50)/10 -> °C)
 *     4 |  uint8 | Average background noise, range = 0 to 255 (based on ADC samples logged during the last second if no signal is present)
 *     5 |  uint8 | Peak background noise, range = 0 to 255 (based on low pass filtered peak ADC samples)
 *     6 |  uint8 | Receiver listening frequency,  range 63-77 kHz
*/

// Sample: $001129,1551087600,TBR Sensor,280,3,8,69
export const receiver = (elements: string[]): Omit<ListeningReceiverFrame, 'raw'> => {
  const name = 'receiver'
  const receiver: string = elements[0]
  const seconds: number = parseInt(elements[1])
  const log: string = elements[2]
  const temperature: number = parseInt(elements[3])
  const linesTemperature = getLinesTemperature(temperature)
  const noiseAverage: number = parseInt(elements[4])
  const noisePeak: number = parseInt(elements[5])
  const frequency: number = parseInt(elements[6])
  return {
    name,
    data: [receiver, seconds, log, temperature, noiseAverage, noisePeak, frequency],
    fields: [
      { name: 'receiver', type: 'string', data: receiver },
      { name: 'seconds', type: 'uint32', units: 'seconds', data: seconds },
      { name: 'log', type: 'string', data: log },
      { name: 'temperature', type: 'uint16', units: 'celsius', data: temperature, metadata: linesTemperature },
      { name: 'noiseAverage', type: 'uint8', data: noiseAverage },
      { name: 'noisePeak', type: 'uint8', data: noisePeak },
      { name: 'frequency', type: 'uint8', units: 'kHz', data: frequency }
    ],
    metadata: {
      receiver,
      sample: {
        timestamp: parseInt(`${seconds}000`),
        log,
        frequency,
        temperature: linesTemperature.degrees,
        noise: {
          average: noiseAverage,
          peak: noisePeak
        }
      }
    }
  }
}
