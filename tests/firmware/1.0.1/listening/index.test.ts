import { describe, test, expect } from 'vitest'
import { clock, ping, sample } from '../../../../src/firmware/1.0.1/listening/index'
import { CLOCK_ROUND, CLOCK_SET, PING_END, PING_START } from '../../../../src/firmware/1.0.1/flags'

describe('clock', () => {
  test('round', () => {
    const name = 'round clock'
    const flag = CLOCK_ROUND
    const garbage = 'lsdkjhaklsd'
    const input = flag + garbage
    const { frame, remainder} = clock(input, 'round')
    expect(remainder).toBe(garbage)
    expect(frame).not.toBeNull()
    if (frame !== null) {
      expect(frame.frame).toBe(name)
      expect(frame.raw).toBe(flag)
    }
  })

  test('set', () => {
    const name = 'set clock'
    const flag = CLOCK_SET
    const garbage = 'lsdkjhaklsd'
    const input = flag + garbage
    const { frame, remainder} = clock(input, 'set')
    expect(remainder).toBe(garbage)
    expect(frame).not.toBeNull()
    if (frame !== null) {
      expect(frame.frame).toBe(name)
      expect(frame.raw).toBe(flag)
    }
  })
})

describe('ping', () => {
  test('happy path', () => {
    const name = 'ping'
    const sn = '1234567'
    const pg = PING_START + sn + PING_END
    const garbage = 'slkjhfalfsj'
    const input = pg + garbage
    const { frame, remainder } = ping(input)
    expect(remainder).toBe(garbage)
    expect(frame).not.toBeNull()
    if (frame !== null) {
      expect(frame.frame).toBe(name)
      expect(frame.raw).toBe(pg)
      expect(frame.object.receiver).toBe(sn)
    }
  })

  test('invalid serial numbers', () => {
    ['12345', '12345678', '12345ab'].forEach(sn => {
      const pg = PING_START + sn + PING_END
      const garbage = 'slkjhfalfsj'
      const input = pg + garbage
      const { frame, remainder} = ping(input)
      expect(remainder).toBe(garbage)
      expect(frame).not.toBeNull()
      if (frame !== null) {
        expect(frame.error).not.toBeUndefined()
      }
    })
  })
})

describe('sample', () => {
  test('happy path - emitter', () => {
    const name = 'emitter'
    const input = '$1000042,0000002202,615,S64K,1285,52428,24,69,11\r'
    const { frame, remainder} = sample(input)
    expect(remainder).toHaveLength(0)
    expect(frame).not.toBeNull()
    if (frame !== null) {
      expect(frame.frame).toBe(name)
      expect(frame.fields).toHaveLength(9)
      expect(frame.data).toHaveLength(9)
    }
  })

  test('happy path - receiver', () => {
    const name = 'receiver'
    const input = '$1000042,0000000600,TBR Sensor,297,15,29,69,6\r'
    const { frame, remainder} = sample(input)
    expect(remainder).toHaveLength(0)
    expect(frame).not.toBeNull()
    if (frame !== null) {
      expect(frame.frame).toBe(name)
      expect(frame.fields).toHaveLength(8)
      expect(frame.data).toHaveLength(8)
    }
  })

  test('emitter with ping', () => {
    const name = 'ping'
    const inputEmitter = '$1000042,0000002202,615,S64K,1285,52428,24,69,11\r'
    const sn = '1234567'
    const inputPing = PING_START + sn + PING_END
    const minIndex = 2
    const maxIndex = inputEmitter.length - minIndex
    const index = Math.floor(Math.random() * (maxIndex - minIndex) + minIndex)
    const input = inputEmitter.slice(0, index) + inputPing + inputEmitter.slice(index)
    const { frame, remainder }= sample(input)
    expect(remainder).toBe(inputEmitter)
    expect(frame).not.toBeNull()
    if (frame !== null) {
      expect(frame.frame).toBe(name)
      expect(frame.raw).toBe(inputPing)
      expect(frame.object.receiver).toBe(sn)
    }
  })

  test('receiver with ping', () => {
    const name = 'ping'
    const inputReceiver = '$1000042,0000000600,TBR Sensor,297,15,29,69,6\r'
    const sn = '1234567'
    const inputPing = PING_START + sn + PING_END
    const minIndex = 2
    const maxIndex = inputReceiver.length - minIndex
    const index = Math.floor(Math.random() * (maxIndex - minIndex) + minIndex)
    const input = inputReceiver.slice(0, index) + inputPing + inputReceiver.slice(index)
    const { frame, remainder } = sample(input)
    expect(remainder).toBe(inputReceiver)
    expect(frame).not.toBeNull()
    if (frame !== null) {
      expect(frame.frame).toBe(name)
      expect(frame.raw).toBe(inputPing)
      expect(frame.object.receiver).toBe(sn)
    }
  })
})
