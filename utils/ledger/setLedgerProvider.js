import Filecoin from '@openworklabs/filecoin-wallet-provider'

import {
  LEDGER_USER_INITIATED_IMPORT,
  LEDGER_CONNECTED,
  LEDGER_NOT_FOUND,
  LEDGER_REPLUG,
  LEDGER_LOCKED,
  LEDGER_UNLOCKED,
  LEDGER_ESTABLISHING_CONNECTION_W_FILECOIN_APP,
  LEDGER_FILECOIN_APP_NOT_OPEN,
  LEDGER_FILECOIN_APP_OPEN,
  LEDGER_BUSY,
  LEDGER_USED_BY_ANOTHER_APP
} from './ledgerStateManagement'
import { createWalletProvider } from '../../WalletProvider/state'
import createTransport from './createTransport'
import reportError from '../reportError'

export const setLedgerProvider = async (dispatch, LedgerProvider) => {
  dispatch({ type: LEDGER_USER_INITIATED_IMPORT })
  try {
    const transport = await createTransport()
    const provider = new Filecoin(LedgerProvider(transport), {
      apiAddress: process.env.LOTUS_NODE_JSONRPC
    })
    dispatch({ type: LEDGER_CONNECTED })
    dispatch(createWalletProvider(provider))
    return provider
  } catch (err) {
    if (
      err.message &&
      err.message.toLowerCase().includes('unable to claim interface.')
    ) {
      dispatch({ type: LEDGER_USED_BY_ANOTHER_APP })
    } else if (
      err.message &&
      err.message.toLowerCase().includes('transporterror: invalid channel')
    ) {
      dispatch({ type: LEDGER_REPLUG })
    } else if (
      err.message &&
      err.message.toLowerCase().includes('no device selected')
    ) {
      dispatch({ type: LEDGER_NOT_FOUND })
    }
    reportError(
      5,
      false,
      `Unhandled error in setLedgerProvider: ${err.message}`,
      err.stack
    )
    return false
  }
}

export const checkLedgerConfiguration = async (dispatch, walletProvider) => {
  dispatch({ type: LEDGER_ESTABLISHING_CONNECTION_W_FILECOIN_APP })
  try {
    const response = await walletProvider.wallet.getVersion()

    if (response.device_locked) {
      dispatch({ type: LEDGER_LOCKED })
      return false
    }
    dispatch({ type: LEDGER_UNLOCKED })
    dispatch({ type: LEDGER_FILECOIN_APP_OPEN })
    return true
  } catch (err) {
    if (
      err.message &&
      err.message.toLowerCase().includes('transporterror: invalid channel')
    ) {
      dispatch({ type: LEDGER_REPLUG })
    } else if (
      err.message &&
      err.message.toLowerCase().includes('ledger device locked or busy')
    ) {
      dispatch({ type: LEDGER_BUSY })
    } else if (
      err.message &&
      err.message.toLowerCase().includes('app does not seem to be open')
    ) {
      dispatch({ type: LEDGER_FILECOIN_APP_NOT_OPEN })
    } else {
      reportError(6, false, err.message, err.stack)
    }
    return false
  }
}
