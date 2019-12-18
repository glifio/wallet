import { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux'

import filecoin from './wallet'
import { error, newAccount, switchAccount, walletList, updateBalance } from './store/actions'

export const useFilecoin = () => {
  const dispatch = useDispatch()

  /* fetch details about accounts */
  useEffect(() => {
    // TODO: proper loading states
    const getAccounts = async () => {
      try {
        const accounts = await filecoin.wallet.getAccounts();
        dispatch(walletList(accounts));
        const balance = await filecoin.getBalance(accounts[0]);
        dispatch(updateBalance(balance));
      } catch (err) {
        dispatch(error(err))
      }
    }
    getAccounts()
  }, [dispatch])

  /* poll for details about balance of single selected account */
  const { balanceFromRedux, selectedAccount } = useSelector(state => {
    return {
      balanceFromRedux: state.balance,
      selectedAccount: state.selectedAccount,
    };
  });

  const timeout = useRef();

  const pollBalance = useCallback(() => {
    clearTimeout(timeout.current)
    timeout.current = setTimeout(async () => {
      const latestBalance = await filecoin.getBalance(selectedAccount);
      // balances from filecoin.getBalance are javascript BigNumbers https://github.com/MikeMcl/bignumber.js/
      if (!latestBalance.isEqualTo(balanceFromRedux)) {
        dispatch(updateBalance(latestBalance));
      }
      await pollBalance();
    }, 3000);

    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [balanceFromRedux, dispatch, selectedAccount]);

  useEffect(pollBalance, [selectedAccount, pollBalance]);

  return
}

export const useAccounts = () => {
  const { accounts, isLoggedIn, selectedAccount } = useSelector(state => {
    return {
      accounts: state.accounts,
      selectedAccount: state.selectedAccount,
      isLoggedIn: state.isLoggedIn,
    };
  });

  const dispatch = useDispatch()

  const selectAccount = useCallback(async (account) => {
    dispatch(switchAccount(account))
    const balance = await filecoin.getBalance(account);
    dispatch(updateBalance(balance));
  }, [dispatch])


  const addAccount = async () => {
    const account = await filecoin.newAccount();
    dispatch(newAccount(account))
  }

  const logIn = () => {}

  return {
    accounts,
    addAccount,
    selectAccount,
    selectedAccount,
    isLoggedIn,
    logIn,
  };
}

// for readability in the UI
// returns the balance of the single selected account
export const useBalance = () => useSelector(({balance}) => balance)
