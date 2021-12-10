import { createContext, useContext, useReducer } from 'react'
import createMockWalletProviderContextFuncs from '../../test-utils/composeMockAppTree/createWalletProviderContextFuncs'
import walletProviderReducer, {
  initialState as walletProviderInitialState
} from '../../node_modules/@glif/wallet-provider-react/dist/lib/WalletProvider/state'
export * from '../../node_modules/@glif/wallet-provider-react/dist'

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
        // @ts-ignore
        state: walletProviderState,
        dispatch: options?.walletProviderDispatch || walletProviderDispatch,
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

export function useWallet() {
  const { wallets, selectedWalletIdx } = useWalletProvider()

  if (wallets.length === 0) return noWallet
  if (!wallets[selectedWalletIdx]) return noWallet
  return wallets[selectedWalletIdx]
}

export default WalletProviderWrapper
