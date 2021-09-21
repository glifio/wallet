import { createContext, useContext, useReducer } from 'react'
import createMockWalletProviderContextFuncs from '../../test-utils/composeMockAppTree/createWalletProviderContextFuncs'
import { composeWalletProviderState } from '../../test-utils/composeMockAppTree/composeState'
import mockWalletSubproviders from '../../test-utils/mocks/mock-wallet-subproviders'
import walletProviderReducer, {
  initialState as walletProviderInitialState
} from '../../WalletProvider/state'

export const WalletProviderContext = createContext({ walletProvider: null })

const WalletProviderWrapper = ({ children, options, statePreset }) => {
  const [initialWalletProviderState, walletProviderDispatch] = useReducer(
    options?.reducer || walletProviderReducer,
    options?.walletProviderInitialState || walletProviderInitialState
  )

  const walletProviderState = composeWalletProviderState(
    initialWalletProviderState,
    statePreset
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
      {children}
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
