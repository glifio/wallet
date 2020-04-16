/* eslint-disable react/prop-types */
import React, { useReducer } from 'react'
import cloneDeep from 'lodash.clonedeep'
import axios from 'axios'

import WalletProvider from '@openworklabs/filecoin-wallet-provider'
import { FilecoinNumber } from '@openworklabs/filecoin-number'
import { Provider } from 'react-redux'

import { NetworkCheck } from '../lib/check-network'
import BalancePoller from '../lib/update-balance'
import { ConverterContext } from '../lib/Converter'
import { theme, ThemeProvider } from '../components/Shared'
import { initializeStore } from './index'
import { initialState } from '../store/states'
import walletProviderReducer, {
  initialState as walletProviderInitialState,
  setWalletType,
  setError,
  resetLedgerState,
  resetState
} from '../WalletProvider/state'
import { WalletProviderContext } from '../WalletProvider'
import createPath from '../utils/createPath'
import { IMPORT_MNEMONIC } from '../constants'

const useRouter = jest.spyOn(require('next/router'), 'useRouter')

const mockRouter = jest.fn(() => {})
useRouter.mockImplementation(() => ({
  query: 'network=t',
  push: mockRouter,
  replace: mockRouter
}))

jest.mock('@openworklabs/filecoin-wallet-provider')
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

const mockWalletProviderInstance = new WalletProvider()

const presets = {
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
  })
}

const composeWalletProviderState = (initialWalletProviderState, preset) => {
  switch (preset) {
    case 'postOnboard': {
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

/**
 * VALID OPTIONS:
 * mockConverterInstance (an object that stubs the converter functionality)
 * walletProviderReducer (a reducer to stub the state handling of the wallet provider)
 * walletProviderInitialState(a reducer to stub the state of the walletProvider context)
 * pathname
 * query (usually { network: 'f' } or { network: 't' })
 */

export default (statePreset = 'preOnboard', options = {}) => {
  const state = options.state || presets[statePreset]
  const store = initializeStore(state)

  const mockConverterInstance = options.mockConverterInstance || {
    cacheConversionRate: jest.fn(),
    toFIL: jest.fn().mockImplementation(amount => {
      return new FilecoinNumber(amount, 'fil').dividedBy(5)
    }),
    fromFIL: jest.fn().mockImplementation(amount => {
      return new FilecoinNumber(amount, 'fil').multipliedBy(5)
    })
  }

  const pathname = options.pathname || '/wallet'
  const query = options.query || { network: 't' }

  const Tree = ({ children }) => {
    const [initialWalletProviderState, walletProviderDispatch] = useReducer(
      options.reducer || walletProviderReducer,
      options.walletProviderInitialState || walletProviderInitialState
    )

    const walletProviderState = composeWalletProviderState(
      initialWalletProviderState,
      statePreset
    )
    return (
      <Provider store={store}>
        <ConverterContext.Provider
          value={{
            converter: mockConverterInstance,
            converterError: options.converterError || null
          }}
        >
          <WalletProviderContext.Provider
            value={{
              state: walletProviderState,
              dispatch: walletProviderDispatch,
              fetchDefaultWallet: jest.fn().mockImplementation(),
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
            }}
          >
            <NetworkCheck
              networkFromRdx={store.getState().network}
              pathname={pathname}
              query={query}
              switchNetwork={jest.fn()}
            />
            <BalancePoller />
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
          </WalletProviderContext.Provider>
        </ConverterContext.Provider>
      </Provider>
    )
  }

  return { Tree, store, walletProvider: mockWalletProviderInstance }
}
