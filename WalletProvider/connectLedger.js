import {
  checkLedgerConfiguration,
  setLedgerProvider
} from '../utils/ledger/setLedgerProvider'
import { clearError, resetLedgerState } from './state'

const connectWithLedger = async (
  dispatch,
  network = 't',
  provider,
  attempted = false
) => {
  dispatch(clearError())
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
      return connectWithLedger(
        dispatch,
        network,
        providerWithRefreshedTransport,
        true
      )
    }

    // forward uncaught errors
    throw new Error(err)
  }
  return configured ? provider : null
}

export default connectWithLedger
