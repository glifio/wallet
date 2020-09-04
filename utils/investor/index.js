import crypto from 'crypto'
import axios from 'axios'

import investorIdHashes from './investorHashes'

export const createHash = val =>
  crypto
    .createHash('sha256')
    .update(val)
    .digest('hex')

export const isValidInvestorId = investorId => {
  const investorIdHash = createHash(investorId.trim())
  return investorIdHashes.has(investorIdHash)
}

const VAL_DELINEATOR = ','
const HASH_DELINEATOR = ':'

/*
 * This function is used to create the string for investors to paste into their CoinList account
 */
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

const sendVaultErrorToSlack = async (...errors) => {
  const errorText = [...errors].reduce(
    (err, ele) => {
      return `${err}\n${ele}`
    },
    [`VAULT ERROR:\n`]
  )
  if (process.env.IS_PROD) {
    await axios.post(
      'https://errors.glif.io/saft',
      JSON.stringify({ text: errorText })
    )
  }
}

export const sendMagicStringToPL = async (
  address,
  hashedInvestorId,
  magicString
) => {
  try {
    const res = await axios.post(process.env.MAGIC_STRING_ENDPOINT, {
      address,
      hash: hashedInvestorId,
      magicString
    })
    if (res.status === 429) {
      setTimeout(() => {
        return sendMagicStringToPL(address, hashedInvestorId, magicString)
      }, 10000)
      await sendVaultErrorToSlack(
        'Received 429 from the API, retrying in 10 seconds...',
        address,
        hashedInvestorId,
        magicString
      )
    } else if (res.status !== 200) throw new Error(res.statusText)
  } catch (error) {
    await sendVaultErrorToSlack(
      address,
      hashedInvestorId,
      magicString,
      error.message
    )
  }
}
