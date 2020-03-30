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

export const WalletProviderContext = createContext({})

const WalletProviderWrapper = ({ network, children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <WalletProviderContext.Provider
      value={{
        state,
        dispatch,
        fetchDefaultWallet: useCallback(
          walletProvider =>
            fetchDefaultWallet(
              dispatch,
              network,
              state.walletType,
              walletProvider
            ),
          [dispatch, network, state.walletType]
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
        resetLedgerState: () => dispatch(resetLedgerState()),
        resetState: useCallback(() => dispatch(resetState()), [dispatch])
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
