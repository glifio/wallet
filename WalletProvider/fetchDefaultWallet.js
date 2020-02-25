import { SINGLE_KEY, LEDGER } from '../constants'
import {
  checkLedgerConfiguration,
  setLedgerProvider
} from '../utils/ledger/setLedgerProvider'
import { clearError, resetLedgerState } from './state'

const fetchDefaultWallet = async (dispatch, network = 't', walletType) => {
  dispatch(clearError())
  let provider
  if (walletType === LEDGER) {
    dispatch(resetLedgerState())
    provider = await setLedgerProvider(dispatch, network)
    if (!provider) return null
    const configured = await checkLedgerConfiguration(dispatch, provider)
    if (!configured) return null
  }
  const [defaultAddress] = await provider.wallet.getAccounts(0, 1, network)
  const balance = await provider.getBalance(defaultAddress)
  const networkDerivationPath = network === 'f' ? 461 : 1
  return {
    balance,
    address: defaultAddress,
    path:
      provider.wallet.type === SINGLE_KEY
        ? []
        : [44, networkDerivationPath, 5, 0, 0]
  }
}

export default fetchDefaultWallet
