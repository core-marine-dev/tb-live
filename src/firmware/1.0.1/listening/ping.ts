import * as v from 'valibot'
import { SerialNumberSchema } from '../../../schemas'
import { PING_END, PING_START } from '../flags'

/**
 * PING:
 * Request -> ?
 * Response -> SN=XXXXXXX ><>\r
*/
export const parsePing = (text: string) => {
  const frame = 'ping'
  const raw = text
  const sn = text.slice(PING_START.length, -PING_END.length).trim()
  const parse = v.safeParse(SerialNumberSchema, sn)
  if (!parse.success) return { raw, frame, error: parse.issues[0].message }
  const receiver = parse.output
  return {
    raw: text,
    frame,
    data: [receiver],
    fields: [{ name: 'receiver', type: 'string', data: receiver }],
    object: {
      frame,
      receiver
    }
  }
}