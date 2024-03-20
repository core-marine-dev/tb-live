import * as v from 'valibot'
import { FirmwareSchema } from "../../../schemas"
import { FIRMWARE_START } from "../../../constants"

const getMajor = (text: string) => {
  const major = parseInt(text)
  if (isNaN(major)) { return { error: `Invalid major ${text}` } }
  return { major: text }
}

const getMinor = (text: string) => {
  const minor = parseInt(text)
  if (isNaN(minor)) { return { error: `Invalid minor ${text}` } }
  return { minor: text }
}

const getPatch = (text: string) => {
  let data = ''
  for (const char of text) {
    if (isNaN(parseInt(char))) { break }
    data += char
  }
  if (data.length === 0) { return { error: 'frame incomplete - no patch version' } }
  const patch = parseInt(data)
  if (isNaN(patch)) { return { error: `Invalid patch ${data}` } }
  return { patch: data }
}

export const parseFirmware = (text: string) => {
  const frame = 'firmware'
  let data = text.replace(FIRMWARE_START, '')
  ;['v', 'V'].forEach(char => {
    if (data.startsWith(char)) {
      data = data.replace(char, '')
    }
  })
  // Incomplete Frame
  const majorLimit = data.indexOf('.')
  if (majorLimit === -1) { return { frame, raw: text, error: 'frame incomplete - no major version' } }
  // Major
  const majorText = data.slice(0, majorLimit)
  const { major, error: errorMajor } = getMajor(majorText)
  if (errorMajor) { return { frame, raw: text, error: errorMajor } }
  // Minor
  const minorLimit = data.indexOf('.', majorLimit + 1)
  if (minorLimit === -1) { return { frame, raw: text, error: 'frame incomplete - no minor version' } }
  const minorText = data.slice(majorLimit + 1, minorLimit)
  const { minor, error: errorMinor } = getMinor(minorText)
  if (errorMinor) { return { frame, raw: text, error: errorMinor } }
  // Patch
  const patchText = data.slice(minorLimit + 1)
  const { patch, error: errorPatch } = getPatch(patchText)
  if (errorPatch) { return { frame, raw: text, error: errorPatch } }
  // Get Firmware
  const fw = `${major}.${minor}.${patch}`
  const endIndex = text.indexOf(fw) + fw.length
  const raw = text.slice(FIRMWARE_START.length, endIndex)
  const parsed = v.safeParse(FirmwareSchema, fw)
  if (!parsed.success) { return { frame, raw, error: parsed.issues[0].message } }
  return {
    frame,
    raw,
    data: [fw],
    fields: [{ name: 'firmware', type: 'string', data: fw }],
    object: {
      firmware: fw,
    }
  }
}