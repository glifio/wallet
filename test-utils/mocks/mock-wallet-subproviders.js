import { SINGLE_KEY, HD_WALLET, LEDGER } from '../../constants'
import {
  mockSign,
  mockGetAddressAndPubKey,
  mockGetVersion
} from './mock-ledger-filecoin'

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

const MockLedgerProvider = () => ({
  type: LEDGER,
  getAccounts: () => jest.fn(),
  sign: () => mockSign(),
  getVersion: () => mockGetVersion()
})

export default {
  SingleKeyProvider: MockSingleKeyProvider,
  HDWalletProvider: MockHDWalletProvider,
  LedgerProvider: MockLedgerProvider
}
