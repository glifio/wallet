import PropTypes from 'prop-types'

export type LedgerActionType =
  | 'LEDGER_USER_INITIATED_IMPORT'
  | 'LEDGER_NOT_FOUND'
  | 'LEDGER_RESET_STATE'
  | 'LEDGER_CONNECTED'
  | 'LEDGER_ESTABLISHING_CONNECTION_W_FILECOIN_APP'
  | 'LEDGER_FILECOIN_APP_NOT_OPEN'
  | 'LEDGER_FILECOIN_APP_OPEN'
  | 'LEDGER_LOCKED'
  | 'LEDGER_UNLOCKED'
  | 'LEDGER_REPLUG'
  | 'LEDGER_BUSY'
  | 'LEDGER_USED_BY_ANOTHER_APP'
  | 'LEDGER_BAD_VERSION'
  | 'TRANSPORT_UNSUPPORTED'

export type LedgerState = {
  userImportFailure: boolean
  connecting: boolean
  connectedFailure: boolean
  locked: boolean
  unlocked: boolean
  busy: boolean
  filecoinAppNotOpen: boolean
  badVersion: boolean
  transportSupported: boolean
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
  transportSupported: true
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
  transportSupported: PropTypes.bool.isRequired,
  inUseByAnotherApp: PropTypes.bool.isRequired
}
