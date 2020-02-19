import cloneDeep from 'lodash.clonedeep'

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
  LEDGER_REPLUG
} from '../utils/ledger/ledgerStateManagement'

export const initialState = {
  walletType: null,
  walletProvider: null,
  walletConnected: false
}

/* ACTION TYPES */
const SET_WALLET_TYPE = 'SET_WALLET_TYPE'
const CREATE_WALLET_PROVIDER = 'CREATE_WALLET_PROVIDER'

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
  walletProvider: provider
})

/* REDUCER */
export default (state, action) => {
  switch (action.type) {
    case SET_WALLET_TYPE:
      return setWalletTypeInState(cloneDeep(state), action.payload)
    case CREATE_WALLET_PROVIDER:
      return createWalletProviderInState(cloneDeep(state), action.payload)

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
          connectedSuccess: true
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
          ledgerLocked: false,
          ledgerUnlocked: false
        }
      }
    case LEDGER_LOCKED:
      return {
        ...state,
        ledger: {
          ...state.ledger,
          ledgerLocked: true,
          ledgerUnlocked: false,
          userImportFailure: true
        }
      }
    case LEDGER_UNLOCKED:
      return {
        ...state,
        ledger: {
          ...state.ledger,
          ledgerLocked: false,
          ledgerUnlocked: true
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
          ledgerUnlocked: true
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
          ledgerLocked: false,
          ledgerUnlocked: true,
          provider: action.provider
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
