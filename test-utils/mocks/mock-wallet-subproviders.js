import { SINGLE_KEY, HD_WALLET, LEDGER } from '../../constants'

const MockSingleKeyProvider = () => ({
  type: SINGLE_KEY,
  getAccounts: () => jest.fn(),
  sign: () => jest.fn()
})

const MockHDWalletProvider = () => ({
  type: HD_WALLET,
  getAccounts: () => jest.fn(),
  sign: () => jest.fn()
})

export default {
  SingleKeyProvider: MockSingleKeyProvider,
  HDWalletProvider: MockHDWalletProvider
}
