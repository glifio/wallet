/* eslint-disable react/prop-types */
import {
  PendingMessageProvider,
  WalletProviderWrapper,
  initialState as walletProviderInitialState,
  TestEnvironment
} from '@glif/react-components'
import { MockedProvider } from '@apollo/client/testing'

import { mockWalletProviderInstance } from '../../__mocks__/@glif/filecoin-wallet-provider'
import { composeWalletProviderState } from '../../test-utils/composeMockAppTree/composeState'

const Index = (statePreset = 'preOnboard', options = {}) => {
  // here you can pass a walletProviderInitialState and a preset to shape the store how you want it for testing
  const initialState = composeWalletProviderState(
    options?.walletProviderInitialState || walletProviderInitialState,
    statePreset
  )

  let walletProviderCache = { ...initialState }

  const cacheWalletProviderState = (state) => {
    walletProviderCache = { ...state }
    return <></>
  }

  const getWalletProviderState = () => walletProviderCache

  const Tree = ({ children }) => {
    return (
      <TestEnvironment>
        <MockedProvider mocks={[]} addTypeName={false}>
          <PendingMessageProvider>
            <WalletProviderWrapper
              options={options}
              statePreset={statePreset}
              getState={cacheWalletProviderState}
              initialState={initialState}
            >
              {children}
            </WalletProviderWrapper>
          </PendingMessageProvider>
        </MockedProvider>
      </TestEnvironment>
    )
  }

  return {
    Tree,
    walletProvider: mockWalletProviderInstance,
    getWalletProviderState
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
