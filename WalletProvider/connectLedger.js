import {
  checkLedgerConfiguration,
  setLedgerProvider
} from '../utils/ledger/setLedgerProvider'
import { clearError, resetLedgerState } from './state'

const connectWithLedger = async (dispatch, network = 't') => {
  dispatch(clearError())
  dispatch(resetLedgerState())
  const provider = await setLedgerProvider(dispatch, network)
  if (!provider) return null
  const configured = await checkLedgerConfiguration(dispatch, provider)
  if (!configured) return null
  return provider
}

export default connectWithLedger
