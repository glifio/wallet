import base32Decode from 'base32-decode'

export function decodeActorCID(cid: string): string {
  try {
    const decoded = base32Decode(cid.slice(1).toUpperCase(), 'RFC4648')
    const actorCode = new TextDecoder('utf-8').decode(decoded.slice(4))
    if (!actorCode.includes('fil/')) {
      throw new Error('unknown actor code')
    }
    return actorCode
  } catch {
    throw new Error('unknown actor code')
  }
}
