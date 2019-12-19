import BigNumber from 'bignumber.js';

export const initialState = {
  accounts: [],
  selectedAccount: '',
  isLoggedIn: false,
  error: null,
  balance: new BigNumber(0),
};

export const walletList = (state, { accounts }) => ({
  ...state,
  accounts,
  selectedAccount: accounts[0],
});

export const switchAccount = (state, { account }) => ({
  ...state,
  selectedAccount: account,
});

export const newAccount = (state, { account }) => ({
  ...state,
  selectedAccount: account,
  accounts: [...state.accounts, account],
});

export const updateBalance = (state, { balance }) => ({
  ...state,
  balance,
});

export const error = (state, error) => ({
  ...state,
  error,
});
