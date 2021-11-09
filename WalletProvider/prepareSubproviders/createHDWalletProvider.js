import { Network as CoinType } from '@glif/filecoin-address'
import createPath, { coinTypeCode } from '../../utils/createPath'
import { HD_WALLET } from '../../constants'

const createHDWalletProvider = (rustModule) => {
  return (mnemonic) => {
    // here we close over the private variables, so they aren't accessible to the outside world
    const MNEMONIC = mnemonic
    return {
      getAccounts: async (coinType = CoinType.MAIN, nStart = 0, nEnd = 5) => {
        const accounts = []
        for (let i = nStart; i < nEnd; i += 1) {
          accounts.push(
            rustModule.keyDerive(
              MNEMONIC,
              createPath(coinTypeCode(coinType), i),
              ''
            ).address
          )
        }
        return accounts
      },

      sign: async (filecoinMessage, path) => {
        const { private_hexstring } = rustModule.keyDerive(MNEMONIC, path, '')
        const { signature } = rustModule.transactionSign(
          filecoinMessage,
          Buffer.from(private_hexstring, 'hex').toString('base64')
        )
        return signature.data
      },

      type: HD_WALLET
    }
  }
}

export default createHDWalletProvider
