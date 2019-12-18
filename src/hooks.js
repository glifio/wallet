import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux'

import filecoinWallet from './wallet'
import { error, newAccount, switchAccount, walletList } from './store/actions'

export const useAccounts = () => {
  const [fetchedAccounts, setFetchedAccounts] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    const getAccounts = async () => {
      try {
        const accounts = await filecoinWallet.getAccounts();
        dispatch(walletList(accounts));
      } catch(err) {
        dispatch(error(err))
      }
      setFetchedAccounts(true)
    }
    if (!fetchedAccounts) getAccounts()
  }, [dispatch, fetchedAccounts])

  const selectAccount = useCallback((account) =>
    dispatch(switchAccount(account)), [dispatch])

  const addAccount = async () => {
    const account = await filecoinWallet.newAccount()
    dispatch(newAccount(account))
  }

  const logIn = () => {}

  const { accounts, isLoggedIn, selectedAccount } = useSelector(state => {
    return {
      accounts: state.accounts,
      selectedAccount: state.selectedAccount,
      isLoggedIn: state.isLoggedIn,
    };
  });

  return {
    accounts,
    addAccount,
    selectAccount,
    selectedAccount,
    isLoggedIn,
    logIn,
  };
}