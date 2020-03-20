/* eslint-disable no-unused-vars */
import updateArrayItem from '../utils/updateArrayItem'
import { setMsgInCache, removeMsgFromCache } from './cache'

export const initialState = {
  wallets: [],
  selectedWalletIdx: 0,
  error: null,
  messages: {
    page: 0,
    loading: false,
    loadedSuccess: false,
    loadedFailure: false,
    pending: [],
    confirmed: [],
    links: {},
    paginating: false
  },
  network: 't'
}

export const walletList = (state, { wallets }) => ({
  ...state,
  // make sure we only ever add wallets to our list that include the right network prefix (blocks race conditions with ledger)
  wallets: wallets.filter(wallet => wallet.address[0] === state.network)
})

export const switchWallet = (state, { index }) => ({
  ...state,
  selectedWalletIdx: index,
  messages: {
    page: 0,
    loading: false,
    loadedSuccess: false,
    loadedFailure: false,
    pending: [],
    confirmed: [],
    links: {},
    paginating: false
  }
})

export const updateBalance = (state, { balance, walletIdx }) => ({
  ...state,
  wallets: updateArrayItem(state.wallets, walletIdx, {
    ...state.wallets[walletIdx],
    balance
  })
})

export const confirmMessage = (state, { message }) => {
  // setMsgInCache(message)
  return {
    ...state,
    messages: {
      ...state.messages,
      pending: [message, ...state.messages.pending]
    }
  }
}

export const confirmedMessage = (state, { msgCid }) => {
  const { address } = state.wallets[state.selectedWalletIdx]
  // removeMsgFromCache(address, msgCid)
  const newPendingMsgs = [...state.messages.pending]
  let confirmedMsg = []

  for (let i = 0; i < state.messages.pending.length; i += 1) {
    if (state.messages.pending[i].cid === msgCid) {
      confirmedMsg = newPendingMsgs.splice(i, 1)
    }
  }

  return {
    ...state,
    messages: {
      ...state.messages,
      pending: newPendingMsgs,
      confirmed: [...confirmedMsg, ...state.messages.confirmed]
    }
  }
}

export const fetchingConfirmedMessages = state => ({
  ...state,
  messages: {
    ...state.messages,
    loading: true,
    loadedSuccess: false,
    loadedFailure: false
  }
})

export const fetchedConfirmedMessagesSuccess = (
  state,
  { messages, links }
) => ({
  ...state,
  messages: {
    ...state.messages,
    loading: false,
    loadedSuccess: true,
    loadedFailure: false,
    confirmed: [...state.messages.confirmed, ...messages],
    links
  }
})

export const fetchedConfirmedMessagesFailure = (state, error) => ({
  ...state,
  messages: {
    ...state.messages,
    loading: false,
    loadedSuccess: false,
    loadedFailure: true
  },
  error
})

export const fetchingNextPage = state => ({
  ...state,
  messages: {
    ...state.messages,
    paginating: true
  }
})

export const fetchedNextPageSuccess = (state, { messages, links }) => ({
  ...state,
  messages: {
    ...state.messages,
    paginating: false,
    confirmed: [...state.messages.confirmed, ...messages],
    links
  }
})

export const fetchedNextPageFailure = (state, error) => ({
  ...state,
  messages: {
    ...state.messages,
    paginating: false
  },
  error
})

export const error = (state, err) => ({
  ...state,
  error: err
})

export const clearError = state => ({
  ...state,
  error: null
})

export const populateRedux = (state, { pendingMsgs }) => ({
  ...state,
  messages: {
    ...state.messages,
    // just in case there's some crazy race condition where msgs were loaded from server before localstorage
    pending: pendingMsgs
  }
})

export const switchNetwork = (state, { network, wallets }) => ({
  ...state,
  network,
  wallets
})
