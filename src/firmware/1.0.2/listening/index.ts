import { PING_FLAG_START, CLOCK_FLAG_ROUND, SAMPLE_FLAG_START, CLOCK_FLAG_SET, SAMPLE_FLAG_END, PING_FLAG_END } from "../../../constants"
import { ListeningFrame, TODO } from "../../../types"
import { parseClock } from "./clock"
import { parsePing } from "./ping"
import { parseSample } from "./sample"


/** LISTENING MODE
 * 00 - Emitter sample  -> $...,..., ...\r (9 fields) === Acoustic detection 
 * 00 - Receiver sample -> $...,..., ...\r (8 fields) === Log 
 * 01 - Ping            -> SN=1234567 ><>\r
 * 02 - Round clock     -> ack01\r
 * 03 - Set clock       -> ack02\r
*/
export const getFramesIndex = (input: string): [number, ListeningFrame | null] => {
  const indexSample = input.indexOf(SAMPLE_FLAG_START)
  const indexPing = input.indexOf(PING_FLAG_START)
  const indexRoundClock = input.indexOf(CLOCK_FLAG_ROUND)
  const indexSetClock = input.indexOf(CLOCK_FLAG_SET)
  const index = Math.min(...[indexSample, indexPing, indexRoundClock, indexSetClock].filter(i => i > -1))
  // No data
  if (index === -1) return [-1, null]
  // Sample
  if (index === indexSample) return [index, 'sample']
  // Ping
  if (index === indexPing) return [index, 'ping']
  // Round Clock
  if (index === indexRoundClock) return [index, 'roundClock']
  // Set Clock
  if (index === indexSetClock) return [index, 'setClock']
  return [-1, null]
}

export const sample = (text: string): [TODO, string] => {
  const endIndex = text.indexOf(SAMPLE_FLAG_END) + SAMPLE_FLAG_END.length
  const frame = text.slice(0, endIndex)
  if (frame.includes(PING_FLAG_START)) {
    const index = frame.indexOf(PING_FLAG_START)
    const subframe = frame.slice(index)
    const response = parsePing(subframe)
    return [response, text.slice(0, index) + text.slice(endIndex)]
  }
  const response = parseSample(frame)
  return [response, text.slice(endIndex)]
}

export const ping = (text: string): [TODO, string] => {
  const endIndex = text.indexOf(PING_FLAG_END) + PING_FLAG_END.length
  const frame = text.slice(0, endIndex)
  const response = parsePing(frame)
  return [response, text.slice(endIndex)]
}

export const clock = (text: string, operation: 'round' | 'set'): [TODO, string] => {
  const frame = (operation === 'round') ? CLOCK_FLAG_ROUND : CLOCK_FLAG_SET
  const response = parseClock(frame, operation)
  const txt = text.slice(frame.length)
  return [response, txt]
}

export const roundClock = (text: string) => clock(text, 'round')
export const setClock = (text: string) => clock(text, 'set')

const ops: Record<ListeningFrame, (txt: string) => [TODO, string]> =  {
  'sample': sample,
  'ping': ping,
  'roundClock': roundClock,
  'setClock': setClock
}

export const parse = (input: string): [TODO[], string] => {
  let text = input
  let response: TODO[] = []
  while (text.length > 0) {
    const [index, type] = getFramesIndex(text)
    if (index === -1 || type === null) {
      // text = ''
      break
    }
    text = text.slice(index)
    const [res, txt] = ops[type](text)
    response.push(res)
    text = txt
  }
  return [response, text]
}
