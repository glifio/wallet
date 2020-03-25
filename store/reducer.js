import cloneDeep from 'lodash.clonedeep'

import {
  WALLET_LIST,
  SWITCH_WALLET,
  ERROR,
  UPDATE_BALANCE,
  CONFIRM_MESSAGE,
  CONFIRMED_MESSAGE,
  CLEAR_ERROR,
  FETCHING_CONFIRMED_MESSAGES,
  FETCHED_CONFIRMED_MESSAGES_SUCCESS,
  FETCHED_CONFIRMED_MESSAGES_FAILURE,
  FETCHING_NEXT_PAGE,
  POPULATE_REDUX,
  SWITCH_NETWORK
} from './actionTypes'

import {
  confirmMessage,
  confirmedMessage,
  switchWallet,
  walletList,
  updateBalance,
  error,
  clearError,
  fetchingConfirmedMessages,
  fetchedConfirmedMessagesSuccess,
  fetchedConfirmedMessagesFailure,
  fetchingNextPage,
  populateRedux,
  switchNetwork
} from './states'

export default (state, action) => {
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
    case CONFIRMED_MESSAGE:
      // we confirm plural messages to handle cases where multiple messages
      // get confirmed in the same block (tough to handle this singularly without state bugs)
      return confirmedMessage(cloneDeep(state), action.payload)
    case FETCHING_CONFIRMED_MESSAGES:
      return fetchingConfirmedMessages(cloneDeep(state))
    case FETCHED_CONFIRMED_MESSAGES_SUCCESS:
      return fetchedConfirmedMessagesSuccess(cloneDeep(state), action.payload)
    case FETCHED_CONFIRMED_MESSAGES_FAILURE:
      return fetchedConfirmedMessagesFailure(cloneDeep(state), action.error)
    case FETCHING_NEXT_PAGE:
      return fetchingNextPage(cloneDeep(state))
    case ERROR:
      return error(cloneDeep(state), action.error)
    case CLEAR_ERROR:
      return clearError(cloneDeep(state))
    case POPULATE_REDUX:
      return populateRedux(cloneDeep(state), action.payload)
    case SWITCH_NETWORK:
      return switchNetwork(cloneDeep(state), action.payload)
    default:
      return state
  }
}
