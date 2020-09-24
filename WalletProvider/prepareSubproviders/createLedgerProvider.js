import FilecoinApp from '@zondax/ledger-filecoin'
import { mapSeries } from 'bluebird'
import {
  LEDGER,
  TESTNET,
  MAINNET,
  MAINNET_PATH_CODE,
  TESTNET_PATH_CODE
} from '../../constants'
import createPath from '../../utils/createPath'

const handleErrors = response => {
  if (
    response.error_message &&
    response.error_message.toLowerCase().includes('no errors')
  ) {
    return response
  }
  if (
    response.error_message &&
    response.error_message
      .toLowerCase()
      .includes('transporterror: invalid channel')
  ) {
    throw new Error(
      'Lost connection with Ledger. Please quit the Filecoin app, and unplug/replug device.'
    )
  }
  throw new Error(response.error_message)
}

const throwIfBusy = busy => {
  if (busy)
    throw new Error(
      'Ledger is busy, please check device, or quit Filecoin app and unplug/replug your device.'
    )
}

export default rustModule => {
  return transport => {
    let ledgerBusy = false
    const ledgerApp = new FilecoinApp(transport)
    return {
      type: LEDGER,

      // /* getVersion call rejects if it takes too long to respond,
      // meaning the Ledger device is locked */
      getVersion: () => {
        throwIfBusy(ledgerBusy)
        ledgerBusy = true
        return new Promise((resolve, reject) => {
          let finished = false
          setTimeout(() => {
            if (!finished) {
              finished = true
              ledgerBusy = false
              return reject(new Error('Ledger device locked or busy'))
            }
          }, 3000)

          setTimeout(async () => {
            try {
              const response = handleErrors(await ledgerApp.getVersion())
              return resolve(response)
            } catch (err) {
              return reject(err)
            } finally {
              if (!finished) {
                finished = true
                ledgerBusy = false
              }
            }
          })
        })
      },

      getAccounts: async (network = TESTNET, nStart = 0, nEnd = 5) => {
        throwIfBusy(ledgerBusy)
        ledgerBusy = true
        const networkCode =
          network === MAINNET ? MAINNET_PATH_CODE : TESTNET_PATH_CODE
        const paths = []
        for (let i = nStart; i < nEnd; i += 1) {
          paths.push(createPath(networkCode, i))
        }
        const addresses = await mapSeries(paths, async path => {
          const { addrString } = handleErrors(
            await ledgerApp.getAddressAndPubKey(path)
          )
          return addrString
        })
        ledgerBusy = false
        return addresses
      },

      sign: async (filecoinMessage, path) => {
        throwIfBusy(ledgerBusy)
        ledgerBusy = true
        const serializedMessage = rustModule.transactionSerialize(
          filecoinMessage
        )
        const res = handleErrors(
          await ledgerApp.sign(path, Buffer.from(serializedMessage, 'hex'))
        )
        ledgerBusy = false
        return res.signature_compact.toString('base64')
      },

      showAddressAndPubKey: async path => {
        throwIfBusy(ledgerBusy)
        ledgerBusy = true
        const res = handleErrors(await ledgerApp.showAddressAndPubKey(path))
        ledgerBusy = false
        return res
      }
    }
  }
}
