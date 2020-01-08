export const initialLedgerState = {
  userVerifiedLedgerConnected: false,
  userVerifiedLedgerUnlocked: false,
  userVerifiedFilecoinAppOpen: false,
  userInitiatedImport: false,
  connecting: false,
  connectedFailure: false,
  connectedSuccess: false
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
        connectedSuccess: false
      }
    case LEDGER_CONNECTED:
      return {
        ...state,
        connecting: false,
        connectedFailure: false,
        connectedSuccess: true
      }
    case RESET_STATE:
      return initialLedgerState
    default:
      return state
  }
}
