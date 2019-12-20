import {
  CONFIRM_MESSAGE,
  CONFIRMED_MESSAGES,
  ERROR,
  WALLET_LIST,
  SWITCH_WALLET,
  UPDATE_BALANCE,
} from './actionTypes';

export const walletList = wallets => ({
  type: WALLET_LIST,
  payload: {
    wallets,
  },
});

export const switchWallet = index => ({
  type: SWITCH_WALLET,
  payload: {
    index,
  },
});

export const updateBalance = (balance, selectedWalletIdx) => ({
  type: UPDATE_BALANCE,
  payload: {
    balance,
    selectedWalletIdx,
  },
});

export const confirmMessage = message => ({
  type: CONFIRM_MESSAGE,
  payload: {
    message,
  },
});

export const confirmedMessages = (confirmedMsgs, pendingMsgs) => ({
  type: CONFIRMED_MESSAGES,
  payload: {
    confirmedMsgs,
    pendingMsgs,
  },
});

export const error = error => ({
  type: ERROR,
  error,
});
