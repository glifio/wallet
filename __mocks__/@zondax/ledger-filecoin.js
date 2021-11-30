import {
  LEDGER_VERSION_MAJOR,
  LEDGER_VERSION_MINOR,
  LEDGER_VERSION_PATCH
} from '../../constants'

const errorFreeReturn = {
  error_message: 'no errors',
  device_locked: false,
  major: LEDGER_VERSION_MAJOR,
  minor: LEDGER_VERSION_MINOR,
  patch: LEDGER_VERSION_PATCH
}

//eslint-disable-next-line no-unused-vars
export const mockSign = jest.fn().mockImplementation(async (path, msg) => {
  return Promise.resolve({
    ...errorFreeReturn,
    signature_compact: Buffer.from('fake signature')
  })
})

export const mockGetAddressAndPubKey = jest
  .fn()
  .mockImplementation(async (path) => {
    // here we just randomize addresses based on the last index in the path
    // just for returning different addresses
    return Promise.resolve({
      ...errorFreeReturn,
      addrString: `t137sjdbgunloi7couiy${
        path.split('/')[5]
      }l5nc7pd6k2jmq32vizpy`
    })
  })

export const mockGetVersion = jest
  .fn()
  .mockImplementation(
    () =>
      new Promise((resolve) => setTimeout(() => resolve(errorFreeReturn), 500))
  )

class Filecoin {
  sign = (msg, path) => mockSign(path, msg)

  getAddressAndPubKey = (path) => mockGetAddressAndPubKey(path)

  getVersion = () => mockGetVersion()
}

export default Filecoin
