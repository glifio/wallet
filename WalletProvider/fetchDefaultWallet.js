import { SINGLE_KEY, LEDGER, HD_WALLET } from '../constants'
import {
  checkLedgerConfiguration,
  setLedgerProvider
} from '../utils/ledger/setLedgerProvider'
import { clearError, resetLedgerState } from './state'

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
  const networkDerivationPath = network === 'f' ? 461 : 1

  let path
  if (provider.wallet.type === SINGLE_KEY) path = null
  if (provider.wallet.type === HD_WALLET)
    path = `m/44'/${networkDerivationPath}'/5/0/0`
  if (provider.wallet.type === LEDGER)
    path = [44, networkDerivationPath, 5, 0, 0]
  return {
    balance,
    address: defaultAddress,
    path
  }
}

export default fetchDefaultWallet
