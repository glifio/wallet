import cloneDeep from 'lodash.clonedeep'

import {
  WALLET_LIST,
  SWITCH_WALLET,
  ERROR,
  UPDATE_BALANCE,
  CONFIRM_MESSAGE,
  CONFIRMED_MESSAGES,
  UPDATE_PROGRESS,
  SET_WALLET_TYPE,
  CLEAR_ERROR,
  CREATE_WALLET_PROVIDER
} from './actionTypes'

import {
  confirmMessage,
  confirmedMessages,
  createWalletProvider,
  initialState,
  setWalletType,
  switchWallet,
  walletList,
  updateBalance,
  updateProgress,
  error,
  clearError
} from './states'

export default (state = initialState, action) => {
  switch (action.type) {
    case WALLET_LIST: {
      return walletList(cloneDeep(state), action.payload)
    }
    case SWITCH_WALLET: {
      return switchWallet(cloneDeep(state), action.payload)
    }
    case UPDATE_BALANCE: {
      return updateBalance(cloneDeep(state), action.payload)
    }
    case CONFIRM_MESSAGE: {
      return confirmMessage(cloneDeep(state), action.payload)
    }
    case CONFIRMED_MESSAGES:
      // we confirm plural messages to handle cases where multiple messages
      // get confirmed in the same block (tough to handle this singularly without state bugs)
      return confirmedMessages(cloneDeep(state), action.payload)
    case UPDATE_PROGRESS:
      return updateProgress(cloneDeep(state), action.payload)
    case SET_WALLET_TYPE:
      return setWalletType(cloneDeep(state), action.payload)
    case CREATE_WALLET_PROVIDER:
      return createWalletProvider(cloneDeep(state), action.payload)
    case ERROR: {
      return error(cloneDeep(state), action.error)
    }
    case CLEAR_ERROR: {
      return clearError(cloneDeep(state))
    }
    default:
      return state
  }
}
