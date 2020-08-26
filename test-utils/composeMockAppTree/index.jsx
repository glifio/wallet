/* eslint-disable react/prop-types */
import React, { useReducer } from 'react'
import { Provider } from 'react-redux'
import { Converter } from '@openworklabs/filecoin-number'

import { NetworkCheck } from '../../lib/check-network'
import BalancePoller from '../../lib/update-balance'
import { ConverterContext } from '../../lib/Converter'
import { theme, ThemeProvider } from '../../components/Shared'
import { initializeStore } from '..'
import walletProviderReducer, {
  initialState as walletProviderInitialState
} from '../../WalletProvider/state'
import { WasmContext } from '../../lib/WasmLoader'
import { WalletProviderContext } from '../../WalletProvider'
import { mockWalletProviderInstance } from '../mocks/mock-wallet-provider'
import createMockWalletProviderContextFuncs from './createWalletProviderContextFuncs.js'
import mockWalletSubproviders from '../mocks/mock-wallet-subproviders'
import { presets, composeWalletProviderState } from './composeState'
import { TESTNET } from '../../constants'

/**
 * This function is a wrapper that mocks everything the filecoin app needs for testing
 *
 * VALID OPTIONS:
 * mockConverterInstance (an object that stubs the converter functionality)
 * walletProviderReducer (a reducer to stub the state handling of the wallet provider)
 * walletProviderInitialState(a reducer to stub the state of the walletProvider context)
 * walletProviderDispatch(a dispatcher to mock/read calls to the walletProvider's state)
 * pathname
 * query (usually { network: 'f' } or { network: TESTNET })
 */

export default (statePreset = 'preOnboard', options = {}) => {
  const state = options.state || presets[statePreset]
  const store = initializeStore(state)

  const pathname = options.pathname || '/wallet'
  const query = options.query || { network: TESTNET }

  const Tree = ({ children }) => {
    const [initialWalletProviderState, walletProviderDispatch] = useReducer(
      options.reducer || walletProviderReducer,
      options.walletProviderInitialState || walletProviderInitialState
    )

    const walletProviderState = composeWalletProviderState(
      initialWalletProviderState,
      statePreset
    )

    const mockWalletProviderContextFuncs = createMockWalletProviderContextFuncs(
      options.walletProviderDispatch || walletProviderDispatch
    )

    return (
      <Provider store={store}>
        <WasmContext.Provider
          value={{
            generateMnemonic: jest
              .fn()
              .mockImplementation(
                () =>
                  'slender spread awkward chicken noise useful thank dentist tip bronze ritual explain version spot collect whisper glow peanut bus local country album punch frown'
              )
          }}
        >
          <ConverterContext.Provider
            value={{
              converter: new Converter(),
              converterError: options.converterError || null
            }}
          >
            <WalletProviderContext.Provider
              value={{
                state: walletProviderState,
                dispatch:
                  options.walletProviderDispatch || walletProviderDispatch,
                walletSubproviders: {
                  ...mockWalletSubproviders
                },
                ...mockWalletProviderContextFuncs
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
        </WasmContext.Provider>
      </Provider>
    )
  }

  return {
    Tree,
    store,
    walletProvider: mockWalletProviderInstance
  }
}
