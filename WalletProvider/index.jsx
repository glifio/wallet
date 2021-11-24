import { createContext, useContext, useReducer, useCallback } from 'react'
import PropTypes from 'prop-types'

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

export const WalletProviderContext = createContext({})

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
            fetchDefaultWallet(dispatch, state.walletType, walletProvider),
          [dispatch, state.walletType, state.walletProvider]
        ),
        setWalletError: (errorMessage) => dispatch(setError(errorMessage)),
        setLoginOption: (loginOption) => dispatch(setLoginOption(loginOption)),
        connectLedger: useCallback(
          () => connectLedger(dispatch, state?.walletProvider?.wallet),
          [dispatch, state?.walletProvider?.wallet]
        ),
        resetLedgerState: () => dispatch(resetLedgerState()),
        resetState: useCallback(() => dispatch(resetState()), [dispatch]),
        walletList: (wallets, selectedWalletIdx) =>
          dispatch(walletList(wallets, selectedWalletIdx)),
        switchWallet: (selectedWalletIdx) =>
          dispatch(switchWallet(selectedWalletIdx)),
        updateBalance: (balance, index) =>
          dispatch(updateBalance(balance, index))
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
