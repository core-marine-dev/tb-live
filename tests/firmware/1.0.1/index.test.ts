import { describe, expect, test } from 'vitest'
import { CLOCK_ROUND, CLOCK_SET, FLAGS_LISTENING, PING_END, PING_START } from '../../../src/firmware/1.0.1/flags'
import { getFramesIndex, parse } from '../../../src/firmware/1.0.1'

describe('getFramesIndex', () => {
  test('listening', () => {
    const emitter = '$1000042,0000002202,615,S64K,1285,52428,24,69,11\r'
    const receiver = '$1000042,0000000600,TBR Sensor,297,15,29,69,6\r'
    const sn = '1000042'
    const ping = PING_START + sn + PING_END
    const round = CLOCK_ROUND
    const set = CLOCK_SET
    const garbage = 'lkashf';
    [
      ['roundClock', garbage + round + emitter + ping + garbage + receiver + set],
      ['setClock', garbage + set + emitter + ping + garbage + receiver + round],
      ['ping', garbage + ping + emitter + round + garbage + receiver + set],
      ['sample', garbage + emitter + round + ping + garbage + receiver + set],
      ['sample', garbage + receiver + round + ping + garbage + emitter + set],
    ].forEach(([name, fr]) => {
      const output = getFramesIndex(fr, FLAGS_LISTENING)
      expect(output).not.toBeNull()
      if (output !== null) {
        const { index, flag, last } = output
        expect(index).toBe(garbage.length)
        expect(FLAGS_LISTENING.includes(flag as typeof FLAGS_LISTENING[number])).toBeTruthy()
        expect(last).toBeFalsy()
      }
    })
  })
})

describe('parse', () => {

  test('happy path', () => {
    const emitter = '$1000042,0000002202,615,S64K,1285,52428,24,69,11\r'
    const receiver = '$1000042,0000000600,TBR Sensor,297,15,29,69,6\r'
    const sn = '1000042'
    const ping = `${PING_START}${sn} ${PING_END}`
    const round = CLOCK_ROUND
    const set = CLOCK_SET
    const garbage = 'lkashf';
    [
      `${garbage}${round}${emitter}${ping}${garbage}${receiver}${set}`,
      `${garbage}${set}${emitter}${ping}${garbage}${receiver}${round}`,
      `${garbage}${ping}${emitter}${round}${garbage}${receiver}${set}`,
      `${garbage}${emitter}${round}${ping}${garbage}${receiver}${set}`,
      `${garbage}${receiver}${round}${ping}${garbage}${emitter}${set}`,
    ].forEach((fr) => {
      const { frames, nonparsed, firmwareChange } = parse(fr)
      expect(frames).toHaveLength(5)
      expect(nonparsed).toHaveLength(0)
      expect(firmwareChange).toBeFalsy()
    })
  })

  test('happy path with ping in the middle', () => {
    const round = CLOCK_ROUND
    const set = CLOCK_SET
    const sn = '1000042'
    const ping = `${PING_START}${sn} ${PING_END}`
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
      const { frames, nonparsed, firmwareChange } = parse(fr)
      expect(frames).toHaveLength(7)
      expect(nonparsed).toHaveLength(0)
      expect(firmwareChange).toBeFalsy()
    })
  })
})
