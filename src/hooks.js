import { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import filecoin from './wallet';
import {
  error,
  newAccount,
  switchAccount,
  walletList,
  updateBalance,
} from './store/actions';
import BigNumber from '@openworklabs/filecoin-wallet-provider/node_modules/bignumber.js';

export const useFilecoin = () => {
  const dispatch = useDispatch();

  /* fetch details about accounts */
  useEffect(() => {
    // TODO: proper loading states
    const getAccounts = async () => {
      try {
        const addresses = await filecoin.wallet.getAccounts();
        const accounts = await Promise.all(addresses.map(address => {
          return new Promise(async (resolve, reject) => {
            const balance = await filecoin.getBalance(address)
            resolve({ balance: balance, address: address })
          });
        }))
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
      accounts: state.accounts
    };
  });

  const timeout = useRef();

  const pollBalance = useCallback(() => {
    // avoid race conditions (heisman)
    clearTimeout(timeout.current);
    timeout.current = setTimeout(async () => {
      if (!accounts[selectedAccount]) return await pollBalance()

      const latestBalance = await filecoin.getBalance(accounts[selectedAccount].address);
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
    return {
      accounts: state.accounts,
      selectedAccount: state.selectedAccount,
      isLoggedIn: state.isLoggedIn,
    };
  });

  const dispatch = useDispatch();

  const selectAccount = useCallback(
    async index => {
      dispatch(switchAccount(index));
      const balance = await filecoin.getBalance(accounts[index].address);
      dispatch(updateBalance(balance));
    },
    [accounts, dispatch]
  );

  const addAccount = async () => {
    const account = await filecoin.wallet.newAccount();
    dispatch(newAccount(account));
  };

  const logIn = () => { };

  return {
    accounts,
    addAccount,
    selectAccount,
    selectedAccount,
    isLoggedIn,
    logIn,
  };
};

export const useBalance = () => useSelector(state => {
  return state.accounts[state.selectedAccount] ?
    state.accounts[state.selectedAccount].balance :
    new BigNumber(0)
});
