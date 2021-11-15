import { Network as CoinType } from '@glif/filecoin-address'
import FilecoinApp from '@zondax/ledger-filecoin'
import Transport from '@ledgerhq/hw-transport'
import { mapSeries } from 'bluebird'
import { LEDGER } from '../../constants'
import {
  LotusMessage,
  Message,
  SignedLotusMessage
} from '@glif/filecoin-message'
import createPath, { coinTypeCode } from '../../utils/createPath'
import { LedgerSubProvider } from '../types'

const handleErrors = (response) => {
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

const throwIfBusy = (busy) => {
  if (busy)
    throw new Error(
      'Ledger is busy, please check device, or quit Filecoin app and unplug/replug your device.'
    )
}

const createLedgerProvider = (rustModule) => {
  return (_transport: Transport): LedgerSubProvider => {
    let transport: Transport = _transport
    let ledgerBusy = false
    let accountToPath = {} as Record<string, string>
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
              const response = handleErrors(
                await new FilecoinApp(transport).getVersion()
              )
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

      getAccounts: async (nStart = 0, nEnd = 5, coinType = CoinType.MAIN) => {
        throwIfBusy(ledgerBusy)
        ledgerBusy = true
        const paths = []
        for (let i = nStart; i < nEnd; i += 1) {
          paths.push(createPath(coinTypeCode(coinType), i))
        }
        const addresses = await mapSeries(paths, async (path) => {
          const { addrString } = handleErrors(
            await new FilecoinApp(transport).getAddressAndPubKey(path)
          )
          accountToPath[addrString] = path
          console.log(accountToPath)
          return addrString
        })
        ledgerBusy = false
        return addresses
      },

      sign: async (
        from: string,
        message: LotusMessage
      ): Promise<SignedLotusMessage> => {
        throwIfBusy(ledgerBusy)
        ledgerBusy = true
        console.log(accountToPath, from)
        const path = accountToPath[from]
        const msg = Message.fromLotusType(message)
        const serializedMessage = rustModule.transactionSerialize(
          msg.toZondaxType()
        )
        const res = handleErrors(
          await new FilecoinApp(transport).sign(
            path,
            Buffer.from(serializedMessage, 'hex')
          )
        )
        ledgerBusy = false
        const signedMessage: SignedLotusMessage = {
          Message: message,
          Signature: {
            Data: res.signature_compact.toString('base64'),
            Type: 1
          }
        }
        return signedMessage
      },

      showAddressAndPubKey: async (path: string): Promise<string | Error> => {
        throwIfBusy(ledgerBusy)
        ledgerBusy = true
        const res = handleErrors(
          await new FilecoinApp(transport).showAddressAndPubKey(path)
        )
        ledgerBusy = false
        return res
      },

      resetTransport: async (_transport: Transport): Promise<void> => {
        transport = _transport
      }
    }
  }
}

export default createLedgerProvider
