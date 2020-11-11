import TransportWebUSB from '@ledgerhq/hw-transport-webusb'

const createTransport = () => TransportWebUSB.create()

export default createTransport
