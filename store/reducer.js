import {
  ERROR,
  CONFIRM_MESSAGE,
  CONFIRMED_MESSAGE,
  CLEAR_ERROR,
  CLEAR_MESSAGES,
  FETCHING_CONFIRMED_MESSAGES,
  FETCHED_CONFIRMED_MESSAGES_SUCCESS,
  FETCHED_CONFIRMED_MESSAGES_FAILURE,
  FETCHING_NEXT_PAGE,
  POPULATE_REDUX,
  RESET_STATE
} from './actionTypes'

import {
  confirmMessage,
  confirmedMessage,
  error,
  clearError,
  fetchingConfirmedMessages,
  fetchedConfirmedMessagesSuccess,
  fetchedConfirmedMessagesFailure,
  fetchingNextPage,
  populateRedux,
  initialState,
  clearMessages
} from './states'

const reducer = (state, action) => {
  switch (action.type) {
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
    case CLEAR_MESSAGES:
      return clearMessages(Object.freeze(state))
    case POPULATE_REDUX:
      return populateRedux(Object.freeze(state), action.payload)
    case RESET_STATE:
      return { ...initialState }
    default:
      return state
  }
}

export default reducer
