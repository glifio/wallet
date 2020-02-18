import Filecoin, {
  LedgerProvider
} from '@openworklabs/filecoin-wallet-provider'

import {
  LEDGER_USER_INITIATED_IMPORT,
  LEDGER_CONNECTED,
  LEDGER_NOT_FOUND,
  LEDGER_REPLUG,
  LEDGER_LOCKED,
  LEDGER_UNLOCKED,
  LEDGER_ESTABLISHING_CONNECTION_W_FILECOIN_APP,
  LEDGER_FILECOIN_APP_NOT_OPEN,
  LEDGER_FILECOIN_APP_OPEN
} from './ledgerStateManagement'
import { createWalletProvider } from '../../WalletProvider/state'
import createTransport from './createTransport'

export const setLedgerProvider = async (dispatch, network) => {
  dispatch({ type: LEDGER_USER_INITIATED_IMPORT })
  try {
    const transport = await createTransport()
    dispatch({ type: LEDGER_CONNECTED })
    dispatch(
      createWalletProvider(
        new Filecoin(new LedgerProvider(transport), {
          apiAddress: 'https://proxy.openworklabs.com/rpc/v0',
          network
        })
      )
    )
    return true
  } catch (err) {
    if (
      err.message &&
      !err.message.toLowerCase().includes('device is already open')
    ) {
      dispatch({ type: LEDGER_NOT_FOUND })
    } else if (
      err.message &&
      err.message.toLowerCase().includes('transporterror: invalid channel')
    ) {
      dispatch({ type: LEDGER_REPLUG })
    }
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
    dispatch({ type: LEDGER_FILECOIN_APP_NOT_OPEN })

    if (
      err.message &&
      err.message.toLowerCase().includes('transporterror: invalid channel')
    ) {
      dispatch({ type: LEDGER_REPLUG })
    }
    return false
  }
}
