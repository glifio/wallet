import { Message } from '@openworklabs/filecoin-message'
import createHDWalletProvider from './createHDWalletProvider'
import mockRustModule from '@zondax/filecoin-signing-tools'
import { HD_WALLET, TESTNET } from '../../constants'

const mnemonic =
  'slender spread awkward chicken noise useful thank dentist tip bronze ritual explain version spot collect whisper glow peanut bus local country album punch frown'

const followsSubproviderInterface = subprovider =>
  !!(subprovider.sign && subprovider.getAccounts && subprovider.type)

describe('createHDWalletProvider', () => {
  beforeEach(jest.clearAllMocks)

  test('it returns an HDWallet subprovider that follows the wallet subprovider interface', () => {
    const HDWalletProvider = createHDWalletProvider(mockRustModule)
    const hdWalletProvider = HDWalletProvider(mnemonic)
    expect(followsSubproviderInterface(hdWalletProvider)).toBe(true)
    expect(hdWalletProvider.type).toBe(HD_WALLET)
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
        const HDWalletProvider = createHDWalletProvider(mockRustModule)
        const hdWalletProvider = HDWalletProvider(mnemonic)
        await hdWalletProvider.sign(msg, "m/44'/461'/0/0/2")
        expect(mockRustModule.transactionSign).toHaveBeenCalled()
      })
    })

    describe('getAccounts', () => {
      beforeEach(jest.clearAllMocks)

      test('it returns an array of accounts', async () => {
        const HDWalletProvider = createHDWalletProvider(mockRustModule)
        const hdWalletProvider = HDWalletProvider(mnemonic)
        const accounts = await hdWalletProvider.getAccounts(TESTNET, 0, 5)
        expect(accounts.length).toBe(5)
        expect(mockRustModule.keyDerive).toHaveBeenCalledTimes(5)
      })
    })
  })
})
