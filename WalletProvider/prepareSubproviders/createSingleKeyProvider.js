import { SINGLE_KEY } from '../../constants'

export default rustModule => {
  return privateKey => {
    // here we close over the private variables, so they aren't accessible to the outside world
    const PRIVATE_KEY = privateKey
    return {
      getAccounts: async (network = 't') => {
        return [rustModule.keyRecover(PRIVATE_KEY, network === 't').address]
      },

      sign: async filecoinMessage => {
        const { private_hexstring } = rustModule.keyRecover(PRIVATE_KEY)
        const { signature } = rustModule.transactionSign(
          filecoinMessage.toString(),
          private_hexstring
        )
        return signature.data
      },

      type: SINGLE_KEY
    }
  }
}
