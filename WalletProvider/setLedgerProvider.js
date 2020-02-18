import Filecoin, {
  LedgerProvider
} from '@openworklabs/filecoin-wallet-provider'

import {
  LEDGER_USER_INITIATED_IMPORT,
  LEDGER_CONNECTED,
  LEDGER_NOT_FOUND,
  LEDGER_REPLUG
} from '../utils/ledger/ledgerStateManagement'
import { createWalletProvider } from './state'
import createTransport from '../utils/ledger/createTransport'

export default async (dispatch, network) => {
  dispatch({ type: LEDGER_USER_INITIATED_IMPORT })
  try {
    const transport = await createTransport()
    dispatch({ type: LEDGER_CONNECTED })
    dispatch(
      createWalletProvider(
        new Filecoin(new LedgerProvider(transport), {
          apiAddress: 'proxy.openworklabs.com/rpc/v0',
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
