import TransportWebHID from '@ledgerhq/hw-transport-webhid'

let transport = null

const createTransport = async (): Promise<TransportWebHID> => {
  const isSupported = await TransportWebHID.isSupported()
  if (!isSupported) throw new Error('TRANSPORT NOT SUPPORTED BY DEVICE')
  try {
    if (transport) await transport.close()
  } catch {
    // if there are errs with closing the transport,
    // the err handler will tell the user to replug the device
  }
  transport = await TransportWebHID.create()
  return transport
}

export default createTransport
