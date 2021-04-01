import TransportWebUSB from '@ledgerhq/hw-transport-webusb'

const createTransport = async () => {
  const isSupported = await TransportWebUSB.isSupported()
  if (!isSupported) throw new Error('TRANSPORT NOT SUPPORTED BY DEVICE')
  return TransportWebUSB.create()
}

export default createTransport
