import cbor from 'cbor'
import address from '@glif/filecoin-address'

const bytesToAddress = (payload, test = false) => {
  const addr = new address.Address(payload)
  return address.encode(test ? 't' : 'f', addr)
}

const getAddrFromReceipt = (base64Return) => {
  if (!base64Return) return ''
  const [, cborBytes] = cbor.decode(Buffer.from(base64Return, 'base64'))
  return bytesToAddress(cborBytes)
}

export default getAddrFromReceipt
