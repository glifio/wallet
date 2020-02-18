import { createContext, useContext, useReducer } from 'react'
import PropTypes from 'prop-types'

import reducer, { initialState, setWalletType } from './state'
import setLedgerProvider from './setLedgerProvider'

const WalletProviderContext = createContext({})

const WalletProviderWrapper = ({ network, children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <WalletProviderContext.Provider
      value={{
        state,
        setWalletType: walletType => dispatch(setWalletType(walletType)),
        setLedgerProvider: () => setLedgerProvider(dispatch, network)
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
  const { state, setWalletType, setLedgerProvider } = useContext(
    WalletProviderContext
  )
  return {
    ...state,
    setLedgerProvider,
    setWalletType
  }
}

export default WalletProviderWrapper
