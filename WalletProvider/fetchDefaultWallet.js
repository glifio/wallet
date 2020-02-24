import { SINGLE_KEY, LEDGER } from '../constants'
import {
  checkLedgerConfiguration,
  setLedgerProvider
} from '../utils/ledger/setLedgerProvider'
import { clearError, resetLedgerState } from './state'

const fetchDefaultWallet = async (
  dispatch,
  network = 't',
  provider,
  attempted = false
) => {
  dispatch(clearError())
  if (provider.wallet.type === LEDGER) {
    let configured
    try {
      configured = await checkLedgerConfiguration(dispatch, provider)
    } catch (err) {
      // if we cant establisha a connection with the device the first time, we need to restart the provider
      if (
        err.message &&
        err.message.includes('DisconnectedDeviceDuringOperation') &&
        !attempted
      ) {
        dispatch(resetLedgerState())
        const providerWithRefreshedTransport = await setLedgerProvider(
          dispatch,
          network
        )
        // try again with renewed transport
        return fetchDefaultWallet(
          dispatch,
          network,
          providerWithRefreshedTransport,
          true
        )
      }

      // forward uncaught errors
      throw new Error(err)
    }
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
