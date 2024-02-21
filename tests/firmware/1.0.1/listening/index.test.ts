import { describe, test, expect } from 'vitest'
import { clock, getFramesIndex, parse, ping, sample } from '../../../../src/firmware/1.0.1/listening/index'
import { CLOCK_FLAG_ROUND, CLOCK_FLAG_SET, PING_FLAG_END, PING_FLAG_START } from '../../../../src/constants'

describe('clock', () => {
  test('round', () => {
    const name = 'round clock'
    const flag = CLOCK_FLAG_ROUND
    const garbage = 'lsdkjhaklsd'
    const input = flag + garbage
    const [response, text] = clock(input, 'round')
    expect(text).toBe(garbage)
    expect(response.frame).toBe(name)
    expect(response.raw).toBe(flag)
  })

  test('set', () => {
    const name = 'set clock'
    const flag = CLOCK_FLAG_SET
    const garbage = 'lsdkjhaklsd'
    const input = flag + garbage
    const [response, text] = clock(input, 'set')
    expect(text).toBe(garbage)
    expect(response.frame).toBe(name)
    expect(response.raw).toBe(flag)
  })
})

describe('ping', () => {
  test('happy path', () => {
    const name = 'ping'
    const sn = '1234567'
    const pg = PING_FLAG_START + sn + PING_FLAG_END
    const garbage = 'slkjhfalfsj'
    const input = pg + garbage
    const [response, text] = ping(input)
    expect(text).toBe(garbage)
    expect(response.frame).toBe(name)
    expect(response.raw).toBe(pg)
    expect(response.object.receiver).toBe(sn)
  })

  test('invalid serial numbers', () => {
    ['12345', '12345678', '12345ab'].forEach(sn => {
      const pg = PING_FLAG_START + sn + PING_FLAG_END
      const garbage = 'slkjhfalfsj'
      const input = pg + garbage
      const [response, text] = ping(input)
      expect(text).toBe(garbage)
      expect(response.error).not.toBeUndefined()
    })
  })
})

describe('sample', () => {
  test('happy path - emitter', () => {
    const name = 'emitter'
    const input = '$1000042,0000002202,615,S64K,1285,52428,24,69,11\r'
    const [response, text] = sample(input)
    expect(text).toHaveLength(0)
    expect(response.frame).toBe(name)
    expect(response.fields).toHaveLength(9)
    expect(response.data).toHaveLength(9)
  })

  test('happy path - receiver', () => {
    const name = 'receiver'
    const input = '$1000042,0000000600,TBR Sensor,297,15,29,69,6\r'
    const [response, text] = sample(input)
    expect(text).toHaveLength(0)
    expect(response.frame).toBe(name)
    expect(response.fields).toHaveLength(8)
    expect(response.data).toHaveLength(8)
  })

  test('emitter with ping', () => {
    const name = 'ping'
    const inputEmitter = '$1000042,0000002202,615,S64K,1285,52428,24,69,11\r'
    const sn = '1234567'
    const inputPing = PING_FLAG_START + sn + PING_FLAG_END
    const minIndex = 2
    const maxIndex = inputEmitter.length - minIndex
    const index = Math.floor(Math.random() * (maxIndex - minIndex) + minIndex)
    const input = inputEmitter.slice(0, index) + inputPing + inputEmitter.slice(index)
    const [response, text] = sample(input)
    expect(text).toBe(inputEmitter)
    expect(response.frame).toBe(name)
    expect(response.raw).toBe(inputPing)
    expect(response.object.receiver).toBe(sn)
  })

  test('receiver with ping', () => {
    const name = 'ping'
    const inputReceiver = '$1000042,0000000600,TBR Sensor,297,15,29,69,6\r'
    const sn = '1234567'
    const inputPing = PING_FLAG_START + sn + PING_FLAG_END
    const minIndex = 2
    const maxIndex = inputReceiver.length - minIndex
    const index = Math.floor(Math.random() * (maxIndex - minIndex) + minIndex)
    const input = inputReceiver.slice(0, index) + inputPing + inputReceiver.slice(index)
    const [response, text] = sample(input)
    expect(text).toBe(inputReceiver)
    expect(response.frame).toBe(name)
    expect(response.raw).toBe(inputPing)
    expect(response.object.receiver).toBe(sn)
  })
})

test('getFramesIndex', () => {
  const emitter = '$1000042,0000002202,615,S64K,1285,52428,24,69,11\r'
  const receiver = '$1000042,0000000600,TBR Sensor,297,15,29,69,6\r'
  const sn = '1000042'
  const ping = PING_FLAG_START + sn + PING_FLAG_END
  const round = CLOCK_FLAG_ROUND
  const set = CLOCK_FLAG_SET
  const garbage = 'lkashf';
  [
    ['roundClock', garbage + round + emitter + ping + garbage + receiver + set],
    ['setClock', garbage + set + emitter + ping + garbage + receiver + round],
    ['ping', garbage + ping + emitter + round + garbage + receiver + set],
    ['sample', garbage + emitter + round + ping + garbage + receiver + set],
    ['sample', garbage + receiver + round + ping + garbage + emitter + set],
  ].forEach(([name, fr]) => {
    const [index, frame] = getFramesIndex(fr)
    expect(index).toBe(garbage.length)
    expect(frame).toBe(name)
  })
})

describe('parse', () => {

  test('happy path', () => {
    const emitter = '$1000042,0000002202,615,S64K,1285,52428,24,69,11\r'
    const receiver = '$1000042,0000000600,TBR Sensor,297,15,29,69,6\r'
    const sn = '1000042'
    const ping = `${PING_FLAG_START}${sn} ${PING_FLAG_END}`
    const round = CLOCK_FLAG_ROUND
    const set = CLOCK_FLAG_SET
    const garbage = 'lkashf';
    [
      `${garbage}${round}${emitter}${ping}${garbage}${receiver}${set}`,
      `${garbage}${set}${emitter}${ping}${garbage}${receiver}${round}`,
      `${garbage}${ping}${emitter}${round}${garbage}${receiver}${set}`,
      `${garbage}${emitter}${round}${ping}${garbage}${receiver}${set}`,
      `${garbage}${receiver}${round}${ping}${garbage}${emitter}${set}`,
    ].forEach((fr) => {
      const [frames, txt] = parse(fr)
      expect(txt).toHaveLength(0)
      expect(frames).toHaveLength(5)
    })
  })

  test('happy path with ping in the middle', () => {
    const round = CLOCK_FLAG_ROUND
    const set = CLOCK_FLAG_SET
    const sn = '1000042'
    const ping = `${PING_FLAG_START}${sn} ${PING_FLAG_END}`
    const emitter = `$1000042,0000002${ping}}202,615,S64K,1285,52428,24,69,11\r`
    const receiver = `$1000042,0000000600,TBR Se${ping}nsor,297,15,29,69,6\r`
    const garbage = 'lkashf';
    [
      `${garbage}${round}${emitter}${ping}${garbage}${receiver}${set}`,
      `${garbage}${set}${emitter}${ping}${garbage}${receiver}${round}`,
      `${garbage}${ping}${emitter}${round}${garbage}${receiver}${set}`,
      `${garbage}${emitter}${round}${ping}${garbage}${receiver}${set}`,
      `${garbage}${receiver}${round}${ping}${garbage}${emitter}${set}`,
    ].forEach((fr) => {
      const [frames, txt] = parse(fr)
      expect(txt).toHaveLength(0)
      expect(frames).toHaveLength(7)
    })
  })
})
