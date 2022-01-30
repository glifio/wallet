import { FilecoinNumber } from '@glif/filecoin-number'
import { TESTNET_PATH_CODE } from '../../constants'
import createPath from '../../utils/createPath'

import {
  setLoginOption,
  setError,
  resetLedgerState,
  resetState,
  walletList,
  updateBalance
} from '@glif/wallet-provider-react'
import { mockWalletProviderInstance } from '../../__mocks__/@glif/filecoin-wallet-provider'

export const mockFetchDefaultWallet = jest.fn().mockImplementation(() => ({
  balance: new FilecoinNumber('1', 'fil'),
  address: 't1mbk7q6gm4rjlndfqw6f2vkfgqotres3fgicb2uq',
  path: createPath(TESTNET_PATH_CODE, 0)
}))

export default (walletProviderDispatch, state) => ({
  fetchDefaultWallet: mockFetchDefaultWallet,
  walletList: jest
    .fn()
    .mockImplementation((wallets) =>
      walletProviderDispatch(walletList(wallets))
    ),
  setWalletError: jest
    .fn()
    .mockImplementation((errorMessage) =>
      walletProviderDispatch(setError(errorMessage))
    ),
  setLoginOption: jest
    .fn()
    .mockImplementation((loginOption) =>
      walletProviderDispatch(setLoginOption(loginOption))
    ),
  connectLedger: jest.fn().mockImplementation(() => mockWalletProviderInstance),
  connectMetaMask: jest.fn().mockImplementation(() => {
    walletProviderDispatch({ type: 'METAMASK_CONFIGURED_SUCCESS' })
    return mockWalletProviderInstance
  }),
  getProvider: jest.fn().mockImplementation(() => mockWalletProviderInstance),
  resetLedgerState: jest.fn().mockImplementation(() => {
    walletProviderDispatch(resetLedgerState())
  }),
  resetState: jest.fn().mockImplementation(() => {
    walletProviderDispatch(resetState())
  }),
  updateBalance: jest.fn().mockImplementation((balance, index) => {
    walletProviderDispatch(updateBalance(balance, index))
  }),
  walletError: jest.fn().mockImplementation(() => state.error),
  resetWalletError: jest.fn().mockImplementation(() => {})
})
