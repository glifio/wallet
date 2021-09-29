import Filecoin from '@glif/filecoin-wallet-provider'
import { Dispatch } from 'redux'
import {
  checkLedgerConfiguration,
  LedgerSubProvider,
  setLedgerProvider
} from '../utils/ledger/setLedgerProvider'
import { clearError, resetLedgerState } from './state'
import { WalletProviderAction } from './types'

const connectWithLedger = async (
  dispatch: Dispatch<WalletProviderAction>,
  LedgerProvider: (_: any) => LedgerSubProvider
) => {
  dispatch(clearError())
  dispatch(resetLedgerState())
  const provider = await setLedgerProvider(dispatch, LedgerProvider)
  if (!provider) return null
  const configured = await checkLedgerConfiguration(
    dispatch,
    provider as Filecoin & { wallet: LedgerSubProvider }
  )
  if (!configured) return null
  return provider
}

export default connectWithLedger
