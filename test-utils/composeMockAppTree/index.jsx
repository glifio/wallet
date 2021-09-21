/* eslint-disable react/prop-types */
import React from 'react'
import { Provider } from 'react-redux'
import { Converter } from '@glif/filecoin-number'

import { NetworkChecker } from '../../lib/check-network'
import BalancePoller from '../../lib/update-balance'
import { ConverterContext } from '../../lib/Converter'
import { theme, ThemeProvider } from '../../components/Shared'
import { initializeStore } from '..'
import { WasmContext } from '../../lib/WasmLoader'
import { mockWalletProviderInstance } from '../mocks/mock-wallet-provider'
import * as wasmMethods from '../mocks/mock-filecoin-signer-wasm'
import { presets } from './composeState'
import { TESTNET } from '../../constants'
import { MsigProviderWrapper } from '../../MsigProvider'
import WalletProviderWrapper from '../../WalletProvider'

jest.mock('../../WalletProvider')
jest.mock('../../MsigProvider')

const Index = (statePreset = 'preOnboard', options = {}) => {
  const state = options.state || presets[statePreset]
  const store = initializeStore(state)

  const pathname = options.pathname || '/wallet'
  const query = options.query || { network: TESTNET }

  const Tree = ({ children }) => {
    return (
      <Provider store={store}>
        <WasmContext.Provider value={wasmMethods}>
          <ConverterContext.Provider
            value={{
              converter: new Converter(),
              converterError: options.converterError || null
            }}
          >
            <WalletProviderWrapper options={options} statePreset={statePreset}>
              <MsigProviderWrapper>
                <NetworkChecker
                  networkFromRdx={store.getState().network}
                  pathname={pathname}
                  query={query}
                  switchNetwork={jest.fn()}
                />
                <BalancePoller />
                <ThemeProvider theme={theme}>{children}</ThemeProvider>
              </MsigProviderWrapper>
            </WalletProviderWrapper>
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

export default Index
