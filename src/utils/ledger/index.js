import Filecoin, {
  LedgerProvider
} from '@openworklabs/filecoin-wallet-provider'
import PropTypes from 'prop-types'

import {
  error,
  walletList,
  createWalletProvider,
  clearError
} from '../../store/actions'
import createTransport from '../../components/ConnectWallet/transport'

export const establishConnectionWithDevice = async (
  dispatchLocal,
  dispatchRdx
) => {
  dispatchLocal({ type: USER_INITIATED_IMPORT })
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
      !err.message.toLowerCase().includes('transporterror: invalid channel')
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
  dispatchLocal({ type: ESTABLISHING_CONNECTION_W_FILECOIN_APP })
  try {
    const provider = new Filecoin(new LedgerProvider(transport), {
      token: process.env.REACT_APP_LOTUS_JWT_TOKEN
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
    dispatchLocal({ type: FILECOIN_APP_OPEN })
    dispatchRdx(createWalletProvider(provider))

    return provider
  } catch (err) {
    dispatchLocal({ type: FILECOIN_APP_NOT_OPEN })

    if (
      err.message &&
      !err.message.toLowerCase().includes('transporterror: invalid channel')
    ) {
      dispatchRdx(error(new Error('Please unplug and replug your device.')))
      return false
    }
    dispatchRdx(error(err))
    return false
  }
}

const fetchWallets = async (
  provider,
  dispatchRdx,
  start = 0,
  end = 1,
  network = 't'
) => {
  try {
    const filAddresses = await provider.wallet.getAccounts(start, end, network)
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
export default async (dispatchLocal, dispatchRdx) => {
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
  return fetchWallets(provider, dispatchRdx)
}

export const initialLedgerState = {
  userVerifiedLedgerConnected: false,
  userVerifiedLedgerUnlocked: false,
  userVerifiedFilecoinAppOpen: false,
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
  provider: null
}

/* VALID ACTION TYPES */
export const USER_VERIFIED_LEDGER_CONNECTED = 'USER_VERIFIED_LEDGER_CONNECTED'
export const USER_UNVERIFIED_LEDGER_CONNECTED =
  'USER_UNVERIFIED_LEDGER_CONNECTED'
export const USER_VERIFIED_LEDGER_UNLOCKED = 'USER_VERIFIED_LEDGER_UNLOCKED'
export const USER_UNVERIFIED_LEDGER_UNLOCKED = 'USER_UNVERIFIED_LEDGER_UNLOCKED'
export const USER_VERIFIED_FILECOIN_APP_OPEN = 'USER_VERIFIED_FILECOIN_APP_OPEN'
export const USER_UNVERIFIED_FILECOIN_APP_OPEN =
  'USER_UNVERIFIED_FILECOIN_APP_OPEN'
export const USER_INITIATED_IMPORT = 'USER_INITIATED_IMPORT'
export const LEDGER_NOT_FOUND = 'LEDGER_NOT_FOUND'
export const RESET_STATE = 'RESET_STATE'
export const LEDGER_CONNECTED = 'LEDGER_CONNECTED'
export const ESTABLISHING_CONNECTION_W_FILECOIN_APP =
  'ESTABLISHING_CONNECTION_W_FILECOIN_APP'
export const FILECOIN_APP_NOT_OPEN = 'FILECOIN_APP_NOT_OPEN'
export const FILECOIN_APP_OPEN = 'FILECOIN_APP_OPEN'
export const LEDGER_LOCKED = 'LEDGER_LOCKED'
export const LEDGER_UNLOCKED = 'LEDGER_UNLOCKED'

export const reducer = (state, action) => {
  switch (action.type) {
    case USER_VERIFIED_LEDGER_CONNECTED:
      return {
        ...state,
        userVerifiedLedgerConnected: true
      }
    case USER_UNVERIFIED_LEDGER_CONNECTED:
      return {
        ...state,
        userVerifiedLedgerConnected: false,
        userVerifiedLedgerUnlocked: false,
        userVerifiedFilecoinAppOpen: false
      }
    case USER_VERIFIED_LEDGER_UNLOCKED:
      return {
        ...state,
        userVerifiedLedgerUnlocked: true
      }
    case USER_UNVERIFIED_LEDGER_UNLOCKED:
      return {
        ...state,
        userVerifiedFilecoinAppOpen: false,
        userVerifiedLedgerUnlocked: false
      }
    case USER_VERIFIED_FILECOIN_APP_OPEN:
      return {
        ...state,
        userVerifiedFilecoinAppOpen: true
      }
    case USER_UNVERIFIED_FILECOIN_APP_OPEN:
      return {
        ...state,
        userVerifiedFilecoinAppOpen: false
      }
    case USER_INITIATED_IMPORT:
      return {
        ...state,
        connecting: true,
        connectedFailure: false,
        connectedSuccess: false,
        userInitiatedImport: true
      }
    case LEDGER_NOT_FOUND:
      return {
        ...state,
        connecting: false,
        connectedFailure: true,
        connectedSuccess: false,
        userImportFailure: true
      }
    case LEDGER_CONNECTED:
      return {
        ...state,
        connecting: false,
        connectedFailure: false,
        connectedSuccess: true
      }
    case ESTABLISHING_CONNECTION_W_FILECOIN_APP:
      return {
        ...state,
        establishingConnectionWFilecoinApp: true,
        filecoinAppOpen: false,
        filecoinAppNotOpen: false,
        ledgerLocked: false,
        ledgerUnlocked: false
      }
    case LEDGER_LOCKED:
      return {
        ...state,
        ledgerLocked: true,
        ledgerUnlocked: false,
        userImportFailure: true
      }
    case LEDGER_UNLOCKED:
      return {
        ...state,
        ledgerLocked: false,
        ledgerUnlocked: true
      }
    case FILECOIN_APP_NOT_OPEN:
      return {
        ...state,
        establishingConnectionWFilecoinApp: false,
        filecoinAppOpen: false,
        filecoinAppNotOpen: true,
        userImportFailure: true,
        // counterintuitive - but the only way we could have known this
        // is if the ledger was unlocked
        ledgerUnlocked: true
      }
    case FILECOIN_APP_OPEN:
      return {
        ...state,
        establishingConnectionWFilecoinApp: false,
        filecoinAppOpen: true,
        filecoinAppNotOpen: false,
        ledgerLocked: false,
        ledgerUnlocked: true,
        provider: action.provider
      }
    case RESET_STATE:
      return {
        ...initialLedgerState
      }
    default:
      return state
  }
}

export const LEDGER_STATE_PROPTYPES = PropTypes.shape({
  userVerifiedLedgerConnected: PropTypes.bool.isRequired,
  userVerifiedLedgerUnlocked: PropTypes.bool.isRequired,
  userVerifiedFilecoinAppOpen: PropTypes.bool.isRequired,
  userInitiatedImport: PropTypes.bool.isRequired,
  userImportFailure: PropTypes.bool.isRequired,
  connecting: PropTypes.bool.isRequired,
  connectedFailure: PropTypes.bool.isRequired,
  connectedSuccess: PropTypes.bool.isRequired,
  ledgerLocked: PropTypes.bool.isRequired,
  ledgerUnlocked: PropTypes.bool.isRequired,
  establishingConnectionWFilecoinApp: PropTypes.bool.isRequired,
  filecoinAppOpen: PropTypes.bool.isRequired,
  filecoinAppNotOpen: PropTypes.bool.isRequired,
  provider: PropTypes.object
})
