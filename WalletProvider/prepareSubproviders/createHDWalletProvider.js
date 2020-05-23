import createPath from '../../utils/createPath'
import { HD_WALLET } from '../../constants'

export default rustModule => {
  return class HDWalletProvider {
    constructor(mnemonic) {
      this.mnemonic = mnemonic
      this.type = HD_WALLET
    }

    getAccounts = async (nStart = 0, nEnd = 5, network = 't') => {
      const accounts = []
      for (let i = nStart; i < nEnd; i += 1) {
        const networkCode = network === 't' ? 1 : 461
        accounts.push(
          rustModule.keyDerive(this.mnemonic, createPath(networkCode, i), '')
            .address
        )
      }
      return accounts
    }

    sign = async (path, filecoinMessage) => {
      const { private_hexstring } = rustModule.keyDerive(
        this.mnemonic,
        path,
        ''
      )
      const { signature } = rustModule.transactionSign(
        filecoinMessage.toString(),
        private_hexstring
      )
      return signature.data
    }
  }
}
