import { useEffect, useCallback, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useWalletProvider } from '../WalletProvider'
import useWallet from '../WalletProvider/useWallet'
import { updateBalance } from '../store/actions'

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
        const latestBalance = await provider.getBalance(address)
        if (!latestBalance.isEqualTo(balance)) {
          dispatch(updateBalance(latestBalance, wallet.index))
        }
        await pollBalance(address, latestBalance, provider)
      }, 3000)

      return () => {
        if (timeout.current) {
          clearTimeout(timeout.current)
        }
      }
    },
    [dispatch, wallet.index]
  )

  useEffect(() => {
    if (wallet.index >= 0 && walletProvider) {
      pollBalance(wallet.address, wallet.balance, walletProvider)
    }
  }, [wallet, pollBalance, walletProvider])
}
