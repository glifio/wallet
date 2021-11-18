import { createContext, useContext, useReducer } from 'react'
import createMockWalletProviderContextFuncs from '../../test-utils/composeMockAppTree/createWalletProviderContextFuncs'
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
  initialState,
  getState
}) => {
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
