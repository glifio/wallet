import { FilecoinNumber } from '@openworklabs/filecoin-number'

import {
  setWalletType,
  setError,
  resetLedgerState,
  resetState
} from '../../WalletProvider/state'

export default walletProviderDispatch => ({
  fetchDefaultWallet: jest.fn().mockImplementation(() => ({
    balance: new FilecoinNumber('1', 'fil'),
    address: 't1mbk7q6gm4rjlndfqw6f2vkfgqotres3fgicb2uq',
    path: "m/44'/1'/0/0/0"
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
