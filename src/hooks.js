import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux'

import filecoinWallet from './wallet'
import { error, newAccount, switchAccount, walletList } from './store/actions'

export const useFilecoin = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    // TODO: proper loading states
    const getAccounts = async () => {
      try {
        const accounts = await filecoinWallet.getAccounts();
        dispatch(walletList(accounts));
      } catch (err) {
        dispatch(error(err))
      }
    }
    getAccounts()
  }, [dispatch])

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

  const selectAccount = useCallback((account) =>
    dispatch(switchAccount(account)), [dispatch])

  const addAccount = async () => {
    const account = await filecoinWallet.newAccount()
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