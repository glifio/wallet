import { SINGLE_KEY } from '../../constants'

export default rustModule => {
  // this is a v weird pattern
  // but we close over this private variable to protect it from being accessed from the outside world
  // in the future we could transform this whole closure system into functions and away from a mix of
  // closures && classes, but for now we're still using the `new` keyword (bc of the ledger provider)
  // so this is the fastest approach
  let privPrivateKey = ''
  return class SingleKeyProvider {
    constructor(privateKey) {
      privPrivateKey = privateKey
      this.type = SINGLE_KEY
    }

    /* the first two params in this function are `from` and `to` indexes, which don't matter for a single private key */
    getAccounts = async (_, __, network = 't') => {
      return [rustModule.keyRecover(privPrivateKey, network === 't').address]
    }

    /* the first param in this function is `path`, which doesn't matter for a single private key */
    sign = async (_, filecoinMessage) => {
      const { private_hexstring } = rustModule.keyRecover(privPrivateKey)
      const { signature } = rustModule.transactionSign(
        filecoinMessage.toString(),
        private_hexstring
      )
      return signature.data
    }
  }
}
