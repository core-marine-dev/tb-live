import { FLAG, FLAGS, Mode, TODO } from "../../types"
// import { MapModeParser } from "../../types"
import { parse as listeningFrame } from './listening'
import { parse as commandFrame } from './command'
import { FLAGS_COMMAND, FLAGS_LISTENING, PING_END, PING_LENGTH_MAX } from "../../constants";
// import { number } from "valibot"

export const getFramesIndex = (text: string, flags: FLAGS ): { index: number, flag: FLAG, last: boolean } | null => {
  const frames = [...flags]
    .map(flag => ({ index: text.indexOf(flag), flag}))
    .filter(elem => elem.index > -1)
    .sort((a, b) => {
      if (a.index < b.index) return -1
      if (a.index > b.index) return 1
      return 0
    });
  if (frames.length > 1) return { ...frames[0], last: false }
  if (frames.length === 1) return { ...frames[0], last: true }
  return null
}

export const getFrameToParse = (text: string): { index: number, flag: FLAG, last: boolean, mode: Mode } | null => {
  const listening = getFramesIndex(text, FLAGS_LISTENING)
  const command = getFramesIndex(text, FLAGS_COMMAND)
  // Just command
  if (listening === null) {
    if (command === null) return null
    return {...command, mode: 'command' }
  }
  // Just listening
  if (command === null) return {...listening, mode: 'listening' }
  // Listening
  if (listening.index < command.index) return {...listening, last: false, mode: 'listening'}
  // Command
  if (listening.index > command.index) return {...command, last: false, mode: 'command' }
  // Listening + Command
  const possiblePingFrame = text.slice(listening.index, listening.index + PING_LENGTH_MAX + 1)
  return (possiblePingFrame.includes(PING_END)) ? {...listening, last: false, mode: 'listening'} : {...command, last: false, mode: 'command' }
}

export const parse = (input: string): { frames: TODO[], nonparsed: string, firmwareChange: boolean } => {
  let text = input
  let frames: TODO[] = []
  let firmwareChange = false
  while (text.length > 0) {
    const frameToParse = getFrameToParse(text)
    if (frameToParse === null) {
      text = ''
      break
    }
    const { index, flag, last, mode } = frameToParse
    text = text.slice(index)
    const { frame, remainder } = (mode === 'listening')
      ? listeningFrame(text, flag as typeof FLAGS_LISTENING[number])
      : commandFrame(text, flag as typeof FLAGS_COMMAND[number]);
    text = remainder
      if (frame !== null) {
      frames.push(frame)
    }
    if (mode === 'command' && frame.frame === 'firmware') {
      firmwareChange = true
      break
    }
    if (last) {
      break
    }
  }
  return { frames, nonparsed: text, firmwareChange }
}

