import { Network } from '@glif/filecoin-address'
import { MAINNET_PATH_CODE, TESTNET_PATH_CODE } from '../../constants'

type NetworkCode = 461 | 1

const createPath = (networkCode: NetworkCode, i: number) => {
  if (networkCode !== MAINNET_PATH_CODE && networkCode !== TESTNET_PATH_CODE)
    throw new Error('Invalid network code passed')
  return `m/44'/${networkCode}'/0'/0/${i}`
}

export const networkToCoinType = (network: Network): NetworkCode => {
  console.log(network)
  if (network === 't') return 1
  if (network === 'f') return 461
  throw new Error('Unrecognized Network')
}

export default createPath
