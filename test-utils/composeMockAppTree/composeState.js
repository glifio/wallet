import cloneDeep from 'lodash.clonedeep'
import { FilecoinNumber } from '@glif/filecoin-number'

import createPath from '../../utils/createPath'
import { IMPORT_MNEMONIC } from '../../constants'
import { initialState } from '../../store/states'
import { mockWalletProviderInstance } from '../mocks/mock-wallet-provider'

export const presets = {
  preOnboard: cloneDeep(initialState),
  postOnboard: cloneDeep({
    ...initialState,
    wallets: [
      {
        address: 't1z225tguggx4onbauimqvxzutopzdr2m4s6z6wgi',
        balance: new FilecoinNumber('1', 'fil'),
        path: createPath(1, 0)
      }
    ],
    selectedWalletIdx: 0
  }),
  postOnboardLowBal: cloneDeep({
    ...initialState,
    wallets: [
      {
        address: 't1z225tguggx4onbauimqvxzutopzdr2m4s6z6wgi',
        balance: new FilecoinNumber('.000001', 'fil'),
        path: createPath(1, 0)
      }
    ],
    selectedWalletIdx: 0
  }),
  postOnboardWithError: cloneDeep({
    ...initialState,
    error: 'error for testing',
    wallets: [
      {
        address: 't1z225tguggx4onbauimqvxzutopzdr2m4s6z6wgi',
        balance: new FilecoinNumber('1', 'fil'),
        path: createPath(1, 0)
      }
    ],
    selectedWalletIdx: 0
  }),
  postInvestorOnboard: cloneDeep({
    ...initialState,
    wallets: [
      {
        address: 't1z225tguggx4onbauimqvxzutopzdr2m4s6z6wgi',
        balance: new FilecoinNumber('1', 'fil'),
        path: createPath(1, 0)
      }
    ],
    selectedWalletIdx: 0,
    investor: 'Qmcv45ZPc3oEwsbcHMRcs3AG59Rp8EUFr6Dm512KUswpRA'
  })
}

export const composeWalletProviderState = (
  initialWalletProviderState,
  preset
) => {
  switch (preset) {
    case 'postOnboard': {
      return Object.freeze({
        ...initialWalletProviderState,
        walletType: IMPORT_MNEMONIC,
        walletProvider: mockWalletProviderInstance
      })
    }
    case 'postOnboardLowBal': {
      return Object.freeze({
        ...initialWalletProviderState,
        walletType: IMPORT_MNEMONIC,
        walletProvider: mockWalletProviderInstance
      })
    }
    case 'postOnboardWithError': {
      return Object.freeze({
        ...initialWalletProviderState,
        walletType: IMPORT_MNEMONIC,
        walletProvider: mockWalletProviderInstance
      })
    }
    default:
      return initialWalletProviderState
  }
}
