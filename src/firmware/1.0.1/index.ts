import { MapModeParser } from "../../types"
import { parse as listening } from './listening'
import { parse as command } from './command'


export const parser: MapModeParser = new Map()

parser.set('listening', listening)
parser.set('command', command)