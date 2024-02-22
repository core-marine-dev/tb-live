import { Mode, TODO } from "../../types"
// import { MapModeParser } from "../../types"
import { parse as listeningFrame } from './listening'
import { parse as commandFrame } from './command'
import { FLAG, FLAGS, FLAGS_COMMAND, FLAGS_LISTENING } from "./flags";
// import { number } from "valibot"

export const getFramesIndex = (text: string, flags: FLAGS ): { index: number, flag: FLAG, last: boolean } | null => {
  const frames = flags
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
  if (listening === null) {
    if (command === null) return null
    return {...command, mode: 'command' }
  }
  if (command === null) return {...listening, mode: 'listening' }
  return (listening.index < command.index) ? {...listening, last: false, mode: 'listening'} : {...command, last: false, mode: 'command' }
}

export const parser = (input: string): { frames: TODO[], nonparsed: string, firmwareChange: boolean } => {
  let text = input
  let frames: TODO[] = []
  let firmwareChange = false
  while (text.length > 0) {
    const frameToParse = getFrameToParse(text)
    if (frameToParse === null) {
      text = ''
      break
    }
    text = text.slice(frameToParse.index)
    const [frame, txt]
  }
  return { frames, nonparsed: text, firmwareChange }
}

