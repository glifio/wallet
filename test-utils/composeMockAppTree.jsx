/* eslint-disable react/prop-types */
import React, { createContext, useReducer } from 'react'
import cloneDeep from 'lodash.clonedeep'

import { FilecoinNumber } from '@openworklabs/filecoin-number'
import { Provider } from 'react-redux'

import { NetworkCheck } from '../lib/check-network'
import BalancePoller from '../lib/update-balance'
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

export const ConverterContext = createContext({})
export const WalletProviderContext = createContext({})

const presets = {
  preOnboard: cloneDeep(initialState),
  postOnboard: cloneDeep({ ...initialState, wallets: [] })
}

/**
 * VALID OPTIONS:
 * mockConverterInstance (an object that stubs the converter functionality)
 * walletProviderReducer (a reducer to stub the state handling of the wallet provider)
 * walletProviderInitialState(a reducer to stub the state of the walletProvider context)
 * pathname
 * query (usually { network: 'f' } or { network: 't' })
 */

export default (rdxStatePreset = 'preOnboard', options = {}) => {
  const state = options.state || presets[rdxStatePreset]
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

  const [walletProviderState, walletProviderDispatch] = useReducer(
    options.reducer || walletProviderReducer,
    options.walletProviderInitialState || walletProviderInitialState
  )

  const pathname = options.pathname || '/wallet'
  const query = options.query || { network: 't' }

  const Tree = ({ children }) => {
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
            />
            <BalancePoller />
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
          </WalletProviderContext.Provider>
        </ConverterContext.Provider>
      </Provider>
    )
  }

  return { Tree, store }
}
