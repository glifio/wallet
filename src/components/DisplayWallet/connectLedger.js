import {
  establishConnectionWithDevice,
  establishConnectionWithFilecoinApp
} from '../ConnectWallet/connectLedger'
import { RESET_STATE } from '../ConnectWallet/ledgerStateManagement'

export default async (dispatchLocal, dispatch) => {
  dispatchLocal({ type: RESET_STATE })
  const transport = await establishConnectionWithDevice(dispatchLocal, dispatch)
  if (!transport) throw new Error('Error establishing connection with Ledger')

  const provider = establishConnectionWithFilecoinApp(
    transport,
    dispatchLocal,
    dispatch
  )
  if (!provider) throw new Error('Could not connect to Filecoin device')
  return provider
}
