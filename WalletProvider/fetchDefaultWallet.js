import { SINGLE_KEY, LEDGER } from '../constants'
import {
  checkLedgerConfiguration,
  setLedgerProvider
} from '../utils/ledger/setLedgerProvider'
import { clearError, resetLedgerState } from './state'
import createPath from '../utils/createPath'
import reportError from '../utils/reportError'

// a helper function for getting the default wallet associated with the wallet provider
const fetchDefaultWallet = async (
  dispatch,
  network = 't',
  walletType,
  walletProvider,
  walletSubProviders
) => {
  dispatch(clearError())
  let provider = walletProvider
  if (walletType === LEDGER) {
    dispatch(resetLedgerState())
    provider = await setLedgerProvider(
      dispatch,
      // this arg gets passed in because we need the variables in its scope
      // see prepareSubproviders to look at the closed over variables
      walletSubProviders.LedgerProvider
    )
    if (!provider) return null
    const configured = await checkLedgerConfiguration(dispatch, provider)
    if (!configured) return null
  }
  try {
    const [defaultAddress] = await provider.wallet.getAccounts(network, 0, 1)
    const balance = await provider.getBalance(defaultAddress)
    const networkCode = network === 'f' ? 461 : 1

    let path = createPath(networkCode, 0)
    if (provider.wallet.type === SINGLE_KEY) path = SINGLE_KEY
    return {
      balance,
      address: defaultAddress,
      path
    }
  } catch (err) {
    reportError(7, true, err.message, err.stack)
  }
}

export default fetchDefaultWallet
