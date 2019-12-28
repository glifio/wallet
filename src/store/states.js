import updateArrayItem from './utils/updateArrayItem';

export const initialState = {
  wallets: [],
  selectedWalletIdx: 5,
  error: null,
  pendingMsgs: [],
  confirmedMsgs: [],
};

export const walletList = (state, { wallets }) => ({
  ...state,
  wallets,
  selectedWalletIdx: 5,
});

export const switchWallet = (state, { index }) => ({
  ...state,
  selectedWalletIdx: index,
});

export const updateBalance = (state, { balance, selectedWalletIdx }) => ({
  ...state,
  wallet: updateArrayItem(state.wallets, selectedWalletIdx, {
    balance,
    address: state.wallets[selectedWalletIdx].address,
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
