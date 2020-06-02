/* eslint-disable react/prop-types */
import React, { useReducer } from 'react'
import { Provider } from 'react-redux'

import { NetworkCheck } from '../../lib/check-network'
import BalancePoller from '../../lib/update-balance'
import { ConverterContext } from '../../lib/Converter'
import { theme, ThemeProvider } from '../../components/Shared'
import { initializeStore } from '..'
import walletProviderReducer, {
  initialState as walletProviderInitialState
} from '../../WalletProvider/state'
import { WalletProviderContext } from '../../WalletProvider'
import {
  mockWalletProviderInstance,
  defaultMockConverterInstance,
  createMockWalletProviderContextFuncs,
  mockWalletSubproviders
} from './mocks'
import { presets, composeWalletProviderState } from './composeState'

/**
 * VALID OPTIONS:
 * mockConverterInstance (an object that stubs the converter functionality)
 * walletProviderReducer (a reducer to stub the state handling of the wallet provider)
 * walletProviderInitialState(a reducer to stub the state of the walletProvider context)
 * walletProviderDispatch(a dispatcher to mock/read calls to the walletProvider's state)
 * pathname
 * query (usually { network: 'f' } or { network: 't' })
 */

export default (statePreset = 'preOnboard', options = {}) => {
  const state = options.state || presets[statePreset]
  const store = initializeStore(state)

  const mockConverterInstance =
    options.mockConverterInstance || defaultMockConverterInstance

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

    const mockWalletProviderContextFuncs = createMockWalletProviderContextFuncs(
      options.walletProviderDispatch || walletProviderDispatch
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
      </Provider>
    )
  }

  return {
    Tree,
    store,
    walletProvider: mockWalletProviderInstance
  }
}
