import {
  CONFIRM_MESSAGE,
  CONFIRMED_MESSAGE,
  ERROR,
  SWITCH_WALLET,
  SWITCH_NETWORK,
  UPDATE_BALANCE,
  CLEAR_ERROR,
  FETCHING_CONFIRMED_MESSAGES,
  FETCHED_CONFIRMED_MESSAGES_SUCCESS,
  FETCHED_CONFIRMED_MESSAGES_FAILURE,
  FETCHING_NEXT_PAGE,
  FETCHING_NEXT_PAGE_SUCCESS,
  FETCHING_NEXT_PAGE_FAILURE,
  WALLET_LIST,
  POPULATE_REDUX
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

export const updateBalance = (balance, walletIdx) => ({
  type: UPDATE_BALANCE,
  payload: {
    balance,
    walletIdx
  }
})

export const confirmMessage = message => ({
  type: CONFIRM_MESSAGE,
  payload: {
    message
  }
})

export const confirmedMessage = msgCid => ({
  type: CONFIRMED_MESSAGE,
  payload: {
    msgCid
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

export const fetchedConfirmedMessagesFailure = error => ({
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

export const fetchedNextPageFailure = ({ error }) => ({
  type: FETCHING_NEXT_PAGE_FAILURE,
  error
})

export const error = err => ({
  type: ERROR,
  error: err
})

export const clearError = () => {
  return {
    type: CLEAR_ERROR
  }
}

export const populateRedux = pendingMsgs => ({
  type: POPULATE_REDUX,
  payload: {
    pendingMsgs
  }
})

export const switchNetwork = network => ({
  type: SWITCH_NETWORK,
  payload: {
    network
  }
})
