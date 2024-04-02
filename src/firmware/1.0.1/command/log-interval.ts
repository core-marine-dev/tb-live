import * as v from 'valibot'
import { LOG_INTERVAL_FRAME_LENGTH, LOG_INTERVAL_MAX, LOG_INTERVAL_MIN, LOG_INTERVAL_START } from '../../../constants'
import { type Frame } from '../../../types'

export const LogIntervalSchema = v.string(
  [
    v.custom(input => !isNaN(Number(input)), 'Log Interval: it is not a number'),
    v.custom(input => Number.isInteger(Number(input)), 'Log Interval: it is not an integer'),
    v.custom(input => Number(input) >= LOG_INTERVAL_MIN, `Log Interval: interval should be greater equal to ${LOG_INTERVAL_MIN}`),
    v.custom(input => Number(input) <= LOG_INTERVAL_MAX, `Log Interval: interval should be less equal to ${LOG_INTERVAL_MAX}`)
  ]
)

export const LOG_INTERVALS = {
  '00': 'disabled',
  '01': '5 minutes',
  '02': '10 minutes',
  '03': '30 minutes',
  '04': '60 minutes',
  '05': '2 hours',
  '06': '12 hours',
  '07': '24 hours'
} as const

export const parseLogInterval = (text: string): Frame => {
  const name = 'log interval'
  // Incomplete Frame
  if (text.length < LOG_INTERVAL_FRAME_LENGTH) { return { name, raw: text, error: 'frame incomplete' } }
  // Get Log Interval
  const raw = text
  const li = raw.replace(LOG_INTERVAL_START, '')
  // Incorrect Log Interval
  if (isNaN(Number(li))) { return { name, raw, error: `${li} is not a number` } }
  const parsed = v.safeParse(LogIntervalSchema, li)
  if (!parsed.success) { return { name, raw, error: parsed.issues[0].message } }
  // Log Interval
  const logInterval = parsed.output as keyof typeof LOG_INTERVALS
  const metadata = LOG_INTERVALS[logInterval] ?? 'unknown'
  return {
    name,
    raw,
    data: [li],
    fields: [{ name: 'log interval', type: 'string', data: li, metadata }],
    metadata: {
      logInterval,
      time: metadata
    }
  }
}
