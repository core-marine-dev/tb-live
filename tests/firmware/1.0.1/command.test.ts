import { describe, expect, test } from 'vitest'
import * as v from 'valibot'
import { serialNumber, firmware, frequency, logInterval, protocols, timestamp, api, restart, factoryReset, upgradeFirmware } from '../../../src/firmware/1.0.1/command'
import { API_END, API_START, FACTORY_RESET, FIRMWARES_AVAILABLE, FIRMWARE_START, FREQUENCY_START, LOG_INTERVAL_START, PROTOCOLS_START, RESTART_DEVICE, SERIAL_NUMBER_START, TIMESTAMP_START, UPGRADE_FIRMWARE } from '../../../src/constants'
import { FrequencySchema, SerialNumberSchema } from '../../../src/schemas'
import { LOG_INTERVALS } from '../../../src/firmware/1.0.1/command/log-interval'
import { PROTOCOLS } from '../../../src/firmware/1.0.1/command/protocol'

describe('serial number', () => {
  const frame = 'serial number'

  test('happy path', () => {
    const sn = '1234567'
    const input = SERIAL_NUMBER_START + sn
    const output = serialNumber(input)
    const expected = {
      remainder: '',
      frame: {
        frame,
        raw: input,
        data: [sn],
        fields: [{ name: 'serial number', type: 'string', data: sn }],
        object: {
          serialNumber: sn
        }
      }
    }
    expect(output).toEqual(expected)
  })

  test('incomplete serial numbers', () => {
    const sn = '123456'
    const input = SERIAL_NUMBER_START + sn
    const output = serialNumber(input)
    const expected = {
      remainder: sn,
      frame: {
        frame,
        raw: input,
        error: 'frame incomplete'
      }
    }
    expect(output).toEqual(expected)
  })

  test('wrong serial numbers', () => {
    const sn = '123456a'
    const input = SERIAL_NUMBER_START + sn
    const output = serialNumber(input)
    const parsed = v.safeParse(SerialNumberSchema, sn)
    expect(parsed.success).toBeFalsy()
    if (!parsed.success) {
      const expected = {
        remainder: sn,
        frame: {
          frame,
          raw: input,
          error: parsed.issues[0].message
        }
      }
      expect(output).toEqual(expected)
    }
  })
})

describe('firmware', () => {
  const frame = 'firmware'

  test('happy path', () => {
    ['1.0.1', 'v1.0.1', 'v1.0.1aslfkjh'].forEach(sample => {
      const input = FIRMWARE_START + sample
      const output = firmware(input)
      const fw = '1.0.1'
      const expected = {
        remainder: sample.slice(sample.indexOf(fw) + fw.length),
        frame: {
          frame,
          raw: (sample.startsWith('v')) ? 'v' + fw : fw,
          data: [fw],
          fields: [{ name: 'firmware', type: 'string', data: fw }],
          object: {
            firmware: fw
          }
        }
      }
      expect(output).toEqual(expected)
    })

    ;['1.0.2', 'v1.0.2', 'v1.0.2aslfkjh'].forEach(sample => {
      const input = FIRMWARE_START + sample
      const output = firmware(input)
      const fw = '1.0.2'
      const expected = {
        remainder: sample.slice(sample.indexOf(fw) + fw.length),
        frame: {
          frame,
          raw: (sample.startsWith('v')) ? 'v' + fw : fw,
          data: [fw],
          fields: [{ name: 'firmware', type: 'string', data: fw }],
          object: {
            firmware: fw
          }
        }
      }
      expect(output).toEqual(expected)
    })
  })

  test('incomplete firmware', () => {
    const task = (fw, error) => {
      const input = FIRMWARE_START + fw
      const output = firmware(input)
      const expected = {
        remainder: fw,
        frame: {
          frame,
          raw: input,
          error
        }
      }
      expect(output).toEqual(expected)
    }
    ;[
      ['1', 'frame incomplete - no major version'],
      ['1.0', 'frame incomplete - no minor version'],
      ['1.0.', 'frame incomplete - no patch version'],
    ].forEach(([fw, error]) => task(fw, error))
  })

  test('non available firmware', () => {
    const task = (fw: string) => {
      const input = FIRMWARE_START + fw
      const output = firmware(input)
      const dots = fw.match(/\./g)?.length
      const raw = (dots === 3) ? fw.slice(0, fw.lastIndexOf('.')) : fw
      const expected = {
        remainder: fw,
        frame: {
          frame,
          raw,
          error: `Firmware: available firmwares are ${FIRMWARES_AVAILABLE}`
        }
      }
      expect(output).toEqual(expected)
    }
    ;['2.2.0', 'v1.0.3', 'v2.2.0.live700'].forEach((fw) => task(fw))
  })
})

