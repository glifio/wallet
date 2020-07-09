import crypto from 'crypto'

import investorIdHashes from './investorHashes'

export const createHash = val =>
  crypto
    .createHash('sha256')
    .update(val)
    .digest('hex')

export const isValidInvestorId = investorId => {
  const investorIdHash = createHash(investorId)
  return investorIdHashes.has(investorIdHash)
}

const VAL_DELINEATOR = ','
const HASH_DELINEATOR = ':'

export const encodeInvestorValsForCoinList = (...vals) => {
  const stringifiedValues = vals.join(VAL_DELINEATOR)
  const hash = crypto.createHash('sha256')
  vals.forEach(val => hash.update(val, 'utf8'))
  const completeString = `${stringifiedValues}${HASH_DELINEATOR}${hash.digest(
    'hex'
  )}`
  return Buffer.from(completeString).toString('hex')
}

export const decodeInvestorValsForCoinList = hexString => {
  const [vals, hash] = Buffer.from(hexString, 'hex')
    .toString('utf8')
    .split(HASH_DELINEATOR)

  const recomputedHash = crypto.createHash('sha256')
  vals.split(VAL_DELINEATOR).forEach(val => recomputedHash.update(val, 'utf8'))

  if (recomputedHash.digest('hex') !== hash) {
    throw new Error('Could not verify hash against encoded values.')
  }

  return vals.split(VAL_DELINEATOR)
}
