import toLowerCaseMsgFields from '../../utils/toLowerCaseMsgFields'
import { SINGLE_KEY } from '../../constants'

export default rustModule => {
  return class SingleKeyProvider {
    constructor(privateKey) {
      this.privateKey = privateKey
      this.type = SINGLE_KEY
    }

    getAccounts = async (_, __, network = 't') => {
      return [rustModule.key_recover(this.privateKey, network === 't').address]
    }

    sign = async (_, filecoinMessage) => {
      const formattedMessage = toLowerCaseMsgFields(filecoinMessage.toString())
      const { private_hexstring } = rustModule.keyRecover(this.privateKey)
      const { signature } = rustModule.transactionSign(
        formattedMessage,
        private_hexstring
      )
      return signature.data
    }
  }
}
