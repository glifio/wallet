import { createContext, useContext, useReducer, useCallback } from 'react'
import PropTypes from 'prop-types'

import reducer, {
  initialState,
  setWalletType,
  setError,
  resetLedgerState
} from './state'
import { setLedgerProvider } from '../utils/ledger/setLedgerProvider'
import fetchDefaultWallet from './fetchDefaultWallet'
import connectLedger from './connectLedger'

const WalletProviderContext = createContext({})

const WalletProviderWrapper = ({ network, children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <WalletProviderContext.Provider
      value={{
        state,
        fetchDefaultWallet: useCallback(
          () => fetchDefaultWallet(dispatch, network, state.walletType),
          [dispatch, state.walletType]
        ),
        setWalletError: errorMessage => dispatch(setError(errorMessage)),
        setWalletType: walletType => dispatch(setWalletType(walletType)),
        setLedgerProvider: useCallback(
          () => setLedgerProvider(dispatch, network),
          [dispatch, network]
        ),
        connectLedger: useCallback(() => connectLedger(dispatch, network), [
          dispatch,
          network
        ]),
        resetLedgerState: () => dispatch(resetLedgerState())
      }}
    >
      {children}
    </WalletProviderContext.Provider>
  )
}

WalletProviderWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  network: PropTypes.oneOf(['t', 'f']).isRequired
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
