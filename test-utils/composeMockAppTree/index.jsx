/* eslint-disable react/prop-types */
import React from 'react'
import { Provider } from 'react-redux'
import { Converter } from '@glif/filecoin-number'
import BalancePoller from '../../lib/update-balance'
import { ConverterContext } from '../../lib/Converter'
import { theme, ThemeProvider } from '../../components/Shared'
import { WasmContext } from '../../lib/WasmLoader'
import { mockWalletProviderInstance } from '../mocks/mock-wallet-provider'
import * as wasmMethods from '../mocks/mock-filecoin-signer-wasm'
import { MsigProviderWrapper } from '../../MsigProvider'
import WalletProviderWrapper from '../../WalletProvider'
import mockReduxStoreWithState from './mockReduxStoreWithState'

jest.mock('../../WalletProvider')
jest.mock('../../MsigProvider')

const Index = (statePreset = 'preOnboard', options = {}) => {
  const store = mockReduxStoreWithState({ state: options?.state, statePreset })

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
              <MsigProviderWrapper options={options} statePreset={statePreset}>
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
 * query
 */

export default Index
