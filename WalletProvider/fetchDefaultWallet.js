import { SINGLE_KEY, LEDGER } from '../constants'
import {
  checkLedgerConfiguration,
  setLedgerProvider
} from '../utils/ledger/setLedgerProvider'
import { clearError, resetLedgerState } from './state'
import createPath from '../utils/createPath'

const fetchDefaultWallet = async (
  dispatch,
  network = 't',
  walletType,
  walletProvider
) => {
  dispatch(clearError())
  let provider = walletProvider
  if (walletType === LEDGER) {
    dispatch(resetLedgerState())
    provider = await setLedgerProvider(dispatch, network)
    if (!provider) return null
    const configured = await checkLedgerConfiguration(dispatch, provider)
    if (!configured) return null
  }
  const [defaultAddress] = await provider.wallet.getAccounts(0, 1, network)
  const balance = await provider.getBalance(defaultAddress)
  const networkCode = network === 'f' ? 461 : 1

  let path = createPath(networkCode, 0)
  if (provider.wallet.type === SINGLE_KEY) path = ''
  return {
    balance,
    address: defaultAddress,
    path
  }
}

export default fetchDefaultWallet
