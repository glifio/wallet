import Filecoin from '@glif/filecoin-wallet-provider'
import { Dispatch } from 'redux'
import {
  checkLedgerConfiguration,
  setLedgerProvider
} from '../utils/ledger/setLedgerProvider'
import { clearError, resetLedgerState } from './state'
import { WalletProviderAction, LedgerSubProvider } from './types'

const connectWithLedger = async (
  dispatch: Dispatch<WalletProviderAction>,
  LedgerProvider: (_: any) => LedgerSubProvider,
  // if one already exists... use it
  ledgerSubProvider?: LedgerSubProvider
) => {
  dispatch(clearError())
  dispatch(resetLedgerState())
  const provider = await setLedgerProvider(
    dispatch,
    LedgerProvider,
    ledgerSubProvider
  )
  if (!provider) return null
  const configured = await checkLedgerConfiguration(
    dispatch,
    provider as Filecoin & { wallet: LedgerSubProvider }
  )
  if (!configured) return null
  return provider
}

export default connectWithLedger
