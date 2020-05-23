import { SINGLE_KEY } from '../../constants'

export default rustModule => {
  return class SingleKeyProvider {
    constructor(privateKey) {
      this.privateKey = privateKey
      this.type = SINGLE_KEY
    }

    getAccounts = async (_, __, network = 't') => {
      return [rustModule.keyRecover(this.privateKey, network === 't').address]
    }

    sign = async (_, filecoinMessage) => {
      const { private_hexstring } = rustModule.keyRecover(this.privateKey)
      const { signature } = rustModule.transactionSign(
        filecoinMessage.toString(),
        private_hexstring
      )
      return signature.data
    }
  }
}
