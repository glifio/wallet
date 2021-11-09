import { Network as CoinType } from '@glif/filecoin-address'
import { SINGLE_KEY } from '../../constants'

const createSingleKeyProvider = (rustModule) => {
  return (privateKey) => {
    // here we close over the private variables, so they aren't accessible to the outside world
    const PRIVATE_KEY = privateKey
    return {
      getAccounts: async (coinType = CoinType.MAIN) => {
        return [
          rustModule.keyRecover(PRIVATE_KEY, coinType === CoinType.TEST).address
        ]
      },

      sign: async (filecoinMessage) => {
        const { private_hexstring } = rustModule.keyRecover(PRIVATE_KEY)
        const { signature } = rustModule.transactionSign(
          filecoinMessage,
          Buffer.from(private_hexstring, 'hex').toString('base64')
        )
        return signature.data
      },

      type: SINGLE_KEY
    }
  }
}

export default createSingleKeyProvider