describe('frequency', () => {
  const frame = 'frequency'

  test('happy path', () => {
    const fq = '65'
    const input = FREQUENCY_START + fq
    const output = frequency(input)
    const freq = parseInt(fq)
    const expected = {
      remainder: '',
      frame: {
        frame,
        raw: input,
        data: [freq],
        fields: [{ name: 'frequency', type: 'uint8', units: 'kHz', data: freq }],
        object: {
          frequency: freq
        }
      }
    }
    expect(output).toEqual(expected)
  })

  test('incomplete frequency', () => {
    const fq = '1'
    const input = FREQUENCY_START + fq
    const output = frequency(input)
    const expected = {
      remainder: fq,
      frame: {
        frame,
        raw: input,
        error: 'frame incomplete'
      }
    }
    expect(output).toEqual(expected)
  })

  test('wrong frequency', () => {
    const fq = '7a'
    const input = FREQUENCY_START + fq
    const output = frequency(input)
    const parsed = v.safeParse(FrequencySchema, fq)
    expect(parsed.success).toBeFalsy()
    if (!parsed.success) {
      const expected = {
        remainder: fq,
        frame: {
          frame: 'frequency',
          raw: input,
          error: `${fq} is not a number`
        }
      }
      expect(output).toEqual(expected)
    }
  })
})

describe('log interval', () => {
  const frame = 'log interval'

  test('happy path', () => {
    Object.entries(LOG_INTERVALS).forEach(([li, time]) => {
      const input = LOG_INTERVAL_START + li
      const output = logInterval(input)
      const expected = {
        remainder: '',
        frame: {
          frame,
          raw: input,
          data: [li],
          fields: [{ name: 'log interval', type: 'string', data: li, metadata: time }],
          object: {
            logInterval: li,
            time
          }
        }
      }
      expect(output).toEqual(expected)
    })

  })

  test('incomplete log interval', () => {
    const li = '1'
    const input = LOG_INTERVAL_START + li
    const output = logInterval(input)
    const expected = {
      remainder: li,
      frame: {
        frame,
        raw: input,
        error: 'frame incomplete'
      }
    }
    expect(output).toEqual(expected)
  })

  test('wrong log interval', () => {
    const li = '7a'
    const input = LOG_INTERVAL_START + li
    const output = logInterval(input)
    const expected = {
      remainder: li,
      frame: {
        frame,
        raw: input,
        error: `${li} is not a number`
      }
    }
    expect(output).toEqual(expected)
  })
})

describe('protocols', () => {
  const frame = 'listenning protocols'

  test('happy path', () => {
    Object.entries(PROTOCOLS).forEach(([lm, info]) => {
      const input = PROTOCOLS_START + lm
      const output = protocols(input)
      const expected = {
        remainder: '',
        frame: {
          frame,
          raw: input,
          data: [lm],
          fields: [{ name: 'protocols', type: 'string', data: lm, metadata: info }],
          object: {
            lm,
            channel: info.channel,
            protocols: {
              id: [...info.id],
              data: [...info.data]
            }
          }
        }
      }
      expect(output).toEqual(expected)

    })
  })

  test('incomplete protocols', () => {
    const lm = '1'
    const input = PROTOCOLS_START + lm
    const output = protocols(input)
    const expected = {
      remainder: lm,
      frame: {
        frame,
        raw: input,
        error: 'frame incomplete'
      }
    }
    expect(output).toEqual(expected)
  })

  test('wrong protocols', () => {
    const lm = '7a'
    const input = PROTOCOLS_START + lm
    const output = protocols(input)
    const expected = {
      remainder: lm,
      frame: {
        frame,
        raw: input,
        error: `${lm} is not a number`
      }
    }
    expect(output).toEqual(expected)
  })
})

