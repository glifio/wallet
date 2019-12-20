import {
  ERROR,
  WALLET_LIST,
  SWITCH_ACCOUNT,
  NEW_ACCOUNT,
  UPDATE_BALANCE,
} from './actionTypes';

export const walletList = accounts => ({
  type: WALLET_LIST,
  payload: {
    accounts,
  },
});

export const switchAccount = index => ({
  type: SWITCH_ACCOUNT,
  payload: {
    index,
  },
});

export const newAccount = account => ({
  type: NEW_ACCOUNT,
  payload: {
    account,
  },
});

export const updateBalance = (balance, accountIdx) => ({
  type: UPDATE_BALANCE,
  payload: {
    balance,
    accountIdx,
  },
});

export const error = error => ({
  type: ERROR,
  error,
});
