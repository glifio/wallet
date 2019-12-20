import updateArrayItem from './utils/updateArrayItem'

export const initialState = {
  accounts: [],
  selectedAccount: 0,
  isLoggedIn: false,
  error: null,
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

export const updateBalance = (state, { balance }) => ({
  ...state,
  accounts: updateArrayItem(
    state.accounts,
    { index: state.selectedAccount, item: { balance: balance } }
  )
});

export const error = (state, error) => ({
  ...state,
  error,
});