describe('timestamp', () => {
  const frame = 'device time'

  test('happy path', () => {
    const seconds = String(Math.floor(Date.now() / 1000))
    const input = TIMESTAMP_START + seconds
    const output = timestamp(input)
    const ts = Number(seconds) * 1000
    const date = (new Date(ts)).toISOString()
    const expected = {
      remainder: '',
      frame: {
        frame,
        raw: input,
        data: [seconds],
        fields: [{ name: 'timestamp', type: 'uint16', units: 'seconds', data: seconds, metadata: date }],
        object: {
          timestamp: ts,
          date
        }
      }
    }
    expect(output).toEqual(expected)
  })

  test('incomplete timestamp', () => {
    const seconds = String(Math.floor(Date.now() / 100000))
    const input = TIMESTAMP_START + seconds
    const output = timestamp(input)
    const expected = {
      remainder: seconds,
      frame: {
        frame,
        raw: input,
        error: 'frame incomplete'
      }
    }
    expect(output).toEqual(expected)
  })

  test('wrong timestamp', () => {
    const seconds = '123456789a'
    const input = TIMESTAMP_START + seconds
    const output = timestamp(input)
    const expected = {
      remainder: seconds,
      frame: {
        frame,
        raw: input,
        error: `${seconds} is not a string-number`
      }
    }
    expect(output).toEqual(expected)
  })
})

describe('api', () => {
  const frame = 'api'
  const apiWithGarbage = `In Command Mode
  Read values
    SN?	-	-	->	TBR serial number
    FV?	-	-	->	Firmware version
    FC?	-	-	->	Listening freq. in kHz
    LM?	-	-	->	Listening Mode. Determines active protocols
    LI?	-	-	->	TBR sensor log interval (00=never,01=once every 5 min,02=10 min,03=30 min, 04=1 hour, 05=2 hours, 06=12 hours, 07=24 hours)
    UT?	-	-	->	Current UNIX timestamp (UTC)
  Set values
    FC=69	-	->	Set freq. channel (base frequency)
    LM=01	-	-	->	Listening Mode. Sets active protocols.
    LI=00	-	->	Set TBR sensor log interval (00=never,01=once every 5 min,02=10 min,03=30 min, 04=1 hour, 05=2 hours, 06=12 hours, 07=24 hours)
    UT=1234567890	->	Set UNIX timestamp (UTC)
  Actions
    EX!	-	-	->	Exit command mode and resume listening for signals
    RR!	-	-	->	Restart TBR
    FS!	-	-	->	Warning: Restores factory settings and deletes all tag detections and TBR sensor logs from flash memory
    UF!	-	-	->	Warning: Puts TBR in bootloader mode. Firmware must be written after activating this action
  
  In Listening mode
  Note: Minimum 1 ms betwee
  n input characters
    TBRC		->	 Enter Command Mode
    (+)			->	 Sync Time
    (+)XXXXXXXXXL	->	 Sync and set new time (UTC) with the least significant digit being 10 seconds. L is Luhn's verification number.
  `

  test('happy path', () => {
    const input = apiWithGarbage
    const output = api(input)
    const endIndex = input.indexOf(API_END) + API_END.length
    const fullAPI = input.slice(0, endIndex)
    const remainder = input.slice(endIndex)
    const expected = {
      remainder,
      frame: {
        frame,
        raw: fullAPI,
        data: [fullAPI],
        fields: [{ name: 'api', type: 'string', data: fullAPI }],
        object: {
          api: fullAPI,
        }
      }
    }
    expect(output).toEqual(expected)
  })

  test('incomplete api', () => {
    const input = apiWithGarbage.slice(0, apiWithGarbage.length - 10)
    const output = api(input)
    const expected = {
      remainder: input.slice(API_START.length),
      frame: {
        frame,
        raw: input,
        error: 'frame incomplete'
      }
    }
    expect(output).toEqual(expected)
  })
})

test('restart', () => {
  const input = RESTART_DEVICE
  const output = restart(input)
  const expected = {
    remainder: '',
    frame: {
      frame: 'restart device',
      raw: input,
    }
  }
  expect(output).toEqual(expected)
})

test('factory reset', () => {
  const input = FACTORY_RESET
  const output = factoryReset(input)
  const expected = {
    remainder: '',
    frame: {
      frame: 'factory reset',
      raw: input,
    }
  }
  expect(output).toEqual(expected)
})

test('upgrade firmware', () => {
  const input = UPGRADE_FIRMWARE
  const output = upgradeFirmware(input)
  const expected = {
    remainder: '',
    frame: {
      frame: 'upgrade firmware',
      raw: input,
    }
  }
  expect(output).toEqual(expected)
})
