import TransportWebHID from '@ledgerhq/hw-transport-webhid'
import TransportWebUSB from '@ledgerhq/hw-transport-webusb'

export default () =>
  new Promise((resolve, reject) => {
    TransportWebHID.create()
      .then(resolve)
      .catch(err => {
        if (err.message.includes('navigator.hid is not supported')) {
          return TransportWebUSB.create()
        }
        reject(err)
      })
      .then(resolve)
      .catch(reject)
  })
