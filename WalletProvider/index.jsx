import { createContext, useContext, useReducer, useCallback } from 'react'
import PropTypes from 'prop-types'

import reducer, {
  initialState,
  setLoginOption,
  setError,
  resetLedgerState,
  resetState,
  walletList,
  switchWallet
} from './state'
import fetchDefaultWallet from './fetchDefaultWallet'
import connectLedger from './connectLedger'
import { useWasm } from '../lib/WasmLoader'

export const WalletProviderContext = createContext({})

const WalletProviderWrapper = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { walletSubproviders } = useWasm()
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
            fetchDefaultWallet(
              dispatch,
              state.walletType,
              walletProvider,
              walletSubproviders
            ),
          [dispatch, state.walletType, state.walletProvider, walletSubproviders]
        ),
        setWalletError: (errorMessage) => dispatch(setError(errorMessage)),
        setLoginOption: (loginOption) => dispatch(setLoginOption(loginOption)),
        connectLedger: useCallback(
          () =>
            connectLedger(
              dispatch,
              walletSubproviders.LedgerProvider,
              state?.walletProvider?.wallet
            ),
          [
            dispatch,
            walletSubproviders.LedgerProvider,
            state?.walletProvider?.wallet
          ]
        ),
        resetLedgerState: () => dispatch(resetLedgerState()),
        resetState: useCallback(() => dispatch(resetState()), [dispatch]),
        walletList: (wallets, selectedWalletIdx) =>
          dispatch(walletList(wallets, selectedWalletIdx)),
        switchWallet: (selectedWalletIdx) =>
          dispatch(switchWallet(selectedWalletIdx)),

        walletSubproviders
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
