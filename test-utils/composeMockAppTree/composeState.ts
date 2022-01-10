import { FilecoinNumber } from '@glif/filecoin-number'
import { WalletProviderState } from '@glif/wallet-provider-react'

import createPath from '../../utils/createPath'
import { IMPORT_MNEMONIC, IMPORT_SINGLE_KEY } from '../../constants'
import { mockWalletProviderInstance } from '../../__mocks__/@glif/filecoin-wallet-provider'
import { WALLET_ADDRESS } from '../constants'

export type Preset =
  | 'preOnboard'
  | 'postOnboard'
  | 'postOnboardLowBal'
  | 'postOnboardWithError'
  | 'selectedOtherWallet'
  | 'pendingMsigCreate'

export const composeWalletProviderState = (
  initialWalletProviderState: WalletProviderState,
  preset: Preset
) => {
  switch (preset) {
    case 'postOnboard': {
      return Object.freeze({
        ...initialWalletProviderState,
        walletType: IMPORT_MNEMONIC,
        walletProvider: mockWalletProviderInstance,
        wallets: [
          {
            address: WALLET_ADDRESS,
            balance: new FilecoinNumber('1', 'fil'),
            path: createPath(1, 0)
          }
        ],
        selectedWalletIdx: 0,
        loginOption: IMPORT_SINGLE_KEY
      })
    }
    case 'postOnboardLowBal': {
      return Object.freeze({
        ...initialWalletProviderState,
        walletType: IMPORT_MNEMONIC,
        walletProvider: mockWalletProviderInstance,
        wallets: [
          {
            address: WALLET_ADDRESS,
            balance: new FilecoinNumber('.000001', 'fil'),
            path: createPath(1, 0)
          }
        ],
        selectedWalletIdx: 0,
        loginOption: IMPORT_SINGLE_KEY
      })
    }
    case 'postOnboardWithError': {
      return Object.freeze({
        ...initialWalletProviderState,
        walletProvider: mockWalletProviderInstance,
        wallets: [
          {
            address: WALLET_ADDRESS,
            balance: new FilecoinNumber('1', 'fil'),
            path: createPath(1, 0)
          }
        ],
        selectedWalletIdx: 0,
        loginOption: IMPORT_SINGLE_KEY
      })
    }
    case 'selectedOtherWallet': {
      return Object.freeze({
        ...initialWalletProviderState,
        walletProvider: mockWalletProviderInstance,
        wallets: [
          {
            address: WALLET_ADDRESS,
            balance: new FilecoinNumber('1', 'fil'),
            path: createPath(1, 0)
          },
          {
            address: 't1nq5k2mps5umtebdovlyo7y6a3ywc7u4tobtuo3a',
            balance: new FilecoinNumber('5', 'fil'),
            path: createPath(1, 1)
          }
        ],
        selectedWalletIdx: 1,
        loginOption: IMPORT_MNEMONIC
      })
    }
    default:
      return initialWalletProviderState
  }
}
