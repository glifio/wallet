import { LEDGER } from '../constants'
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
  walletConnected: false,
  step: 1,
  error: '',
  ledger: initialLedgerState
}

/* ACTION TYPES */
const SET_WALLET_TYPE = 'SET_WALLET_TYPE'
const CREATE_WALLET_PROVIDER = 'CREATE_WALLET_PROVIDER'
const WALLET_ERROR = 'WALLET_ERROR'
const CLEAR_ERROR = 'CLEAR_ERROR'

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

/* STATE */
const setWalletTypeInState = (state, { walletType }) => {
  const newState = {
    ...state,
    walletType
  }
  if (walletType === LEDGER) {
    newState.ledger = initialLedgerState
  }

  return newState
}

const createWalletProviderInState = (state, { provider }) => ({
  ...state,
  walletConnected: true,
  walletProvider: provider,
  step: 2
})

const setErrorInState = (state, { error }) => ({
  ...state,
  error
})

const clearErrorInState = state => ({
  ...state,
  error: ''
})

/* REDUCER */
export default (state, action) => {
  switch (action.type) {
    case SET_WALLET_TYPE:
      return setWalletTypeInState(Object.freeze(state), action.payload)
    case CREATE_WALLET_PROVIDER:
      return createWalletProviderInState(Object.freeze(state), action.payload)
    case WALLET_ERROR:
      return setErrorInState(Object.freeze(state), action.error)
    case CLEAR_ERROR:
      return clearErrorInState(Object.freeze(state))
    // ledger cases
    case LEDGER_USER_INITIATED_IMPORT:
      return {
        ...state,
        ledger: {
          ...state.ledger,
          connecting: true,
          connectedFailure: false,
          connectedSuccess: false,
          userInitiatedImport: true
        }
      }
    case LEDGER_NOT_FOUND:
      return {
        ...state,
        ledger: {
          ...state.ledger,
          connecting: false,
          connectedFailure: true,
          connectedSuccess: false,
          userImportFailure: true
        }
      }
    case LEDGER_CONNECTED:
      return {
        ...state,
        ledger: {
          ...state.ledger,
          connecting: false,
          connectedFailure: false,
          connectedSuccess: true,
          inUseByAnotherApp: false
        }
      }
    case LEDGER_ESTABLISHING_CONNECTION_W_FILECOIN_APP:
      return {
        ...state,
        ledger: {
          ...state.ledger,
          establishingConnectionWFilecoinApp: true,
          filecoinAppOpen: false,
          filecoinAppNotOpen: false,
          locked: false,
          unlocked: false,
          busy: false,
          replug: false
        }
      }
    case LEDGER_LOCKED:
      return {
        ...state,
        ledger: {
          ...state.ledger,
          locked: true,
          unlocked: false,
          userImportFailure: true
        }
      }
    case LEDGER_UNLOCKED:
      return {
        ...state,
        ledger: {
          ...state.ledger,
          locked: false,
          unlocked: true
        }
      }
    case LEDGER_FILECOIN_APP_NOT_OPEN:
      return {
        ...state,
        ledger: {
          ...state.ledger,
          establishingConnectionWFilecoinApp: false,
          filecoinAppOpen: false,
          filecoinAppNotOpen: true,
          userImportFailure: true,
          // counterintuitive - but the only way we could have known this
          // is if the ledger was unlocked
          unlocked: true
        }
      }
    case LEDGER_FILECOIN_APP_OPEN:
      return {
        ...state,
        ledger: {
          ...state.ledger,
          establishingConnectionWFilecoinApp: false,
          filecoinAppOpen: true,
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
        ...state,
        ledger: {
          ...state.ledger,
          busy: true
        }
      }
    case LEDGER_REPLUG:
      return {
        ...state,
        ledger: {
          ...state.ledger,
          replug: true
        }
      }
    case LEDGER_USED_BY_ANOTHER_APP:
      return {
        ...state,
        ledger: {
          ...state.ledger,
          inUseByAnotherApp: true
        }
      }
    case LEDGER_RESET_STATE:
      return {
        ...state,
        ledger: {
          ...initialLedgerState
        }
      }
    default:
      return state
  }
}
