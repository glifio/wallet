import {
  ERROR,
  WALLET_LIST,
  SWITCH_ACCOUNT,
  NEW_ACCOUNT
} from './actionTypes';

export const walletList = (accounts) => ({
  type: WALLET_LIST,
  payload: {
    accounts,
  }
})

export const switchAccount = (account) => ({
  type: SWITCH_ACCOUNT,
  payload: {
    account
  }
})

export const newAccount = (account) => ({
  type: NEW_ACCOUNT,
  payload: {
    account
  }
})

export const error = (error) => ({
  type: ERROR,
  error
})
