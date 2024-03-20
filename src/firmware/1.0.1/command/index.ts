import { TODO } from "../../../types"
import { API_START, FACTORY_RESET, FIRMWARE_START, FREQUENCY_FRAME_LENGTH, LOG_INTERVAL_FRAME_LENGTH, PROTOCOLS_FRAME_LENGTH, RESTART_DEVICE, SERIAL_NUMBER_FRAME_LENGTH_MAX, TIMESTAMP_FRAME_LENGTH, UPGRADE_FIRMWARE, FLAGS_COMMAND, FREQUENCY_START, LOG_INTERVAL_START, PROTOCOLS_START, SERIAL_NUMBER_START, TIMESTAMP_START } from "../../../constants"
import { parseSerialNumber } from './serial-number'
import { parseFrequency } from './frequency'
import { parseLogInterval } from './log-interval'
import { parseProtocols } from './protocol'
import { parseTimestamp } from "./timestamp"
import { parseAPI } from "./api"
import { parseFirmware } from "./firmware"

/** COMMAND MODE
 * 01 - Serial Number -> SN=1234567
 * 02 - Firmware      -> FV=[v]X.Y.Z[.live700]
 * 03 - Frequency     -> FC=XY (63 - 77)
 * 04 - Log Interval  -> LI=XY
 * 05 - Protocols     -> LM=XY
 * 06 - Time          -> UT=<timestamp seconds>
 * 07 - Commands      -> In Command Mode... L is Luhn's verification number.
 * 
 * 08 - Restart -> RR!
 * 09 - Factory reset -> FS!
 * 10 - Upgrade FW -> UF!
*/

export const serialNumber = (text: string): { frame: TODO, remainder: string } => {
  const endIndex = SERIAL_NUMBER_FRAME_LENGTH_MAX
  const data = text.slice(0, endIndex)
  const parsed = parseSerialNumber(data)
  const remainderIndex = (parsed.error !== undefined) ? SERIAL_NUMBER_START.length : parsed.raw.length
  const remainder = text.slice(remainderIndex)
  return { frame: { ...parsed }, remainder }
}

export const firmware = (text: string): { frame: TODO, remainder: string } => {
  const parsed = parseFirmware(text)
  const remainderIndex = (parsed.error !== undefined) ? FIRMWARE_START.length : text.indexOf(parsed.object?.firmware as string) + (parsed.object?.firmware as string).length
  const remainder = text.slice(remainderIndex)
  return { frame: { ...parsed }, remainder }
}

export const frequency = (text: string): { frame: TODO, remainder: string } => {
  const endIndex = FREQUENCY_FRAME_LENGTH
  const data = text.slice(0, endIndex)
  const parsed = parseFrequency(data)
  const remainderIndex = (parsed.error !== undefined) ? FREQUENCY_START.length : parsed.raw.length
  const remainder = text.slice(remainderIndex)
  return { frame: { ...parsed }, remainder }
}

export const logInterval = (text: string): { frame: TODO, remainder: string } => {
  const endIndex = LOG_INTERVAL_FRAME_LENGTH
  const data = text.slice(0, endIndex)
  const parsed = parseLogInterval(data)
  const remainderIndex = (parsed.error !== undefined) ? LOG_INTERVAL_START.length : parsed.raw.length
  const remainder = text.slice(remainderIndex)
  return { frame: { ...parsed }, remainder }
}

export const protocols = (text: string): { frame: TODO, remainder: string } => {
  const endIndex = PROTOCOLS_FRAME_LENGTH
  const data = text.slice(0, endIndex)
  const parsed = parseProtocols(data)
  const remainderIndex = (parsed.error !== undefined) ? PROTOCOLS_START.length : parsed.raw.length
  const remainder = text.slice(remainderIndex)
  return { frame: { ...parsed }, remainder }
}

export const timestamp = (text: string): { frame: TODO, remainder: string } => {
  const endIndex = TIMESTAMP_FRAME_LENGTH
  const data = text.slice(0, endIndex)
  const parsed = parseTimestamp(data)
  const remainderIndex = (parsed.error !== undefined) ? TIMESTAMP_START.length : parsed.raw.length
  const remainder = text.slice(remainderIndex)
  return { frame: { ...parsed }, remainder }
}

export const api = (text: string): { frame: TODO, remainder: string } => {
  const parsed = parseAPI(text)
  const remainderIndex = (parsed.error !== undefined) ? API_START.length : parsed.raw.length
  const remainder = text.slice(remainderIndex)
  return { frame: { ...parsed }, remainder }
}

export const restart = (text: string): { frame: TODO, remainder: string } => ({
  remainder: text.slice(RESTART_DEVICE.length),
  frame: {
    frame: 'restart device',
    raw: RESTART_DEVICE,
  }
})

export const factoryReset = (text: string): { frame: TODO, remainder: string } => ({
  remainder: text.slice(FACTORY_RESET.length),
  frame: {
    frame: 'factory reset',
    raw: FACTORY_RESET,
  }
})

export const upgradeFirmware = (text: string): { frame: TODO, remainder: string } => ({
  remainder: text.slice(UPGRADE_FIRMWARE.length),
  frame: {
    frame: 'upgrade firmware',
    raw: UPGRADE_FIRMWARE,
  }
})

export const commands = {
  'SN=': serialNumber,
  'FV=': firmware,
  'FC=': frequency,
  'LI=': logInterval,
  'LM=': protocols,
  'UT=': timestamp,
  'In Command Mode': api,
  'RR!': restart,
  'FS!': factoryReset,
  'UF!': upgradeFirmware,
}

export const parse = (input: string, flag: typeof FLAGS_COMMAND[number]): { frame: TODO, remainder: string } => {
  if (!Object.keys(commands).includes(flag)) { return { frame: null, remainder: input } }
  return commands[flag](input)
}
