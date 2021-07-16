import TransportWebHID from '@ledgerhq/hw-transport-webhid'

let transport = null

const createTransport = async () => {
  const isSupported = await TransportWebHID.isSupported()
  if (!isSupported) throw new Error('TRANSPORT NOT SUPPORTED BY DEVICE')
  if (transport) await transport.close()
  transport = await TransportWebHID.create()

  return transport
}

export default createTransport
