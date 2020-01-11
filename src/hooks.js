import { useEffect, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import BigNumber from 'bignumber.js'

import filecoin from './wallet'
import {
  error,
  switchWallet,
  walletList,
  updateBalance,
  updateProgress,
  fetchedConfirmedMessagesSuccess,
  fetchedConfirmedMessagesFailure,
  fetchingConfirmedMessages
} from './store/actions'

export const useFilecoin = () => {
  const dispatch = useDispatch()

  /* fetch details about wallets */
  useEffect(() => {
    // TODO: proper loading states
    const getWallets = async () => {
      try {
        const accounts = await filecoin.wallet.getAccounts()
        const wallets = await Promise.all(
          accounts.map(async address => {
            const balance = await filecoin.getBalance(address)
            return {
              balance,
              address
            }
          })
        )
        dispatch(walletList(wallets))
      } catch (err) {
        dispatch(error(err))
      }
    }
    getWallets()
  }, [dispatch])

  /* poll for details about balance of single selected account */
  const { selectedWalletIdx, wallets } = useSelector(state => {
    return {
      selectedWalletIdx: state.selectedWalletIdx,
      wallets: state.wallets
    }
  })

  const timeout = useRef()

  const pollBalance = useCallback(() => {
    // avoid race conditions (heisman)
    clearTimeout(timeout.current)
    timeout.current = setTimeout(async () => {
      if (!wallets[selectedWalletIdx]) return await pollBalance()

      const latestBalance = await filecoin.getBalance(
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
  }, [wallets, dispatch, selectedWalletIdx])

  useEffect(pollBalance, [selectedWalletIdx, pollBalance])
  return
}

export const useWallets = () => {
  const { wallets, selectedWallet } = useSelector(state => {
    const selectedWallet =
      state.wallets.length > state.selectedWalletIdx
        ? state.wallets[state.selectedWalletIdx]
        : { balance: new BigNumber('0'), address: '' }

    return {
      wallets: state.wallets,
      selectedWallet
    }
  })

  const dispatch = useDispatch()

  const selectWallet = useCallback(
    async index => {
      dispatch(switchWallet(index))
      const balance = await filecoin.getBalance(wallets[index].address)
      dispatch(updateBalance(balance, index))
    },
    [wallets, dispatch]
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

export const useTransactions = index => {
  const dispatch = useDispatch()

  const {
    confirmed,
    links,
    loading,
    loadedSuccess,
    loadedFailurepending,
    pending,
    selectedWallet
  } = useSelector(state => {
    const selectedWallet =
      state.wallets.length > state.selectedWalletIdx
        ? state.wallets[state.selectedWalletIdx]
        : { balance: new BigNumber('0'), address: '' }
    return {
      confirmed: state.messages.confirmed,
      links: state.messages.links,
      pending: state.messages.pending,
      loading: state.messages.loading,
      loadedSuccess: state.messages.loadedSuccess,
      loadedFailure: state.messages.loadedFailure,
      selectedWallet
    }
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetch(
          `${
            process.env.REACT_APP_CHAINWATCH_API_SERVER_ENDPOINT
          }/api/v0/messages/${selectedWallet.address}?page=${index || 0}`
        )
        const { data, links, status } = await result.json()
        if (status === 'success') {
          dispatch(fetchedConfirmedMessagesSuccess(data, links))
        } else if (status === 'failed') {
          dispatch(fetchedConfirmedMessagesFailure(data))
        }
      } catch (err) {
        dispatch(fetchedConfirmedMessagesFailure(err))
      }
    }
    if (selectedWallet.address) {
      dispatch(fetchingConfirmedMessages())
      fetchData()
    }
  }, [selectedWallet.address, index, dispatch])

  return {
    confirmed,
    links,
    loading,
    loadedSuccess,
    loadedFailurepending,
    pending
  }
}

export const useError = () =>
  useSelector(state => {
    return {
      error: state.error
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
