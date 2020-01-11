import {
  CONFIRM_MESSAGE,
  CONFIRMED_MESSAGES,
  ERROR,
  WALLET_LIST,
  SWITCH_WALLET,
  UPDATE_BALANCE,
  UPDATE_PROGRESS,
  CLEAR_ERROR,
  FETCHING_CONFIRMED_MESSAGES,
  FETCHED_CONFIRMED_MESSAGES_SUCCESS,
  FETCHED_CONFIRMED_MESSAGES_FAILURE,
  FETCHING_NEXT_PAGE,
  FETCHING_NEXT_PAGE_SUCCESS,
  FETCHING_NEXT_PAGE_FAILURE
} from './actionTypes'

export const walletList = wallets => ({
  type: WALLET_LIST,
  payload: {
    wallets
  }
})

export const switchWallet = index => ({
  type: SWITCH_WALLET,
  payload: {
    index
  }
})

export const updateBalance = (balance, selectedWalletIdx) => ({
  type: UPDATE_BALANCE,
  payload: {
    balance,
    selectedWalletIdx
  }
})

export const confirmMessage = message => ({
  type: CONFIRM_MESSAGE,
  payload: {
    message
  }
})

export const confirmedMessages = (confirmedMsgs, pendingMsgs) => ({
  type: CONFIRMED_MESSAGES,
  payload: {
    confirmedMsgs,
    pendingMsgs
  }
})

export const updateProgress = progress => ({
  type: UPDATE_PROGRESS,
  payload: {
    progress
  }
})

export const fetchingConfirmedMessages = () => ({
  type: FETCHING_CONFIRMED_MESSAGES
})

export const fetchedConfirmedMessagesSuccess = (messages, links) => ({
  type: FETCHED_CONFIRMED_MESSAGES_SUCCESS,
  payload: {
    messages,
    links
  }
})

export const fetchedConfirmedMessagesFailure = () => ({
  type: FETCHED_CONFIRMED_MESSAGES_FAILURE,
  error
})

export const fetchingNextPage = () => ({
  type: FETCHING_NEXT_PAGE
})

export const fetchedNextPageSuccess = (messages, links) => ({
  type: FETCHING_NEXT_PAGE_SUCCESS,
  payload: {
    messages,
    links
  }
})

export const fetchedNextPageFailure = () => ({
  type: FETCHING_NEXT_PAGE_FAILURE,
  error
})

export const error = error => ({
  type: ERROR,
  error
})

export const clearError = () => {
  return {
    type: CLEAR_ERROR
  }
}
