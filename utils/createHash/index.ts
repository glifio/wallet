import crypto from 'crypto'

export const createHash = (val) =>
  crypto.createHash('sha256').update(val).digest('hex')

export default createHash
