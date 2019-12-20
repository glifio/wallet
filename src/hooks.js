import { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BigNumber from 'bignumber.js';

import filecoin from './wallet';
import {
  error,
  newAccount,
  switchAccount,
  walletList,
  updateBalance,
} from './store/actions';

export const useFilecoin = () => {
  const dispatch = useDispatch();

  /* fetch details about accounts */
  useEffect(() => {
    // TODO: proper loading states
    const getAccounts = async () => {
      try {
        const addresses = await filecoin.wallet.getAccounts();
        const accounts = await Promise.all(
          addresses.map(async address => {
            const balance = await filecoin.getBalance(address);
            return {
              balance,
              address,
            };
          })
        );
        dispatch(walletList(accounts));
      } catch (err) {
        dispatch(error(err));
      }
    };
    getAccounts();
  }, [dispatch]);

  /* poll for details about balance of single selected account */
  const { selectedAccount, accounts } = useSelector(state => {
    return {
      selectedAccount: state.selectedAccount,
      accounts: state.accounts,
    };
  });

  const timeout = useRef();

  const pollBalance = useCallback(() => {
    // avoid race conditions (heisman)
    clearTimeout(timeout.current);
    timeout.current = setTimeout(async () => {
      if (!accounts[selectedAccount]) return await pollBalance();

      const latestBalance = await filecoin.getBalance(
        accounts[selectedAccount].address
      );
      if (!latestBalance.isEqualTo(accounts[selectedAccount].balance)) {
        dispatch(updateBalance(latestBalance));
      }
      await pollBalance();
    }, 3000);

    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [accounts, dispatch, selectedAccount]);

  useEffect(pollBalance, [selectedAccount, pollBalance]);
  return;
};

export const useAccounts = () => {
  const { accounts, isLoggedIn, selectedAccount } = useSelector(state => {
    const selectedAccount =
      state.accounts.length > state.selectedAccount
        ? state.accounts[state.selectedAccount]
        : { balance: new BigNumber('0'), address: '' };
    return {
      accounts: state.accounts,
      selectedAccount,
      isLoggedIn: state.isLoggedIn,
    };
  });

  const dispatch = useDispatch();

  const selectAccount = useCallback(
    async index => {
      dispatch(switchAccount(index));
      const balance = await filecoin.getBalance(accounts[index].address);
      dispatch(updateBalance(balance, index));
    },
    [accounts, dispatch]
  );

  const addAccount = async () => {
    const account = await filecoin.wallet.newAccount();
    const balance = await filecoin.getBalance(account);
    dispatch(newAccount({ account, balance }));
  };

  const logIn = () => {};

  return {
    accounts,
    addAccount,
    selectAccount,
    selectedAccount,
    isLoggedIn,
    logIn,
  };
};

export const useBalance = index =>
  useSelector(state => {
    // optional account index param, default to selected account
    const accountIdx = index ? index : state.selectedAccount;
    return state.accounts[accountIdx]
      ? state.accounts[accountIdx].balance
      : new BigNumber(0);
  });
