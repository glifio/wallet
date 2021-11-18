import { FilecoinNumber } from '@glif/filecoin-number'
import { TESTNET_PATH_CODE } from '../../constants'
import createPath from '../../utils/createPath'

import {
  setLoginOption,
  setError,
  resetLedgerState,
  resetState,
  walletList
} from '../../WalletProvider/state'
import { mockWalletProviderInstance } from '../mocks/mock-wallet-provider'

export const mockFetchDefaultWallet = jest.fn().mockImplementation(() => ({
  balance: new FilecoinNumber('1', 'fil'),
  address: 't1mbk7q6gm4rjlndfqw6f2vkfgqotres3fgicb2uq',
  path: createPath(TESTNET_PATH_CODE, 0)
}))

export default (walletProviderDispatch) => ({
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
  resetLedgerState: jest.fn().mockImplementation(() => {
    walletProviderDispatch(resetLedgerState())
  }),
  resetState: jest.fn().mockImplementation(() => {
    walletProviderDispatch(resetState())
  })
})
