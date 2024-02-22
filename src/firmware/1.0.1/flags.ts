import { SERIAL_NUMBER_LENGTH_MAX, SERIAL_NUMBER_LENGTH_MIN } from "../../constants"

// LISTENING MODE
export const SAMPLE_START = '$'
export const SAMPLE_END = '\r'
export const SAMPLE_SPLIT = ','

export const PING_START = 'SN='
export const PING_END = '><>\r'
export const PING_LENGTH_MIN = PING_START.length + PING_END.length + SERIAL_NUMBER_LENGTH_MIN
export const PING_LENGTH_MAX = PING_START.length + PING_END.length + SERIAL_NUMBER_LENGTH_MAX

// export const CLOCK_FLAG = 'ack'
export const CLOCK_ROUND = 'ack01\r'
export const CLOCK_SET = 'ack02\r'

export const FLAGS_LISTENING = [SAMPLE_START, PING_START, CLOCK_ROUND, CLOCK_SET] as const

// COMMAND FLAGS
export const SERIAL_NUMBER_START = 'SN='

export const FIRMWARE_START = 'FV='

export const FREQUENCY_START = 'FC='

export const LOG_INTERVAL_START = 'LI='

export const PROTOCOL_START = 'LM='

export const TIME_START = 'UT='

export const API_START = 'In Command Mode'
export const API_END = 'L is Luhn\'s verification number.'

export const RESTART_DEVICE = 'RR!'
export const FACTORY_RESET = 'FS!'
export const UPGRADE_FIRMWARE = 'UF!'

export const FLAGS_COMMAND = [SERIAL_NUMBER_START, FIRMWARE_START, FREQUENCY_START, LOG_INTERVAL_START, PROTOCOL_START, TIME_START, API_START, RESTART_DEVICE, FACTORY_RESET, UPGRADE_FIRMWARE] as const

export type FLAG = typeof FLAGS_LISTENING[number] | typeof FLAGS_COMMAND[number]
export type FLAGS = typeof FLAGS_LISTENING | typeof FLAGS_COMMAND
