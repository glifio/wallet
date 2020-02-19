import { SINGLE_KEY, LEDGER } from '../constants'
import { checkLedgerConfiguration } from '../utils/ledger/setLedgerProvider'

export default async (dispatch, network = 't', provider) => {
  if (provider.wallet.type === LEDGER) {
    const configured = await checkLedgerConfiguration(dispatch, provider)
    if (!configured) return []
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
