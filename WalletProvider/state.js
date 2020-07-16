import {
  initialLedgerState,
  LEDGER_USER_INITIATED_IMPORT,
  LEDGER_NOT_FOUND,
  LEDGER_RESET_STATE,
  LEDGER_CONNECTED,
  LEDGER_ESTABLISHING_CONNECTION_W_FILECOIN_APP,
  LEDGER_FILECOIN_APP_NOT_OPEN,
  LEDGER_FILECOIN_APP_OPEN,
  LEDGER_LOCKED,
  LEDGER_UNLOCKED,
  LEDGER_REPLUG,
  LEDGER_BUSY,
  LEDGER_USED_BY_ANOTHER_APP
} from '../utils/ledger/ledgerStateManagement'

export const initialState = {
  walletType: null,
  walletProvider: null,
  error: '',
  ledger: initialLedgerState
}

/* ACTION TYPES */
export const SET_WALLET_TYPE = 'SET_WALLET_TYPE'
export const CREATE_WALLET_PROVIDER = 'CREATE_WALLET_PROVIDER'
export const WALLET_ERROR = 'WALLET_ERROR'
export const CLEAR_ERROR = 'CLEAR_ERROR'
export const RESET_STATE = 'RESET_STATE'

/* ACTIONS */
export const setWalletType = walletType => ({
  type: SET_WALLET_TYPE,
  payload: {
    walletType
  }
})

export const createWalletProvider = provider => ({
  type: CREATE_WALLET_PROVIDER,
  payload: {
    provider
  }
})

export const setError = errMessage => ({
  type: WALLET_ERROR,
  error: errMessage
})

export const clearError = () => ({
  type: CLEAR_ERROR
})

export const resetLedgerState = () => ({
  type: LEDGER_RESET_STATE
})

export const resetState = () => ({
  type: RESET_STATE
})

/* REDUCER */
export default (state, action) => {
  switch (action.type) {
    case SET_WALLET_TYPE:
      return { ...Object.freeze(state), walletType: action.payload.walletType }
    case CREATE_WALLET_PROVIDER:
      return {
        ...Object.freeze(state),
        walletProvider: action.payload.provider
      }
    case WALLET_ERROR:
      return { ...Object.freeze(state), error: action.error }
    case CLEAR_ERROR:
      return { ...Object.freeze(state), error: '' }
    case RESET_STATE:
      return Object.freeze(initialState)
    // ledger cases
    case LEDGER_USER_INITIATED_IMPORT:
      return {
        ...Object.freeze(state),
        ledger: {
          ...state.ledger,
          connecting: true,
          connectedFailure: false
        }
      }
    case LEDGER_NOT_FOUND:
      return {
        ...Object.freeze(state),
        ledger: {
          ...state.ledger,
          connecting: false,
          connectedFailure: true,
          userImportFailure: true
        }
      }
    case LEDGER_CONNECTED:
      return {
        ...Object.freeze(state),
        ledger: {
          ...state.ledger,
          connecting: false,
          connectedFailure: false,
          inUseByAnotherApp: false
        }
      }
    case LEDGER_ESTABLISHING_CONNECTION_W_FILECOIN_APP:
      return {
        ...Object.freeze(state),
        ledger: {
          ...state.ledger,
          filecoinAppNotOpen: false,
          locked: false,
          unlocked: false,
          busy: false,
          replug: false
        }
      }
    case LEDGER_LOCKED:
      return {
        ...Object.freeze(state),
        ledger: {
          ...state.ledger,
          locked: true,
          unlocked: false,
          userImportFailure: true
        }
      }
    case LEDGER_UNLOCKED:
      return {
        ...Object.freeze(state),
        ledger: {
          ...state.ledger,
          locked: false,
          unlocked: true
        }
      }
    case LEDGER_FILECOIN_APP_NOT_OPEN:
      return {
        ...Object.freeze(state),
        ledger: {
          ...state.ledger,
          filecoinAppNotOpen: true,
          userImportFailure: true,
          // counterintuitive - but the only way we could have known this
          // is if the ledger was unlocked
          unlocked: true
        }
      }
    case LEDGER_FILECOIN_APP_OPEN:
      return {
        ...Object.freeze(state),
        ledger: {
          ...state.ledger,
          filecoinAppNotOpen: false,
          locked: false,
          unlocked: true,
          replug: false,
          busy: false,
          provider: action.provider
        }
      }
    case LEDGER_BUSY:
      return {
        ...Object.freeze(state),
        ledger: {
          ...state.ledger,
          busy: true
        }
      }
    case LEDGER_REPLUG:
      return {
        ...Object.freeze(state),
        ledger: {
          ...state.ledger,
          replug: true
        }
      }
    case LEDGER_USED_BY_ANOTHER_APP:
      return {
        ...Object.freeze(state),
        ledger: {
          ...state.ledger,
          inUseByAnotherApp: true
        }
      }
    case LEDGER_RESET_STATE:
      return {
        ...Object.freeze(state),
        ledger: {
          ...initialLedgerState
        }
      }
    default:
      return state
  }
}
