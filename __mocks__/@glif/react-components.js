import { useContext, createContext, useReducer } from 'react'
import {
  walletProviderReducer,
  initialState as walletProviderInitialState,
  noWallet
} from '@glif/react-components'
import createMockWalletProviderContextFuncs from '../../test-utils/composeMockAppTree/createWalletProviderContextFuncs'

export * from '../../node_modules/@glif/react-components/dist'

export const pushPendingMessageSpy = jest.fn()
const clearPendingMessageSpy = jest.fn()
const messages = []

const contextValue = {
  messages,
  pushPendingMessage: pushPendingMessageSpy,
  clearPendingMessage: clearPendingMessageSpy
}

export const PendingMsgContext = createContext(contextValue)

export const PendingMessageProvider = ({ children }) => {
  return (
    <PendingMsgContext.Provider value={contextValue}>
      {children}
    </PendingMsgContext.Provider>
  )
}

export const useSubmittedMessages = () => {
  return useContext(PendingMsgContext)
}

export const WalletProviderContext = createContext({
  ...walletProviderInitialState
})

export const WalletProviderWrapper = ({
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
    options?.walletProviderDispatch || walletProviderDispatch,
    walletProviderState
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
