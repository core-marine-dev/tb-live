import * as v from 'valibot'
import { PROTOCOLS_FRAME_LENGTH, PROTOCOLS_START } from '../../../constants'
import { type Frame } from '../../../types'

export const PROTOCOLS = {
  // Single Channel
  '00': { channel: 'single', id: ['R256', 'R04K', 'R64K'], data: ['S256'] },
  '01': { channel: 'single', id: ['R64K', 'R01M'], data: ['S256', 'S64K'] },
  '02': { channel: 'single', id: ['R01M'], data: ['S64K'] },
  '03': { channel: 'single', id: ['R01M'], data: [] },
  '04': { channel: 'single', id: [], data: ['S64K'] },
  '05': { channel: 'single', id: [], data: ['HS256'] },
  '06': { channel: 'single', id: [], data: ['DS256'] },
  '07': { channel: 'single', id: ['OPi'], data: ['OPs'] },
  '08': { channel: 'single', id: ['R64K', 'R01M', 'OPi'], data: ['S256', 'S64K', 'OPs'] },
  // Dual Channel
  30: { channel: 'dual', id: ['R256', 'R04K', 'R64K'], data: ['S256'] },
  31: { channel: 'dual', id: ['R64K', 'R01M'], data: ['S256', 'S64K'] },
  32: { channel: 'dual', id: ['R01M'], data: ['S64K'] },
  33: { channel: 'dual', id: ['R01M'], data: [] },
  34: { channel: 'dual', id: [], data: ['S64K'] },
  35: { channel: 'dual', id: [], data: ['HS256'] },
  36: { channel: 'dual', id: [], data: ['DS256'] },
  37: { channel: 'dual', id: ['OPi'], data: ['OPs'] },
  38: { channel: 'dual', id: ['R64K', 'R01M', 'OPi'], data: ['S256', 'S64K', 'OPs'] },
  // Triple Channel
  60: { channel: 'triple', id: ['R256', 'R04K', 'R64K'], data: ['S256'] },
  61: { channel: 'triple', id: ['R64K', 'R01M'], data: ['S256', 'S64K'] },
  62: { channel: 'triple', id: ['R01M'], data: ['S64K'] },
  63: { channel: 'triple', id: ['R01M'], data: [] },
  64: { channel: 'triple', id: [], data: ['S64K'] },
  65: { channel: 'triple', id: [], data: ['HS256'] },
  66: { channel: 'triple', id: [], data: ['DS256'] },
  67: { channel: 'triple', id: ['OPi'], data: ['OPs'] },
  68: { channel: 'triple', id: ['R64K', 'R01M', 'OPi'], data: ['S256', 'S64K', 'OPs'] }
} as const

export const ProtocolSchema = v.string(
  [
    v.custom(input => !isNaN(Number(input)), 'it is not a number'),
    v.custom(input => Number.isInteger(Number(input)), 'it is not an integer'),
    v.custom(input => input in PROTOCOLS, 'invalid listenning mode protocol')
  ]
)

export const parseProtocols = (text: string): Frame => {
  const name = 'listening protocols'
  // Incomplete Frame
  if (text.length < PROTOCOLS_FRAME_LENGTH) { return { name, raw: text, error: 'frame incomplete' } }
  // Get Protocols
  const raw = text
  const lm = raw.replace(PROTOCOLS_START, '')
  // Incorrect Protocols
  if (isNaN(Number(lm))) { return { name, raw, error: `${lm} is not a number` } }
  const parsed = v.safeParse(ProtocolSchema, lm)
  if (!parsed.success) { return { name, raw, error: parsed.issues[0].message } }
  // Protocols
  const lmProtocol = parsed.output as keyof typeof PROTOCOLS
  const metadata = PROTOCOLS[lmProtocol]
  return {
    name,
    raw,
    data: [lm],
    fields: [{ name: 'protocols', type: 'string', data: lmProtocol, metadata }],
    metadata: {
      lm: lmProtocol,
      channel: metadata.channel,
      protocols: {
        id: [...metadata.id],
        data: [...metadata.data]
      }
    }
  }
}
