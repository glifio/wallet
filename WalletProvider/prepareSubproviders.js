import FilecoinApp from '@zondax/ledger-filecoin'
import { mapSeries } from 'bluebird'
import createPath from '../utils/createPath'
import toLowerCaseMsgFields from '../utils/toLowerCaseMsgFields'
import { HD_WALLET, SINGLE_KEY } from '../constants'

const createHDWalletProvider = rustModule => mnemonic => ({
  getAccounts: async (nStart = 0, nEnd = 5, network = 't') => {
    const accounts = []
    for (let i = nStart; i < nEnd; i += 1) {
      const networkCode = network === 't' ? 1 : 461
      accounts.push(
        rustModule.key_derive(mnemonic, createPath(networkCode, i)).address
      )
    }
    return accounts
  },
  sign: async (path, filecoinMessage) => {
    const formattedMessage = toLowerCaseMsgFields(filecoinMessage.encode())
    const { private_hexstring } = rustModule.key_derive(mnemonic, path)
    const { signature } = rustModule.transaction_sign(
      formattedMessage,
      private_hexstring
    )
    return signature.data
  },
  type: HD_WALLET
})

const createSingleKeyProvider = rustModule => privateKey => ({
  getAccounts: async (_, __, network = 't') => {
    return [rustModule.key_recover(privateKey, network === 't').address]
  },
  sign: async (_, filecoinMessage) => {
    const formattedMessage = toLowerCaseMsgFields(filecoinMessage.encode())
    const { private_hexstring } = rustModule.key_recover(privateKey)
    const { signature } = rustModule.transaction_sign(
      formattedMessage,
      private_hexstring
    )
    return signature.data
  },
  type: SINGLE_KEY
})

const createLedgerProvider = rustModule => {
  return class LedgerProvider extends FilecoinApp {
    constructor(transport) {
      super(transport)
      this.type = 'LEDGER'
      this.ledgerBusy = false
    }

    handleErrors = response => {
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
          .includes('transporterror: invalild channel')
      ) {
        throw new Error(
          'Lost connection with Ledger. Please unplug and replug device.'
        )
      }
      throw new Error(response.error_message)
    }

    throwIfBusy = () => {
      if (this.ledgerBusy)
        throw new Error(
          'Ledger is busy, please check device or unplug and replug it in.'
        )
    }

    /* getVersion call rejects if it takes too long to respond,
    meaning the Ledger device is locked */
    getVersion = () => {
      this.throwIfBusy()
      this.ledgerBusy = true
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          this.ledgerBusy = false
          return reject(new Error('Ledger device locked or busy'))
        }, 3000)

        setTimeout(async () => {
          try {
            const response = this.handleErrors(await super.getVersion())
            return resolve(response)
          } catch (err) {
            return reject(err)
          } finally {
            this.ledgerBusy = false
          }
        })
      })
    }

    getAccounts = async (nStart = 0, nEnd = 5, network = 't') => {
      this.throwIfBusy()
      this.ledgerBusy = true
      const networkCode = network === 'f' ? 461 : 1
      const paths = []
      for (let i = nStart; i < nEnd; i += 1) {
        paths.push(`m/44'/${networkCode}'/0/0/${i}`)
      }
      const addresses = await mapSeries(paths, async path => {
        const { addrString } = this.handleErrors(
          await super.getAddressAndPubKey(path)
        )
        return addrString
      })
      this.ledgerBusy = false
      return addresses
    }

    sign = async (path, filecoinMessage) => {
      this.throwIfBusy()
      this.ledgerBusy = true
      const { signature_compact } = this.handleErrors(
        await super.sign(path, await filecoinMessage.serialize())
      )
      return signature_compact.toString('base64')
    }

    showAddressAndPubKey = async path => {
      this.throwIfBusy()
      this.ledgerBusy = true
      const res = this.handleErrors(await super.showAddressAndPubKey(path))
      this.ledgerBusy = false
      return res
    }
  }
}

export default rustModule => ({
  HDWalletProvider: createHDWalletProvider(rustModule),
  SingleKeyProvider: createSingleKeyProvider(rustModule),
  LedgerProvider: createLedgerProvider(rustModule)
})
