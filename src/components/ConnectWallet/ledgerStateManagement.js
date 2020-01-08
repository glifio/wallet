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
  transport: null
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
        connectedSuccess: true,
        transport: action.transport
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
        ledgerUnlocked: true
      }
    case RESET_STATE:
      return initialLedgerState
    default:
      return state
  }
}
