import * as v from 'valibot'
import { StringSchema } from './schemas'
import { EMITTER_ANGLE_BIT_LENGTH, EMITTER_ANGLE_FACTOR, EMITTER_DEVIATION_FACTOR } from './constants'

export const utf8ToAscii = (text: string): string => {
  const utf8 = v.parse(StringSchema, text)
  const bytes = (new TextEncoder()).encode(utf8)
  return (new TextDecoder('ascii')).decode(bytes)
}

export const getLineData = (data: number) => {
  const angle = 0b000_0000_0011_1111_1111 & data
  const deviation = (0b0000_1111_1100_0000_0000 & data) >>> EMITTER_ANGLE_BIT_LENGTH
  return {
    raw: data,
    angle: {
      raw: angle,
      degrees: angle / EMITTER_ANGLE_FACTOR,
    },
    deviation: {
      raw: deviation,
      degrees: deviation / EMITTER_DEVIATION_FACTOR
    }
  }
}

export const getLineSNR = (snr: number) => {
  if (snr > 25) return { signal: 'strong' }
  if (snr > 6) return { signal: 'regular' }
  return { signal: 'weak' }
}

export const getLinesTemperature = (temperature: number) => ({ degrees: (temperature - 50) / 10 })
