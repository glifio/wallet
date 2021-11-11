import { pluckConfirmed, uniqueifyMsgs } from '../utils/removeDupMessages'
import {
  getMessagesFromCache,
  removeMessageFromCache
} from '../utils/cacheMessage'

export const initialMessagesState = {
  loading: false,
  loadedSuccess: false,
  loadedFailure: false,
  pending: [],
  confirmed: [],
  paginating: false,
  total: -1,
  populatedFromCache: false
}

export const initialState = {
  error: '',
  messages: initialMessagesState
}

export const confirmMessage = (state, { message }) => {
  return {
    ...state,
    messages: {
      ...state.messages,
      pending: [message, ...state.messages.pending]
    }
  }
}

export const confirmedMessage = (state, { msgCid }) => {
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

export const fetchingConfirmedMessages = (state) => ({
  ...state,
  messages: {
    ...state.messages,
    loading: true,
    loadedSuccess: false,
    loadedFailure: false
  }
})

export const clearMessages = (state) => ({
  ...state,
  messages: {
    ...initialMessagesState
  }
})

export const fetchedConfirmedMessagesSuccess = (state, { messages, total }) => {
  // here we pluck out any messages from localstorage since filfox now has them
  const cachedMessages = getMessagesFromCache(
    state.wallets[state.selectedWalletIdx].address
  )
  const cids = new Set(messages.map((msg) => msg.cid))
  cachedMessages.forEach((message) => {
    // we now have the CID
    if (cids.has(message.cid))
      removeMessageFromCache(
        state.wallets[state.selectedWalletIdx].address,
        message.cid
      )
  })
  return {
    ...state,
    messages: {
      ...state.messages,
      loading: false,
      loadedSuccess: true,
      loadedFailure: false,
      confirmed: uniqueifyMsgs(state.messages.confirmed, messages),
      pending: pluckConfirmed(state.messages.pending, messages),
      total: total || state.messages.total,
      paginating: false
    }
  }
}

export const fetchedConfirmedMessagesFailure = (state, error) => ({
  ...state,
  messages: {
    ...state.messages,
    loading: false,
    loadedSuccess: false,
    loadedFailure: true,
    paginating: false
  },
  error
})

export const fetchingNextPage = (state) => ({
  ...state,
  messages: {
    ...state.messages,
    paginating: true
  }
})

export const error = (state, err) => ({
  ...state,
  error: err
})

export const clearError = (state) => ({
  ...state,
  error: null
})

export const populateRedux = (state, { pendingMsgs }) => ({
  ...state,
  messages: {
    ...state.messages,
    // just in case there's some crazy race condition where msgs were loaded from server before localstorage
    pending: uniqueifyMsgs(pendingMsgs, state.messages.pending),
    populatedFromCache: true
  }
})
