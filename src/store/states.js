import updateArrayItem from './utils/updateArrayItem';

export const initialState = {
  accounts: [],
  selectedAccount: 0,
  isLoggedIn: false,
  error: null,
  pendingMsgs: [],
  confirmedMsgs: [],
};

export const walletList = (state, { accounts }) => ({
  ...state,
  accounts,
  selectedAccount: 0,
});

export const switchAccount = (state, { index }) => ({
  ...state,
  selectedAccount: index,
});

export const newAccount = (state, { account }) => ({
  ...state,
  selectedAccount: account,
  accounts: [...state.accounts, account],
});

export const updateBalance = (state, { balance, accountIdx }) => ({
  ...state,
  accounts: updateArrayItem(state.accounts, accountIdx, {
    balance,
    address: state.accounts[accountIdx].address,
  }),
});

export const confirmMessage = (state, { message }) => ({
  ...state,
  pendingMsgs: [...state.pendingMsgs, message],
});

export const confirmedMessages = (state, { confirmedMsgs, pendingMsgs }) => {
  return {
    ...state,
    pendingMsgs,
    confirmedMsgs: [...confirmedMsgs, ...state.confirmedMsgs],
  };
};

export const error = (state, error) => ({
  ...state,
  error,
});
