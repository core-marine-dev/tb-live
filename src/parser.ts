import * as v from 'valibot'
import { FirmwareSchema, ModeSchema, StringSchema } from "./schemas"
import { Firmware, ListeningFrame, MapFirmwareParser, Mode, Receiver, TODO } from "./types"
import { COMMAND_MODE, LISTENING_MODE, PING_FLAG_START, ROUND_CLOCK_FLAG, SAMPLE_FLAG_START, SET_CLOCK_FLAG, UPDATE_MODE } from './constants'
import { firmwareParser } from './firmware'

export class TBLive {
  protected receiver: Receiver
  protected parser: MapFirmwareParser = firmwareParser
  protected buffer: string = ''

  get firmware() { return this.receiver.firmware }
  set firmware(fw: Firmware) { this.receiver.firmware = v.parse(FirmwareSchema, fw) }

  get firmwares() { return FirmwareSchema.options }

  get mode() { return this.receiver.mode }
  set mode(m: Mode) { this.receiver.mode = v.parse(ModeSchema, m) }

  constructor(receiver: Receiver) { this.receiver = { ...receiver } }

  addData(data: string) { this.buffer += v.parse(StringSchema, data) }

  parseData(data: string = '') {
    if (data) {
      this.addData(data)
    }
    const timestamp = Date.now()
    let response: TODO[] = []
    while (this.buffer.length > 0) {
      // Know if there is a change of mode
      const [index, newMode] = this.getIndexChangeOfMode(this.buffer)
      // If there is change mode
      if (index > 0) {

        const preModechange = this.buffer.slice(0, index)
        response = [...response, ...this.parse(preModechange)]
        response.push()

      }
      // Parse without mode change

    }
  }

  protected parse(input: string): TODO[] {
    if (this.receiver.mode === 'listening') { return this.parseListening(input) }
    if (this.receiver.mode === 'command') { return this.parseCommand(input) }
    return this.parseUpdate(input)
  }
  // CHANGE MODE
  // 04 - Command MODE ON  -> LIVECM
  // 05 - Command MODE OFF -> EX!

  protected getIndexChangeOfMode(input: string): [number, Mode | null] {
    const indexListening = input.indexOf(LISTENING_MODE)
    const indexCommand = input.indexOf(COMMAND_MODE)
    const indexUpdate = input.indexOf(UPDATE_MODE)
    const index = Math.max(indexListening, indexCommand, indexUpdate)
    // No change mode
    if (index === -1) return [-1, null]
    // Listening mode
    if (index === indexListening) return [indexListening, 'listening']
    // Command mode
    if (index === indexCommand) return [indexCommand, 'command']
    // Update mode
    return [indexUpdate, 'update']
  }


  // LISTENING MODE
  // 00 - Emitter  sample === Acoustic detection -> $...\r
  // 00 - Receiver sample === Log -> $...\r
  // 01 - Ping -> SN=1234567 ><>\r
  // 02 - Round clock -> ack01\r
  // 03 - Set clock -> ack02\r

  protected getIndexListenning(input: string): [number, ListeningFrame | null] {
    const indexSample = input.indexOf(SAMPLE_FLAG_START)
    const indexPing = input.indexOf(PING_FLAG_START)
    const indexRoundClock = input.indexOf(ROUND_CLOCK_FLAG)
    const indexSetClock = input.indexOf(SET_CLOCK_FLAG)
    const index = Math.max(indexSample, indexPing, indexRoundClock, indexSetClock)
    // No data
    if (index === -1) return [-1, null]
    // Sample
    if (index === indexSample) return [index, 'sample']
    // Ping
    if (index === indexPing) return [index, 'ping']
    // Round Clock
    if (index === indexSample) return [index, 'roundClock']
    // Set Clock
    return [index, 'setClock']
  }

  protected parseListening(input: string): TODO[] {
    let text = input
    let response: TODO[] = []
    while (text.length) {
      const [index, type] = this.getIndexListenning(text)
      
    }
    return []
  }

  // COMMAND MODE
  // 06 - Commands -> text
  // 07 - Serial Number -> SN=1234567
  // 08 - Firmware -> FV=[v]X.Y.Z
  // 09 - Time -> UT=<timestamp seconds>
  // 10 - Frequency -> FC=XY (63 - 77)
  // 11 - Protocol -> LM=XY
  // 12 - Log Interval -> LI=XY
  // 13 - Restart -> RR!
  // 14 - Factory reset -> FS!
  // 15 - Upgrade FW -> UF!

  protected parseCommand(input: string): TODO[] { return [] }

  protected parseUpdate(input: string): TODO[] { return [] }

}