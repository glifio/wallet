import WalletProvider from '@openworklabs/filecoin-wallet-provider'
import { FilecoinNumber } from '@openworklabs/filecoin-number'

import {
  setWalletType,
  setError,
  resetLedgerState,
  resetState
} from '../../WalletProvider/state'
import { SINGLE_KEY, HD_WALLET, LEDGER } from '../../constants'

jest.mock('@openworklabs/filecoin-wallet-provider')

const useRouter = jest.spyOn(require('next/router'), 'useRouter')

export const mockRouterReplace = jest.fn(() => {})
export const mockRouterPush = jest.fn(() => {})
const unix = jest.spyOn(require('dayjs'), 'unix')

unix.mockImplementation(() => {
  return {
    format: fmt => {
      if (fmt === 'MMM DD') return 'Jan 12'
      if (fmt === 'hh:mmA') return '2:30PM'
    }
  }
})

useRouter.mockImplementation(() => ({
  query: 'network=t',
  push: mockRouterPush,
  replace: mockRouterReplace
}))

const mockGetAccounts = jest
  .fn()
  .mockImplementation(() =>
    Promise.resolve(['t1mbk7q6gm4rjlndfqw6f2vkfgqotres3fgicb2uq'])
  )

const mockGetBalance = jest
  .fn()
  .mockImplementation(() => Promise.resolve(new FilecoinNumber('1', 'fil')))

WalletProvider.mockImplementation(() => {
  return {
    wallet: {
      getAccounts: mockGetAccounts,
      sign: jest.fn().mockImplementation(() => 'xxxyyyyzzzz')
    },
    getBalance: mockGetBalance,
    getNonce: jest.fn().mockImplementation(() => 0),
    estimateGas: jest
      .fn()
      .mockImplementation(() => new FilecoinNumber('122', 'attofil')),
    sendMessage: jest.fn().mockImplementation(() => 'QmZCid!')
  }
})

export const mockWalletProviderInstance = new WalletProvider()

export const defaultMockConverterInstance = {
  cacheConversionRate: jest.fn(),
  toFIL: jest.fn().mockImplementation(amount => {
    return new FilecoinNumber(amount, 'fil').dividedBy(5)
  }),
  fromFIL: jest.fn().mockImplementation(amount => {
    return new FilecoinNumber(amount, 'fil').multipliedBy(5)
  })
}

export const createMockWalletProviderContextFuncs = walletProviderDispatch => ({
  fetchDefaultWallet: jest.fn().mockImplementation(() => ({
    balance: new FilecoinNumber('1', 'fil'),
    address: 't1mbk7q6gm4rjlndfqw6f2vkfgqotres3fgicb2uq',
    path: ''
  })),
  setWalletError: jest
    .fn()
    .mockImplementation(errorMessage =>
      walletProviderDispatch(setError(errorMessage))
    ),
  setWalletType: jest
    .fn()
    .mockImplementation(walletType =>
      walletProviderDispatch(setWalletType(walletType))
    ),
  setLedgerProvider: jest.fn(),
  connectLedger: jest.fn(),
  resetLedgerState: jest.fn().mockImplementation(() => {
    walletProviderDispatch(resetLedgerState())
  }),
  resetState: jest.fn().mockImplementation(() => {
    walletProviderDispatch(resetState())
  })
})

class MockSingleKeyProvider {
  type = SINGLE_KEY

  getAccounts = () => jest.fn()

  sign = () => jest.fn()
}

class MockHDWalletProvider {
  type = HD_WALLET

  getAccounts = () => jest.fn()

  sign = () => jest.fn()
}

export const mockWalletSubproviders = {
  SingleKeyProvider: MockSingleKeyProvider,
  HDWalletProvider: MockHDWalletProvider
}
