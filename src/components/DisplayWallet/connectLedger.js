import {
  establishConnectionWithDevice,
  establishConnectionWithFilecoinApp
} from '../ConnectWallet/connectLedger'

export default async (dispatchLocal, dispatch) => {
  const transport = await establishConnectionWithDevice(dispatchLocal, dispatch)
  if (!transport) return false

  return establishConnectionWithFilecoinApp(transport, dispatchLocal, dispatch)
}
