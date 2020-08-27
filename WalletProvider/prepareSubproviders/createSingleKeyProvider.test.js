import { Message } from '@openworklabs/filecoin-message'
import createSingleKeyProvider from './createSingleKeyProvider'
import mockRustModule from '@zondax/filecoin-signing-tools'
import { TESTNET, SINGLE_KEY } from '../../constants'

const privateKey = 'xxxxxxtttttzzzzzzz'

const followsSubproviderInterface = subprovider =>
  !!(subprovider.sign && subprovider.getAccounts && subprovider.type)

describe('createHDWalletProvider', () => {
  beforeEach(jest.clearAllMocks)

  test('it returns an HDWallet subprovider that follows the wallet subprovider interface', () => {
    const SingleKeyProvider = createSingleKeyProvider(mockRustModule)
    const singleKeyProvider = SingleKeyProvider(privateKey)
    expect(followsSubproviderInterface(singleKeyProvider)).toBe(true)
    expect(singleKeyProvider.type).toBe(SINGLE_KEY)
  })

  describe('HDWalletProvider', () => {
    describe('sign', () => {
      beforeEach(jest.clearAllMocks)

      test('it calls the transactionSign wasm method', async () => {
        const msg = new Message({
          from: 't1hvuzpfdycc6z6mjgbiyaiojikd6wk2vwy7muuei',
          to: 't1t5gdjfb6jojpivbl5uek6vf6svlct7dph5q2jwa',
          value: '1000',
          method: 0,
          nonce: 0
        })
        const SingleKeyProvider = createSingleKeyProvider(mockRustModule)
        const singleKeyProvider = SingleKeyProvider(privateKey)
        await singleKeyProvider.sign(msg.toLotusType())
        expect(mockRustModule.transactionSign).toHaveBeenCalled()
      })
    })

    describe('getAccounts', () => {
      beforeEach(jest.clearAllMocks)

      test('it returns an array of accounts', async () => {
        const SingleKeyProvider = createSingleKeyProvider(mockRustModule)
        const singleKeyProvider = SingleKeyProvider(privateKey)
        // these first 2 args dont matter for single key provider, since you can only generate 1 account
        const accounts = await singleKeyProvider.getAccounts(TESTNET)
        expect(accounts.length).toBe(1)
        expect(mockRustModule.keyRecover).toHaveBeenCalledTimes(1)
      })
    })
  })
})
