import { createContext, useContext, useReducer, useCallback } from 'react'
import PropTypes from 'prop-types'

import reducer, {
  initialState,
  setWalletType,
  setError,
  resetLedgerState,
  resetState
} from './state'
import { setLedgerProvider } from '../utils/ledger/setLedgerProvider'
import fetchDefaultWallet from './fetchDefaultWallet'
import connectLedger from './connectLedger'
import { useWasm } from '../lib/WasmLoader'
import { TESTNET, MAINNET } from '../constants'

export const WalletProviderContext = createContext({})

const WalletProviderWrapper = ({ network, children }) => {
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
              network,
              state.walletType,
              walletProvider,
              walletSubproviders
            ),
          [
            dispatch,
            network,
            state.walletType,
            state.walletProvider,
            walletSubproviders
          ]
        ),
        setWalletError: errorMessage => dispatch(setError(errorMessage)),
        setWalletType: walletType => dispatch(setWalletType(walletType)),
        setLedgerProvider: useCallback(
          () => setLedgerProvider(dispatch, walletSubproviders.LedgerProvider),
          [dispatch, walletSubproviders.LedgerProvider]
        ),
        connectLedger: useCallback(
          () => connectLedger(dispatch, walletSubproviders.LedgerProvider),
          [dispatch, walletSubproviders.LedgerProvider]
        ),
        resetLedgerState: () => dispatch(resetLedgerState()),
        resetState: useCallback(() => dispatch(resetState()), [dispatch]),
        walletSubproviders
      }}
    >
      {children}
    </WalletProviderContext.Provider>
  )
}

WalletProviderWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  network: PropTypes.oneOf([TESTNET, MAINNET]).isRequired
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
