import {
  initialLedgerState,
  ledgerActionTypes
} from '../utils/ledger/ledgerStateManagement'
import {
  WalletProviderAction,
  WalletProviderActionType,
  WalletProviderState
} from './types'

export const walletActionTypes = {
  SET_WALLET_TYPE: 'SET_WALLET_TYPE',
  CREATE_WALLET_PROVIDER: 'CREATE_WALLET_PROVIDER',
  WALLET_ERROR: 'WALLET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  RESET_STATE: 'RESET_STATE'
} as Record<string, WalletProviderActionType>

export const initialState = {
  walletType: null,
  walletProvider: null,
  error: '',
  ledger: initialLedgerState
}

/* ACTIONS */
export const setWalletType = (walletType): WalletProviderAction => ({
  type: walletActionTypes.SET_WALLET_TYPE,
  payload: {
    walletType
  }
})

export const createWalletProvider = (provider): WalletProviderAction => ({
  type: walletActionTypes.CREATE_WALLET_PROVIDER,
  payload: {
    provider
  }
})

export const setError = (errMessage): WalletProviderAction => ({
  type: walletActionTypes.WALLET_ERROR,
  error: errMessage
})

export const clearError = (): WalletProviderAction => ({
  type: walletActionTypes.CLEAR_ERROR
})

export const resetLedgerState = (): WalletProviderAction => ({
  type: ledgerActionTypes.LEDGER_RESET_STATE
})

export const resetState = (): WalletProviderAction => ({
  type: walletActionTypes.RESET_STATE
})

/* REDUCER */
export default (
  state: WalletProviderState,
  action: WalletProviderAction
): WalletProviderState => {
  switch (action.type) {
    case walletActionTypes.SET_WALLET_TYPE:
      return { ...Object.freeze(state), walletType: action.payload.walletType }
    case walletActionTypes.CREATE_WALLET_PROVIDER:
      return {
        ...Object.freeze(state),
        walletProvider: action.payload.provider
      }
    case walletActionTypes.WALLET_ERROR:
      return { ...Object.freeze(state), error: action.error }
    case walletActionTypes.CLEAR_ERROR:
      return { ...Object.freeze(state), error: '' }
    case walletActionTypes.RESET_STATE:
      return Object.freeze(initialState)
    // ledger cases
    case ledgerActionTypes.LEDGER_USER_INITIATED_IMPORT:
      return {
        ...Object.freeze(state),
        ledger: {
          ...state.ledger,
          connecting: true,
          connectedFailure: false
        }
      }
    case ledgerActionTypes.LEDGER_NOT_FOUND:
      return {
        ...Object.freeze(state),
        ledger: {
          ...state.ledger,
          connecting: false,
          connectedFailure: true,
          userImportFailure: true
        }
      }
    case ledgerActionTypes.LEDGER_CONNECTED:
      return {
        ...Object.freeze(state),
        ledger: {
          ...state.ledger,
          connecting: false,
          connectedFailure: false,
          inUseByAnotherApp: false
        }
      }
    case ledgerActionTypes.LEDGER_ESTABLISHING_CONNECTION_W_FILECOIN_APP:
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
    case ledgerActionTypes.LEDGER_LOCKED:
      return {
        ...Object.freeze(state),
        ledger: {
          ...state.ledger,
          locked: true,
          unlocked: false,
          userImportFailure: true
        }
      }
    case ledgerActionTypes.LEDGER_UNLOCKED:
      return {
        ...Object.freeze(state),
        ledger: {
          ...state.ledger,
          locked: false,
          unlocked: true
        }
      }
    case ledgerActionTypes.LEDGER_FILECOIN_APP_NOT_OPEN:
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
    case ledgerActionTypes.LEDGER_FILECOIN_APP_OPEN:
      return {
        ...Object.freeze(state),
        ledger: {
          ...state.ledger,
          filecoinAppNotOpen: false,
          locked: false,
          unlocked: true,
          replug: false,
          busy: false
        }
      }
    case ledgerActionTypes.LEDGER_BUSY:
      return {
        ...Object.freeze(state),
        ledger: {
          ...state.ledger,
          busy: true
        }
      }
    case ledgerActionTypes.LEDGER_REPLUG:
      return {
        ...Object.freeze(state),
        ledger: {
          ...state.ledger,
          replug: true
        }
      }
    case ledgerActionTypes.LEDGER_USED_BY_ANOTHER_APP:
      return {
        ...Object.freeze(state),
        ledger: {
          ...state.ledger,
          inUseByAnotherApp: true
        }
      }
    case ledgerActionTypes.LEDGER_BAD_VERSION:
      return {
        ...Object.freeze(state),
        ledger: {
          ...state.ledger,
          badVersion: true
        }
      }
    case ledgerActionTypes.WEBUSB_UNSUPPORTED:
      return {
        ...Object.freeze(state),
        ledger: {
          ...state.ledger,
          webUSBSupported: false
        }
      }
    case ledgerActionTypes.LEDGER_RESET_STATE:
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
