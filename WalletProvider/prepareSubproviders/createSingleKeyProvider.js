import { SINGLE_KEY, TESTNET } from '../../constants'

export default rustModule => {
  return privateKey => {
    // here we close over the private variables, so they aren't accessible to the outside world
    const PRIVATE_KEY = privateKey
    return {
      getAccounts: async (network = TESTNET) => {
        return [rustModule.keyRecover(PRIVATE_KEY, network === TESTNET).address]
      },

      sign: async filecoinMessage => {
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
