import PropTypes from 'prop-types'

/* VALID ACTION TYPES */
export const LEDGER_USER_INITIATED_IMPORT = 'USER_INITIATED_IMPORT'
export const LEDGER_NOT_FOUND = 'LEDGER_NOT_FOUND'
export const LEDGER_RESET_STATE = 'LEDGER_RESET_STATE'
export const LEDGER_CONNECTED = 'LEDGER_CONNECTED'
export const LEDGER_ESTABLISHING_CONNECTION_W_FILECOIN_APP =
  'ESTABLISHING_CONNECTION_W_FILECOIN_APP'
export const LEDGER_FILECOIN_APP_NOT_OPEN = 'FILECOIN_APP_NOT_OPEN'
export const LEDGER_FILECOIN_APP_OPEN = 'FILECOIN_APP_OPEN'
export const LEDGER_LOCKED = 'LEDGER_LOCKED'
export const LEDGER_UNLOCKED = 'LEDGER_UNLOCKED'
export const LEDGER_REPLUG = 'LEDGER_REPLUG'
export const LEDGER_BUSY = 'LEDGER_BUSY'
export const LEDGER_USED_BY_ANOTHER_APP = 'LEDGER_USED_BY_ANOTHER_APP'

export const initialLedgerState = {
  userImportFailure: false,
  connecting: false,
  connectedFailure: false,
  locked: false,
  unlocked: false,
  busy: false,
  filecoinAppNotOpen: false,
  replug: false,
  inUseByAnotherApp: false
}

export const LEDGER_STATE_PROPTYPES = {
  userImportFailure: PropTypes.bool.isRequired,
  connecting: PropTypes.bool.isRequired,
  connectedFailure: PropTypes.bool.isRequired,
  locked: PropTypes.bool.isRequired,
  unlocked: PropTypes.bool.isRequired,
  busy: PropTypes.bool.isRequired,
  filecoinAppNotOpen: PropTypes.bool.isRequired
}
