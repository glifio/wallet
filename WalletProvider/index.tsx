import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  Dispatch
} from 'react'
import PropTypes from 'prop-types'
import Filecoin, { LedgerProvider } from '@glif/filecoin-wallet-provider'

import reducer, {
  initialState,
  setLoginOption,
  setError,
  resetLedgerState,
  resetState,
  walletList,
  switchWallet,
  updateBalance
} from './state'
import fetchDefaultWallet from './fetchDefaultWallet'
import connectLedger from './connectLedger'
import {
  LoginOption,
  Wallet,
  WalletProviderAction,
  WalletProviderState
} from './types'
import { FilecoinNumber } from '@glif/filecoin-number'

/* eslint-disable no-unused-vars */
type WalletProviderContextType = {
  state: WalletProviderState
  dispatch: Dispatch<WalletProviderAction> | null
  fetchDefaultWallet: (walletProvider: Filecoin) => Promise<Wallet>
  connectLedger: () => Promise<Filecoin>
  setWalletError: (errorMessage: string) => void
  setLoginOption: (loginOption: LoginOption) => void
  resetLedgerState: () => void
  resetState: () => void
  walletList: (wallets: Wallet[]) => void
  switchWallet: (walletIdx: number) => void
  updateBalance: (bal: FilecoinNumber, walletIdx: number) => void
}

export const WalletProviderContext = createContext<WalletProviderContextType>({
  state: { ...initialState },
  dispatch: null,
  fetchDefaultWallet: null,
  connectLedger: null,
  setWalletError: null,
  setLoginOption: null,
  resetLedgerState: null,
  resetState: null,
  walletList: null,
  switchWallet: null,
  updateBalance: null
})

const WalletProviderWrapper = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <WalletProviderContext.Provider
      value={{
        state,
        dispatch,
        fetchDefaultWallet: useCallback(
          // a lot of times here, we instantiate the walletProvider AND fetch the default wallet back-to-back
          // which could lead to race conditions, since the wallet provider's state may not have updated in time
          // thats why we allow you to pass the walletProvider here, and fallback to the provider in state in other circumstances
          (walletProvider = state.walletProvider) =>
            fetchDefaultWallet(dispatch, state.loginOption, walletProvider),
          [dispatch, state.loginOption, state.walletProvider]
        ),
        setWalletError: useCallback(
          (errorMessage) => dispatch(setError(errorMessage)),
          [dispatch]
        ),
        setLoginOption: useCallback(
          (loginOption) => dispatch(setLoginOption(loginOption)),
          [dispatch]
        ),
        connectLedger: useCallback(
          () =>
            connectLedger(
              dispatch,
              state?.walletProvider?.wallet as LedgerProvider
            ),
          [dispatch, state?.walletProvider?.wallet]
        ),
        resetLedgerState: useCallback(
          () => dispatch(resetLedgerState()),
          [dispatch]
        ),
        resetState: useCallback(() => dispatch(resetState()), [dispatch]),
        walletList: useCallback(
          (wallets) => dispatch(walletList(wallets)),
          [dispatch]
        ),
        switchWallet: useCallback(
          (selectedWalletIdx) => dispatch(switchWallet(selectedWalletIdx)),
          [dispatch]
        ),
        updateBalance: useCallback(
          (balance, index) => dispatch(updateBalance(balance, index)),
          [dispatch]
        )
      }}
    >
      {children}
    </WalletProviderContext.Provider>
  )
}

WalletProviderWrapper.propTypes = {
  children: PropTypes.node.isRequired
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
