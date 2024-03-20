import * as v from 'valibot'
import { FREQUENCY_FRAME_LENGTH, FREQUENCY_START } from "../../../constants"
import { FrequencySchema } from '../../../schemas'


export const parseFrequency = (text: string) => {
  const frame = 'frequency'
  // Incomplete Frame
  if (text.length < FREQUENCY_FRAME_LENGTH) { return { frame, raw: text, error: 'frame incomplete' } }
  // Get Frequency
  const raw = text
  const fq = raw.replace(FREQUENCY_START, '')
  const numFq = Number(fq)
  // Incorrect Frequency
  if (isNaN(numFq)) { return { frame, raw, error: `${fq} is not a number` } }
  const parsed = v.safeParse(FrequencySchema, numFq)
  if (!parsed.success) { return { frame, raw, error: parsed.issues[0].message } }
  // Frequency
  const frequency = parsed.output
  return {
    frame,
    raw,
    data: [frequency],
    fields: [{ name: 'frequency', type: 'uint8', units: 'kHz', data: frequency }],
    object: {
      frequency
    }
  }
}
