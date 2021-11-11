import {
  CONFIRM_MESSAGE,
  CONFIRMED_MESSAGE,
  ERROR,
  CLEAR_ERROR,
  CLEAR_MESSAGES,
  FETCHING_CONFIRMED_MESSAGES,
  FETCHED_CONFIRMED_MESSAGES_SUCCESS,
  FETCHED_CONFIRMED_MESSAGES_FAILURE,
  FETCHING_NEXT_PAGE,
  POPULATE_REDUX,
  RESET_STATE
} from './actionTypes'

export const confirmMessage = (message) => {
  // disabling for now
  // setMessageInCache(message.from, message)
  return {
    type: CONFIRM_MESSAGE,
    payload: {
      message
    }
  }
}

export const confirmedMessage = (msgCid) => ({
  type: CONFIRMED_MESSAGE,
  payload: {
    msgCid
  }
})

export const clearMessages = () => ({
  type: CLEAR_MESSAGES
})

export const fetchingConfirmedMessages = () => ({
  type: FETCHING_CONFIRMED_MESSAGES
})

export const fetchedConfirmedMessagesSuccess = (messages, total) => ({
  type: FETCHED_CONFIRMED_MESSAGES_SUCCESS,
  payload: {
    messages,
    total
  }
})

export const fetchedConfirmedMessagesFailure = (error) => ({
  type: FETCHED_CONFIRMED_MESSAGES_FAILURE,
  error
})

export const fetchingNextPage = () => ({
  type: FETCHING_NEXT_PAGE
})

export const error = (err) => ({
  type: ERROR,
  error: err
})

export const clearError = () => {
  return {
    type: CLEAR_ERROR
  }
}

export const populateRedux = (pendingMsgs) => ({
  type: POPULATE_REDUX,
  payload: {
    pendingMsgs
  }
})

export const resetState = () => {
  return {
    type: RESET_STATE
  }
}
