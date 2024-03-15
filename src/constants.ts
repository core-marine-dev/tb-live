
export const FIELD_TYPE = ['int8', 'int16', 'int32', 'uint8', 'uint16', 'uint32', 'string', 'boolean'] as const

export const FIRMWARES_AVAILABLE = ['1.0.1', '1.0.2'] as const

// COMMAND FLAGS
export const SERIAL_NUMBER_START = 'SN='
export const SERIAL_NUMBER_LENGTH_MIN = 6
export const SERIAL_NUMBER_LENGTH_MAX = 7
export const SERIAL_NUMBER_FRAME_LENGTH_MIN = SERIAL_NUMBER_START.length + SERIAL_NUMBER_LENGTH_MIN
export const SERIAL_NUMBER_FRAME_LENGTH_MAX = SERIAL_NUMBER_START.length + SERIAL_NUMBER_LENGTH_MAX
export const SERIAL_NUMBERS_RESERVED = [104, 105, 106, 107, 110, 111]

export const FIRMWARE_START = 'FV='

export const FREQUENCY_START = 'FC='
export const FREQUENCY_LENGTH = 2
export const FREQUENCY_FRAME_LENGTH = FREQUENCY_START.length + FREQUENCY_LENGTH
export const FREQUENCY_MIN = 63
export const FREQUENCY_MAX = 77

export const LOG_INTERVAL_START = 'LI='
export const LOG_INTERVAL_LENGTH = 2
export const LOG_INTERVAL_FRAME_LENGTH = LOG_INTERVAL_START.length + LOG_INTERVAL_LENGTH
export const LOG_INTERVAL_MIN = 0
export const LOG_INTERVAL_MAX = 7

export const PROTOCOLS_START = 'LM='
export const PROTOCOLS_LENGTH = 2
export const PROTOCOLS_FRAME_LENGTH = PROTOCOLS_START.length + PROTOCOLS_LENGTH
export const PROTOCOLS_SINGLE_CHANNEL_MIN = 0
export const PROTOCOLS_SINGLE_CHANNEL_MAX = 8
export const PROTOCOLS_DUAL_CHANNEL_MIN = 30
export const PROTOCOLS_DUAL_CHANNEL_MAX = 38
export const PROTOCOLS_TRIPLE_CHANNEL_MIN = 60
export const PROTOCOLS_TRIPLE_CHANNEL_MAX = 68

export const TIMESTAMP_START = 'UT='
export const TIMESTAMP_LENGTH = 10
export const TIMESTAMP_FRAME_LENGTH = TIMESTAMP_START.length + TIMESTAMP_LENGTH

export const API_START = 'In Command Mode'
export const API_END = 'L is Luhn\'s verification number.'

export const RESTART_DEVICE = 'RR!'
export const FACTORY_RESET = 'FS!'
export const UPGRADE_FIRMWARE = 'UF!'

export const FLAGS_COMMAND = [SERIAL_NUMBER_START, FIRMWARE_START, FREQUENCY_START, LOG_INTERVAL_START, PROTOCOLS_START, TIMESTAMP_START, API_START, RESTART_DEVICE, FACTORY_RESET, UPGRADE_FIRMWARE] as const
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


// export const MODES = ['listening', 'command', 'update'] as const
export const MODES = ['listening', 'command'] as const

export const LISTENING_FRAMES = ['sample', 'ping', 'roundClock', 'setClock'] as const

export const LISTENING_MODE = 'EX!'
export const COMMAND_MODE = 'LIVECM'
export const UPDATE_MODE = 'UF!'

export const EMITTER_ANGLE_BIT_LENGTH = 10
export const EMITTER_ANGLE_FACTOR = 10
export const EMITTER_DEVIATION_BIT_LENGTH = 6
export const EMITTER_DEVIATION_FACTOR = 4
// TB LIVE
