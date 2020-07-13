import createPath from '../../utils/createPath'
import { HD_WALLET } from '../../constants'

export default rustModule => {
  // this is a v weird pattern
  // but we close over this private variable to protect it from being accessed from the outside world
  // in the future we could transform this whole closure system into functions and away from a mix of
  // closures && classes, but for now we're still using the `new` keyword (bc of the ledger provider)
  // so this is the fastest approach
  let privMnemonic = ''
  return class HDWalletProvider {
    constructor(mnemonic) {
      privMnemonic = mnemonic
      this.type = HD_WALLET
    }

    getAccounts = async (nStart = 0, nEnd = 5, network = 't') => {
      const accounts = []
      for (let i = nStart; i < nEnd; i += 1) {
        const networkCode = network === 't' ? 1 : 461
        accounts.push(
          rustModule.keyDerive(privMnemonic, createPath(networkCode, i), '')
            .address
        )
      }
      return accounts
    }

    sign = async (path, filecoinMessage) => {
      const { private_hexstring } = rustModule.keyDerive(privMnemonic, path, '')
      const { signature } = rustModule.transactionSign(
        filecoinMessage.toString(),
        private_hexstring
      )
      return signature.data
    }
  }
}
