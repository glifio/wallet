import cloneDeep from 'lodash.clonedeep'
import { FilecoinNumber } from '@glif/filecoin-number'

import createPath from '../../utils/createPath'
import { IMPORT_MNEMONIC } from '../../constants'
import { initialState } from '../../store/states'
import { mockWalletProviderInstance } from '../mocks/mock-wallet-provider'
import { emptyMsigState } from '../../MsigProvider/types'

export const WALLET_ADDRESS = 't1z225tguggx4onbauimqvxzutopzdr2m4s6z6wgi'

export const presets = {
  preOnboard: cloneDeep(initialState),
  postOnboard: cloneDeep({
    ...initialState,
    wallets: [
      {
        address: WALLET_ADDRESS,
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
        address: WALLET_ADDRESS,
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
        address: WALLET_ADDRESS,
        balance: new FilecoinNumber('1', 'fil'),
        path: createPath(1, 0)
      }
    ],
    selectedWalletIdx: 0
  }),
  pendingMsigCreate: cloneDeep({
    ...initialState,
    wallets: [
      {
        address: WALLET_ADDRESS,
        balance: new FilecoinNumber('1', 'fil'),
        path: createPath(1, 0)
      }
    ],
    selectedWalletIdx: 0,
    messages: {
      confirmed: [],
      pending: [
        {
          cid: 'bafy2bzaced2godar6dht6ag6omfa53jr6tykygtzskzodqo2k4ngvyou4yct2',
          from: 'f1nq5k2mps5umtebdovlyo7y6a3ywc7u4tobtuo3a',
          gasFeeCap: '100425',
          gasLimit: 11452096,
          gasPremium: '99371',
          maxFee: '1150076740800',
          method: 'EXEC',
          nonce: 56,
          paidFee: '0',
          params: {
            num_approvals_threshold: 1,
            signers: ['f1nq5k2mps5umtebdovlyo7y6a3ywc7u4tobtuo3a'],
            start_epoch: '0',
            unlock_duration: '0'
          },
          timestamp: 1632317830,
          to: 'f01'
        }
      ]
    }
  })
}

export const composeWalletProviderState = initialWalletProviderState => {
  return Object.freeze({
    ...initialWalletProviderState,
    walletType: IMPORT_MNEMONIC,
    walletProvider: mockWalletProviderInstance
  })
}

export const composeMsigProviderState = (preset: keyof typeof presets) => {
  switch (preset) {
    case 'preOnboard': {
      return Object.freeze(emptyMsigState)
    }
    case 'pendingMsigCreate': {
      return Object.freeze(emptyMsigState)
    }
    default: {
      return Object.freeze(emptyMsigState)
    }
  }
}
