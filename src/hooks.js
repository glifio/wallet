import { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BigNumber from 'bignumber.js';

import filecoin from './wallet';
import {
  error,
  switchWallet,
  walletList,
  updateBalance,
} from './store/actions';

export const useFilecoin = () => {
  const dispatch = useDispatch();

  /* fetch details about wallets */
  useEffect(() => {
    // TODO: proper loading states
    const getWallets = async () => {
      try {
        const accounts = await filecoin.wallet.getAccounts();
        const wallets = await Promise.all(
          accounts.map(async address => {
            const balance = await filecoin.getBalance(address);
            return {
              balance,
              address,
            };
          })
        );
        dispatch(walletList(wallets));
      } catch (err) {
        dispatch(error(err));
      }
    };
    getWallets();
  }, [dispatch]);

  /* poll for details about balance of single selected account */
  const { selectedWalletIdx, wallets } = useSelector(state => {
    return {
      selectedWalletIdx: state.selectedWalletIdx,
      wallets: state.wallets,
    };
  });

  const timeout = useRef();

  const pollBalance = useCallback(() => {
    // avoid race conditions (heisman)
    clearTimeout(timeout.current);
    timeout.current = setTimeout(async () => {
      if (!wallets[selectedWalletIdx]) return await pollBalance();

      const latestBalance = await filecoin.getBalance(
        wallets[selectedWalletIdx].address
      );
      if (!latestBalance.isEqualTo(wallets[selectedWalletIdx].balance)) {
        dispatch(updateBalance(latestBalance));
      }
      await pollBalance();
    }, 3000);

    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [wallets, dispatch, selectedWalletIdx]);

  useEffect(pollBalance, [selectedWalletIdx, pollBalance]);
  return;
};

export const useWallets = () => {
  const { wallets, selectedWallet } = useSelector(state => {
    const selectedWallet =
      state.wallets.length > state.selectedWalletIdx
        ? state.wallets[state.selectedWalletIdx]
        : { balance: new BigNumber('0'), address: '' };

    return {
      wallets: state.wallets,
      selectedWallet,
    };
  });

  const dispatch = useDispatch();

  const selectWallet = useCallback(
    async index => {
      dispatch(switchWallet(index));
      const balance = await filecoin.getBalance(wallets[index].address);
      dispatch(updateBalance(balance, index));
    },
    [wallets, dispatch]
  );

  return {
    wallets,
    selectWallet,
    selectedWallet,
  };
};

export const useBalance = index =>
  useSelector(state => {
    // optional account index param, default to selected account
    const walletIdx = index ? index : state.selectedWalletIdx;
    return state.wallets[walletIdx]
      ? state.wallets[walletIdx].balance
      : new BigNumber(0);
  });

export const useTransactions = index =>
  useSelector(state => {
    return {
      pending: state.pendingMsgs,
      confirmed: state.confirmedMsgs,
    };
  });
