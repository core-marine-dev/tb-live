import * as v from 'valibot'
import { TIMESTAMP_FRAME_LENGTH, TIMESTAMP_LENGTH, TIMESTAMP_START } from "../../../constants"

const TimestampSchema = v.string(
  [
    v.length(TIMESTAMP_LENGTH, 'invalid length for timestamp'),
    v.custom(input => !isNaN(Number(input)), 'it is not a string-number'),
    v.custom(input => Number.isInteger(Number(input)), 'it is not a string-integer'),
    v.custom(input => Number(input) >= 0, 'it is not a string-integer positive'),
  ]
)


export const parseTimestamp = (text: string) => {
  const frame = 'device time'
  // Incomplete Frame
  if (text.length < TIMESTAMP_FRAME_LENGTH) { return { frame, raw: text, error: 'frame incomplete' } }
  // Get Timestamp
  const raw = text
  const tm = raw.replace(TIMESTAMP_START, '')
  // Incorrect Timestamp
  if (isNaN(Number(tm))) { return { frame, raw, error: `${tm} is not a string-number` } }
  const parsed = v.safeParse(TimestampSchema, tm)
  if (!parsed.success) { return { frame, raw, error: parsed.issues[0].message } }
  // Timestamp
  const seconds = parsed.output
  const timestamp = Number(seconds) * 1000
  const date = (new Date(timestamp)).toISOString()
    return {
      frame,
      raw,
      data: [tm],
      fields: [{ name: 'timestamp', type: 'uint16', units: 'seconds', data: seconds, metadata: date }],
      object: {
        timestamp,
        date
      }
    }
}
