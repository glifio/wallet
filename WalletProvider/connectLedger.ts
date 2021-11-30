import { Dispatch } from 'react'
import Filecoin, {
  LedgerProvider,
  errors as walletProviderErrors
} from '@glif/filecoin-wallet-provider'
import { clearError, resetLedgerState } from './state'
import { WalletProviderAction } from './types'
import transportWrapperSingleton from './transportWrapperSingleton'
import {
  LEDGER_VERSION_MAJOR,
  LEDGER_VERSION_MINOR,
  LEDGER_VERSION_PATCH
} from '../constants'

const connectWithLedger = async (
  dispatch: Dispatch<WalletProviderAction>,
  // if one already exists... use it
  ledgerSubProvider?: LedgerProvider
): Promise<Filecoin & { wallet: LedgerProvider }> => {
  dispatch(clearError())
  dispatch(resetLedgerState())
  dispatch({ type: 'LEDGER_USER_INITIATED_IMPORT' })

  let subProvider: LedgerProvider
  try {
    await transportWrapperSingleton.connect()
    if (ledgerSubProvider) {
      ledgerSubProvider.resetTransport(transportWrapperSingleton.transport)
      subProvider = ledgerSubProvider
    } else {
      subProvider = new LedgerProvider({
        transport: transportWrapperSingleton.transport,
        minLedgerVersion: {
          major: LEDGER_VERSION_MAJOR,
          minor: LEDGER_VERSION_MINOR,
          patch: LEDGER_VERSION_PATCH
        }
      })
    }
    await subProvider.ready()
  } catch (err) {
    if (err instanceof Error) {
      if (err instanceof walletProviderErrors.LedgerFilecoinAppNotOpenError) {
        dispatch({ type: 'LEDGER_FILECOIN_APP_NOT_OPEN' })
      } else if (err instanceof walletProviderErrors.LedgerDeviceBusyError) {
        dispatch({ type: 'LEDGER_BUSY' })
      } else if (err instanceof walletProviderErrors.LedgerNotFoundError) {
        dispatch({ type: 'LEDGER_NOT_FOUND' })
      } else if (
        err instanceof walletProviderErrors.LedgerLostConnectionError
      ) {
        dispatch({ type: 'LEDGER_LOCKED' })
      } else if (
        err instanceof walletProviderErrors.TransportNotSupportedError
      ) {
        dispatch({ type: 'TRANSPORT_UNSUPPORTED' })
      } else if (err instanceof walletProviderErrors.LedgerReplugError) {
        dispatch({ type: 'LEDGER_REPLUG' })
      } else if (err instanceof walletProviderErrors.LedgerDisconnectedError) {
        dispatch({ type: 'LEDGER_LOCKED' })
      } else if (err instanceof walletProviderErrors.LedgerInUseByAnotherApp) {
        dispatch({ type: 'LEDGER_USED_BY_ANOTHER_APP' })
      } else if (err instanceof walletProviderErrors.LedgerDeviceLockedError) {
        dispatch({ type: 'LEDGER_LOCKED' })
      } else if (
        err instanceof walletProviderErrors.LedgerFilecoinAppBadVersionError
      ) {
        dispatch({ type: 'LEDGER_BAD_VERSION' })
      } else {
        dispatch({ type: 'LEDGER_REPLUG' })
      }
    } else {
      console.log('UNHANDLED', err.message)
      dispatch({ type: 'LEDGER_REPLUG' })
    }
  }

  return new Filecoin(subProvider, {
    apiAddress: process.env.LOTUS_NODE_JSONRPC
  }) as Filecoin & { wallet: LedgerProvider }
}

export default connectWithLedger
