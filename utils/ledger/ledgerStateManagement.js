import Filecoin, {
  LedgerProvider
} from '@openworklabs/filecoin-wallet-provider'
import PropTypes from 'prop-types'

import { error, walletList, clearError } from '../../store/actions'
import createTransport from './createTransport'

/* VALID ACTION TYPES */
export const LEDGER_USER_INITIATED_IMPORT = 'USER_INITIATED_IMPORT'
export const LEDGER_NOT_FOUND = 'LEDGER_NOT_FOUND'
export const LEDGER_RESET_STATE = 'RESET_STATE'
export const LEDGER_CONNECTED = 'LEDGER_CONNECTED'
export const LEDGER_ESTABLISHING_CONNECTION_W_FILECOIN_APP =
  'ESTABLISHING_CONNECTION_W_FILECOIN_APP'
export const LEDGER_FILECOIN_APP_NOT_OPEN = 'FILECOIN_APP_NOT_OPEN'
export const LEDGER_FILECOIN_APP_OPEN = 'FILECOIN_APP_OPEN'
export const LEDGER_LOCKED = 'LEDGER_LOCKED'
export const LEDGER_UNLOCKED = 'LEDGER_UNLOCKED'
export const LEDGER_REPLUG = 'LEDGER_REPLUG'

export const establishConnectionWithDevice = async (
  dispatchLocal,
  dispatchRdx
) => {
  dispatchLocal({ type: LEDGER_USER_INITIATED_IMPORT })
  try {
    const transport = await createTransport()
    dispatchLocal({ type: LEDGER_CONNECTED })
    return transport
  } catch (err) {
    if (
      err.message &&
      !err.message.toLowerCase().includes('device is already open')
    ) {
      dispatchLocal({ type: LEDGER_NOT_FOUND })
      // if we want to display banner instead:
      dispatchRdx(error(err))
    } else if (
      err.message &&
      err.message.toLowerCase().includes('transporterror: invalid channel')
    ) {
      dispatchRdx(error(new Error('Please unplug and replug your device.')))
    }
    return false
  }
}

export const establishConnectionWithFilecoinApp = async (
  transport,
  dispatchLocal,
  dispatchRdx
) => {
  dispatchLocal({ type: LEDGER_ESTABLISHING_CONNECTION_W_FILECOIN_APP })
  try {
    const provider = new Filecoin(new LedgerProvider(transport), {
      apiAddress: process.env.REACT_APP_LOTUS_API_ENDPOINT,
      token: process.env.REACT_APP_LOTUS_JWT
    })
    const response = await provider.wallet.getVersion()

    if (response.device_locked) {
      dispatchLocal({ type: LEDGER_LOCKED })
      dispatchRdx(
        error(
          new Error(
            'Ledger device locked or busy. Please try to unplug and replug device.'
          )
        )
      )
      return false
    }

    dispatchLocal({ type: LEDGER_UNLOCKED })
    dispatchLocal({ type: LEDGER_FILECOIN_APP_OPEN })
    // dispatchRdx(createWalletProvider(provider))

    return provider
  } catch (err) {
    dispatchLocal({ type: LEDGER_FILECOIN_APP_NOT_OPEN })

    if (
      err.message &&
      err.message.toLowerCase().includes('transporterror: invalid channel')
    ) {
      dispatchRdx(error(new Error('Please unplug and replug your device.')))
      return false
    }
    dispatchRdx(error(err))
    return false
  }
}

const fetchWallets = async (provider, dispatchRdx, network = 't') => {
  try {
    const filAddresses = await provider.wallet.getAccounts(0, 1, network)
    const wallets = await Promise.all(
      filAddresses.map(async (address, i) => {
        const balance = await provider.getBalance(address)
        const networkDerivationPath = network === 'f' ? 461 : 1
        return {
          balance,
          address,
          path: [44, networkDerivationPath, 5, 0, i]
        }
      })
    )
    dispatchRdx(walletList(wallets))
    dispatchRdx(clearError())
    return true
  } catch (err) {
    dispatchRdx(error(err))
    return false
  }
}

export const fetchProvider = async (dispatchLocal, dispatchRdx) => {
  const transport = await establishConnectionWithDevice(
    dispatchLocal,
    dispatchRdx
  )
  if (!transport) return false
  return establishConnectionWithFilecoinApp(
    transport,
    dispatchLocal,
    dispatchRdx
  )
}

// returns true if successful connection, false if not
export const connectLedger = async (dispatchLocal, dispatchRdx, network) => {
  const transport = await establishConnectionWithDevice(
    dispatchLocal,
    dispatchRdx
  )
  if (!transport) return false
  const provider = await establishConnectionWithFilecoinApp(
    transport,
    dispatchLocal,
    dispatchRdx
  )
  if (!provider) return false
  return fetchWallets(provider, dispatchRdx, network)
}

export const initialLedgerState = {
  userInitiatedImport: false,
  userImportFailure: false,
  connecting: false,
  connectedFailure: false,
  connectedSuccess: false,
  ledgerLocked: false,
  ledgerUnlocked: false,
  establishingConnectionWFilecoinApp: false,
  filecoinAppOpen: false,
  filecoinAppNotOpen: false,
  replug: false
}

export const LEDGER_STATE_PROPTYPES = {
  userInitiatedImport: PropTypes.bool.isRequired,
  userImportFailure: PropTypes.bool.isRequired,
  connecting: PropTypes.bool.isRequired,
  connectedFailure: PropTypes.bool.isRequired,
  connectedSuccess: PropTypes.bool.isRequired,
  ledgerLocked: PropTypes.bool.isRequired,
  ledgerUnlocked: PropTypes.bool.isRequired,
  establishingConnectionWFilecoinApp: PropTypes.bool.isRequired,
  filecoinAppOpen: PropTypes.bool.isRequired,
  filecoinAppNotOpen: PropTypes.bool.isRequired
}
