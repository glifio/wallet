import createPath from '../../utils/createPath'
import { HD_WALLET } from '../../constants'

export default rustModule => {
  return mnemonic => {
    // here we close over the private variables, so they aren't accessible to the outside world
    const MNEMONIC = mnemonic
    return {
      getAccounts: async (network = 't', nStart = 0, nEnd = 5) => {
        const accounts = []
        for (let i = nStart; i < nEnd; i += 1) {
          const networkCode = network === 't' ? 1 : 461
          accounts.push(
            rustModule.keyDerive(MNEMONIC, createPath(networkCode, i), '')
              .address
          )
        }
        return accounts
      },

      sign: async (filecoinMessage, path) => {
        const { private_hexstring } = rustModule.keyDerive(MNEMONIC, path, '')
        const { signature } = rustModule.transactionSign(
          filecoinMessage.toString(),
          private_hexstring
        )
        return signature.data
      },

      type: HD_WALLET
    }
  }
}
