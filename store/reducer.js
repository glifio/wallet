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
  SWITCH_NETWORK,
  RESET_STATE,
  SET_INVESTOR_UUID
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
  switchNetwork,
  setInvestorId,
  initialState
} from './states'

export default (state, action) => {
  switch (action.type) {
    case WALLET_LIST: {
      return walletList(Object.freeze(state), action.payload)
    }
    case SWITCH_WALLET: {
      return switchWallet(Object.freeze(state), action.payload)
    }
    case UPDATE_BALANCE: {
      return updateBalance(Object.freeze(state), action.payload)
    }
    case CONFIRM_MESSAGE: {
      return confirmMessage(Object.freeze(state), action.payload)
    }
    case CONFIRMED_MESSAGE:
      // we confirm plural messages to handle cases where multiple messages
      // get confirmed in the same block (tough to handle this singularly without state bugs)
      return confirmedMessage(Object.freeze(state), action.payload)
    case FETCHING_CONFIRMED_MESSAGES:
      return fetchingConfirmedMessages(Object.freeze(state))
    case FETCHED_CONFIRMED_MESSAGES_SUCCESS:
      return fetchedConfirmedMessagesSuccess(
        Object.freeze(state),
        action.payload
      )
    case FETCHED_CONFIRMED_MESSAGES_FAILURE:
      return fetchedConfirmedMessagesFailure(Object.freeze(state), action.error)
    case FETCHING_NEXT_PAGE:
      return fetchingNextPage(Object.freeze(state))
    case ERROR:
      return error(Object.freeze(state), action.error)
    case CLEAR_ERROR:
      return clearError(Object.freeze(state))
    case POPULATE_REDUX:
      return populateRedux(Object.freeze(state), action.payload)
    case SWITCH_NETWORK:
      return switchNetwork(Object.freeze(state), action.payload)
    case RESET_STATE:
      return initialState
    case SET_INVESTOR_UUID:
      return setInvestorId(Object.freeze(state), action.payload)
    default:
      return state
  }
}
