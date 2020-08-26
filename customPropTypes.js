import { shape, string, oneOfType, number, oneOf } from 'prop-types'
import { validateAddressString } from '@openworklabs/filecoin-address'
import { validatePath } from '@openworklabs/filecoin-wallet-provider'
import { validateMnemonic } from 'bip39'
import {
  SINGLE_KEY,
  IMPORT_MNEMONIC,
  IMPORT_SINGLE_KEY,
  LEDGER
} from './constants'

export const ADDRESS_PROPTYPE = (props, propName, componentName) => {
  if (!validateAddressString(props[propName]))
    return new Error(
      `Invalid prop: ${propName} supplied to ${componentName}. Validation failed.`
    )

  return null
}

export const MNEMONIC_PROPTYPE = (props, propName, componentName) => {
  if (!validateMnemonic(props[propName]))
    return new Error(
      `Invalid prop: ${propName} supplied to ${componentName}. Validation failed.`
    )

  return null
}

export const FILECOIN_NUMBER_PROP = (props, propName, componentName) => {
  // instanceof prop checking is broken in nextjs on server side render cycles
  const representsANum = Number.isNaN(Number(props[propName].toString()))
  const hasFilecoinNumMethods = !!(
    props[propName].toFil && props[propName].toAttoFil
  )
  if (!(representsANum || hasFilecoinNumMethods))
    return new Error(
      `Invalid prop: ${propName} supplied to ${componentName}. Validation failed.`
    )

  return null
}

export const HD_PATH_PROP = (props, propName, componentName) => {
  if (!validatePath(props[propName]) && props[propName] !== SINGLE_KEY)
    return new Error(
      `Invalid prop: ${propName} supplied to ${componentName}. Validation failed.`
    )

  return null
}

export const WALLET_PROP_TYPE = shape({
  balance: FILECOIN_NUMBER_PROP,
  address: ADDRESS_PROPTYPE,
  path: HD_PATH_PROP,
  type: oneOf([IMPORT_MNEMONIC, IMPORT_SINGLE_KEY, LEDGER]),
  index: number
})

export const NO_WALLET_PROP_TYPE = shape({
  balance: FILECOIN_NUMBER_PROP,
  address: string,
  path: string,
  index: number
})

export const MESSAGE_PROPS = shape({
  /**
   * Message sent to this address
   */
  to: ADDRESS_PROPTYPE,
  /**
   * Message sent from this address
   */
  from: ADDRESS_PROPTYPE,
  /**
   * The amount of FIL sent in the message
   */
  value: string.isRequired,
  /**
   * Amount of gas used in the message
   */
  gas_used: string,
  /**
   * The message's cid
   */
  cid: string.isRequired,
  /**
   * Either pending or confirmed
   */
  status: string.isRequired,
  timestamp: oneOfType([string, number]).isRequired
})
