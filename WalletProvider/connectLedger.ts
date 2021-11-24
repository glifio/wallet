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
) => {
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
    console.log('err', err)
    if (err instanceof Error) {
      if (err instanceof walletProviderErrors.LedgerFilecoinAppNotOpenError) {
        console.log('FILECOIN APP NOT OPEN')
        dispatch({ type: 'LEDGER_FILECOIN_APP_NOT_OPEN' })
      } else if (err instanceof walletProviderErrors.LedgerDeviceBusy) {
        console.log('LEDGER DEVICE BUSY')
        dispatch({ type: 'LEDGER_BUSY' })
      } else if (err instanceof walletProviderErrors.LedgerNotFoundError) {
        console.log('LEDGER NOT FOUND')
        dispatch({ type: 'LEDGER_NOT_FOUND' })
      } else if (
        err instanceof walletProviderErrors.LedgerLostConnectionError
      ) {
        console.log('LEDGER LOST CONNECTION')
        dispatch({ type: 'LEDGER_LOCKED' })
      } else if (
        err instanceof walletProviderErrors.TransportNotSupportedError
      ) {
        console.log('TRANSPORT NOT SUPPORTED')
        dispatch({ type: 'TRANSPORT_UNSUPPORTED' })
      } else if (err instanceof walletProviderErrors.LedgerReplugError) {
        console.log('LEDGER REPLUG')
        dispatch({ type: 'LEDGER_REPLUG' })
      } else if (err instanceof walletProviderErrors.LedgerDisconnectedError) {
        console.log('LEDGER DISCONNECTED')
        dispatch({ type: 'LEDGER_LOCKED' })
      } else if (err instanceof walletProviderErrors.LedgerInUseByAnotherApp) {
        console.log('LEDGER IN USE')
        dispatch({ type: 'LEDGER_USED_BY_ANOTHER_APP' })
      } else if (err instanceof walletProviderErrors.LedgerDeviceLockedError) {
        console.log('LEDGER LOCKED')
        dispatch({ type: 'LEDGER_LOCKED' })
      } else if (
        err instanceof walletProviderErrors.LedgerFilecoinAppBadVersionError
      ) {
        console.log('BAD VERSION')
        dispatch({ type: 'LEDGER_BAD_VERSION' })
      } else {
        console.log('UNCAUGHT', err, err.message)
        dispatch({ type: 'LEDGER_REPLUG' })
      }
    } else {
      console.log('UNCAUGHT ELSE', err, err.message)
      dispatch({ type: 'LEDGER_REPLUG' })
    }
  }

  return new Filecoin(subProvider, {
    apiAddress: process.env.LOTUS_NODE_JSONRPC
  })
}

export default connectWithLedger
