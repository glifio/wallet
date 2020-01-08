import { useEffect, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import BigNumber from 'bignumber.js'

import { switchWallet, updateBalance, updateProgress } from './store/actions'

export const useFilecoin = () => {
  const dispatch = useDispatch()

  /* poll for details about balance of single selected account */
  const { selectedWalletIdx, wallets, walletProvider } = useSelector(state => {
    return {
      selectedWalletIdx: state.selectedWalletIdx,
      wallets: state.wallets,
      walletProvider: state.walletProvider
    }
  })

  const timeout = useRef()

  const pollBalance = useCallback(() => {
    // avoid race conditions (heisman)
    clearTimeout(timeout.current)
    timeout.current = setTimeout(async () => {
      if (!wallets[selectedWalletIdx] || !walletProvider)
        return await pollBalance()

      const latestBalance = await walletProvider.getBalance(
        wallets[selectedWalletIdx].address
      )
      if (!latestBalance.isEqualTo(wallets[selectedWalletIdx].balance)) {
        dispatch(updateBalance(latestBalance))
      }
      await pollBalance()
    }, 3000)

    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current)
      }
    }
  }, [wallets, dispatch, selectedWalletIdx, walletProvider])

  useEffect(pollBalance, [selectedWalletIdx, pollBalance])
  return
}

export const useWallets = () => {
  const { wallets, selectedWallet, walletProvider } = useSelector(state => {
    const selectedWallet =
      state.wallets.length > state.selectedWalletIdx
        ? state.wallets[state.selectedWalletIdx]
        : { balance: new BigNumber('0'), address: '' }

    return {
      wallets: state.wallets,
      selectedWallet,
      walletProvider: state.walletProvider
    }
  })

  const dispatch = useDispatch()

  const selectWallet = useCallback(
    async index => {
      dispatch(switchWallet(index))
      const balance = await walletProvider.getBalance(wallets[index].address)
      dispatch(updateBalance(balance, index))
    },
    [wallets, dispatch, walletProvider]
  )

  return {
    wallets,
    selectWallet,
    selectedWallet
  }
}

export const useBalance = index =>
  useSelector(state => {
    // optional account index param, default to selected account
    const walletIdx = index ? index : state.selectedWalletIdx
    return state.wallets[walletIdx]
      ? state.wallets[walletIdx].balance
      : new BigNumber(0)
  })

export const useTransactions = index =>
  useSelector(state => {
    return {
      pending: state.pendingMsgs,
      confirmed: state.confirmedMsgs
    }
  })

export const useProgress = () => {
  const dispatch = useDispatch()
  const setProgress = useCallback(
    async progress => {
      dispatch(updateProgress(progress))
    },
    [dispatch]
  )
  const progress = useSelector(state => state.progress)
  return { progress, setProgress }
}
