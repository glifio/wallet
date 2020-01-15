import TransportWebHID from '@ledgerhq/hw-transport-webhid'
import TransportWebUSB from '@ledgerhq/hw-transport-webusb'

export default async () => {
  let transport

  try {
    transport = await TransportWebUSB.create()
    return transport
  } catch (_) {}
  try {
    transport = await TransportWebHID.create()
    return transport
  } catch (_) {}
  throw new Error('No successful transport established')
}
