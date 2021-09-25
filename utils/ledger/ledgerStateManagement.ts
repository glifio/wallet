import PropTypes from 'prop-types'

export type LedgerActionType =
  | 'USER_INITIATED_IMPORT'
  | 'LEDGER_NOT_FOUND'
  | 'LEDGER_RESET_STATE'
  | 'LEDGER_CONNECTED'
  | 'ESTABLISHING_CONNECTION_W_FILECOIN_APP'
  | 'FILECOIN_APP_NOT_OPEN'
  | 'FILECOIN_APP_OPEN'
  | 'LEDGER_LOCKED'
  | 'LEDGER_UNLOCKED'
  | 'LEDGER_REPLUG'
  | 'LEDGER_BUSY'
  | 'LEDGER_USED_BY_ANOTHER_APP'
  | 'LEDGER_BAD_VERSION'
  | 'WEBUSB_UNSUPPORTED'

/* VALID ACTION TYPES */
export const ledgerActionTypes = {
  LEDGER_USER_INITIATED_IMPORT: 'USER_INITIATED_IMPORT',
  LEDGER_NOT_FOUND: 'LEDGER_NOT_FOUND',
  LEDGER_RESET_STATE: 'LEDGER_RESET_STATE',
  LEDGER_CONNECTED: 'LEDGER_CONNECTED',
  LEDGER_ESTABLISHING_CONNECTION_W_FILECOIN_APP:
    'ESTABLISHING_CONNECTION_W_FILECOIN_APP',
  LEDGER_FILECOIN_APP_NOT_OPEN: 'FILECOIN_APP_NOT_OPEN',
  LEDGER_FILECOIN_APP_OPEN: 'FILECOIN_APP_OPEN',
  LEDGER_LOCKED: 'LEDGER_LOCKED',
  LEDGER_UNLOCKED: 'LEDGER_UNLOCKED',
  LEDGER_REPLUG: 'LEDGER_REPLUG',
  LEDGER_BUSY: 'LEDGER_BUSY',
  LEDGER_USED_BY_ANOTHER_APP: 'LEDGER_USED_BY_ANOTHER_APP',
  LEDGER_BAD_VERSION: 'LEDGER_BAD_VERSION',
  WEBUSB_UNSUPPORTED: 'WEBUSB_UNSUPPORTED'
} as Record<string, LedgerActionType>

export interface LedgerState {
  userImportFailure: boolean
  connecting: boolean
  connectedFailure: boolean
  locked: boolean
  unlocked: boolean
  busy: boolean
  filecoinAppNotOpen: boolean
  badVersion: boolean
  webUSBSupported: boolean
  inUseByAnotherApp: boolean
  replug: boolean
}

export const initialLedgerState: LedgerState = {
  userImportFailure: false,
  connecting: false,
  connectedFailure: false,
  locked: false,
  unlocked: false,
  busy: false,
  filecoinAppNotOpen: false,
  replug: false,
  inUseByAnotherApp: false,
  badVersion: false,
  // true until proven otherwise
  webUSBSupported: true
}

export const LEDGER_STATE_PROPTYPES = {
  userImportFailure: PropTypes.bool.isRequired,
  connecting: PropTypes.bool.isRequired,
  connectedFailure: PropTypes.bool.isRequired,
  locked: PropTypes.bool.isRequired,
  unlocked: PropTypes.bool.isRequired,
  busy: PropTypes.bool.isRequired,
  filecoinAppNotOpen: PropTypes.bool.isRequired,
  badVersion: PropTypes.bool.isRequired,
  replug: PropTypes.bool.isRequired,
  webUSBSupported: PropTypes.bool.isRequired,
  inUseByAnotherApp: PropTypes.bool.isRequired
}
