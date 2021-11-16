import { FilecoinNumber } from '@glif/filecoin-number'

import {
  setLoginOption,
  setError,
  resetLedgerState,
  resetState
} from '../../WalletProvider/state'
import { mockWalletProviderInstance } from '../mocks/mock-wallet-provider'

export default (walletProviderDispatch) => ({
  fetchDefaultWallet: jest.fn().mockImplementation(() => ({
    balance: new FilecoinNumber('1', 'fil'),
    address: 't1mbk7q6gm4rjlndfqw6f2vkfgqotres3fgicb2uq',
    path: "m/44'/1'/0/0/0"
  })),
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
