import { useEffect, useCallback, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useWalletProvider } from '../WalletProvider'
import useWallet from '../WalletProvider/useWallet'
import { updateBalance } from '../store/actions'
import reportError from '../utils/reportError'

// Polls lotus for up to date balances about the user's selected wallet
export default () => {
  const dispatch = useDispatch()
  const { walletProvider } = useWalletProvider()
  const wallet = useWallet()
  const timeout = useRef()

  const pollBalance = useCallback(
    (address, balance, provider) => {
      // avoid race conditions (heisman)
      clearTimeout(timeout.current)
      timeout.current = setTimeout(async () => {
        try {
          const latestBalance = await provider.getBalance(address)
          if (!latestBalance.isEqualTo(balance)) {
            dispatch(updateBalance(latestBalance, wallet.index))
          }
          return pollBalance(wallet.address, latestBalance, provider)
        } catch (err) {
          reportError(4, true, err.message, err.stack)
        }
      }, 3000)

      return () => {
        if (timeout.current) {
          clearTimeout(timeout.current)
        }
      }
    },
    [dispatch, wallet.index, wallet.address]
  )

  useEffect(() => {
    if (wallet.index >= 0 && walletProvider) {
      pollBalance(wallet.address, wallet.balance, walletProvider)
    }
  }, [
    wallet.address,
    wallet.balance,
    wallet.index,
    pollBalance,
    walletProvider
  ])

  return null
}
