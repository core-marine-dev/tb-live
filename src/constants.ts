
// INTEGERS
export const INT8_MIN = -Math.pow(2, 7)
export const INT8_MAX = -INT8_MIN - 1

export const INT16_MIN = -Math.pow(2, 16)
export const INT16_MAX = -INT16_MIN - 1

export const INT32_MIN = -Math.pow(2, 32)
export const INT32_MAX = -INT32_MIN - 1
// UNSIGNED INTEGERS
export const UINT_MIN = 0
export const UINT8_MAX = Math.pow(2, 8) - 1
export const UINT16_MAX = Math.pow(2, 16) - 1
export const UINT32_MAX = Math.pow(2, 32) - 1
// TB LIVE
export const FIRMWARES_AVAILABLE = ['1.0.1', '1.0.2'] as const

export const FREQUENCY_MIN = 63
export const FREQUENCY_MAX = 77

export const SERIAL_NUMBERS_RESERVED = [104, 105, 106, 107, 110, 111]

export const SERIAL_NUMBER_LENGTH_MIN = 6
export const SERIAL_NUMBER_LENGTH_MAX = 7
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