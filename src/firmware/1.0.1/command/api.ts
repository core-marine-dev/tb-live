import { API_END } from "../../../constants"

export const parseAPI = (text: string) => {
  const frame = 'api'
  // Incomplete Frame
  const endIndex = text.indexOf(API_END)
  if (endIndex === -1) { return { frame, raw: text, error: 'frame incomplete' } }
  // Get API
  const raw = text.slice(0, endIndex + API_END.length)
  return {
    frame,
    raw,
    data: [raw],
    fields: [{ name: 'api', type: 'string', data: raw }],
    object: {
      api: raw,
    }
  }
}