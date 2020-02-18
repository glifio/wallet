import { createContext, useContext, useReducer, useCallback } from 'react'
import PropTypes from 'prop-types'

import reducer, { initialState, setWalletType } from './state'
import { setLedgerProvider } from '../utils/ledger/setLedgerProvider'
import fetchDefaultWallet from './fetchDefaultWallet'

const WalletProviderContext = createContext({})

const WalletProviderWrapper = ({ network, children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <WalletProviderContext.Provider
      value={{
        state,
        fetchDefaultWallet: useCallback(
          () => fetchDefaultWallet(dispatch, network, state.walletProvider),
          [dispatch, state.walletProvider]
        ),
        setWalletType: walletType => dispatch(setWalletType(walletType)),
        setLedgerProvider: useCallback(
          () => setLedgerProvider(dispatch, network),
          [dispatch, network]
        )
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
