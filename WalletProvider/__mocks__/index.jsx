import { createContext, useContext, useReducer } from 'react'
import createMockWalletProviderContextFuncs from '../../test-utils/composeMockAppTree/createWalletProviderContextFuncs'
import { composeWalletProviderState } from '../../test-utils/composeMockAppTree/composeState'
import mockWalletSubproviders from '../../test-utils/mocks/mock-wallet-subproviders'
import walletProviderReducer, {
  initialState as walletProviderInitialState
} from '../../WalletProvider/state'

export const WalletProviderContext = createContext({
  ...walletProviderInitialState
})

const WalletProviderWrapper = ({
  children,
  options,
  statePreset,
  getState
}) => {
  // here you can pass a walletProviderInitialState and a preset to shape the store how you want it for testing
  const initialState = composeWalletProviderState(
    options?.walletProviderInitialState || walletProviderInitialState,
    statePreset
  )

  const [walletProviderState, walletProviderDispatch] = useReducer(
    options?.reducer || walletProviderReducer,
    initialState
  )

  const mockWalletProviderContextFuncs = createMockWalletProviderContextFuncs(
    options?.walletProviderDispatch || walletProviderDispatch
  )

  return (
    <WalletProviderContext.Provider
      value={{
        state: walletProviderState,
        dispatch: options?.walletProviderDispatch || walletProviderDispatch,
        walletSubproviders: {
          ...mockWalletSubproviders
        },
        ...mockWalletProviderContextFuncs
      }}
    >
      <>
        {getState(walletProviderState)}
        {children}
      </>
    </WalletProviderContext.Provider>
  )
}

export const useWalletProvider = () => {
  const value = useContext(WalletProviderContext)
  const { state } = value
  return {
    ...state,
    ...value
  }
}

export default WalletProviderWrapper
