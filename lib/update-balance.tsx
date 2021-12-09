import { useCallback } from 'react'
import LotusRPCEngine from '@glif/filecoin-rpc-client'
import { useWalletProvider, useWallet } from '@glif/react-components'
import { FilecoinNumber } from '@glif/filecoin-number'
import useSWR from 'swr'

import reportError from '../utils/reportError'

export const useBalancePoller = () => {
  const { selectedWalletIdx, updateBalance } = useWalletProvider()
  const wallet = useWallet()
  const fetcher = useCallback(
    async (address, prevBalance, selectedWalletIdx) => {
      try {
        const lCli = new LotusRPCEngine({
          apiAddress: process.env.LOTUS_NODE_JSONRPC
        })
        const latestBalance = new FilecoinNumber(
          await lCli.request<string>('WalletBalance', address),
          'attofil'
        )

        if (!latestBalance.isEqualTo(prevBalance)) {
          updateBalance(latestBalance, selectedWalletIdx)
        }

        return latestBalance
      } catch (err) {
        reportError(4, false, err.message, err.stack)
      }
    },
    [updateBalance]
  )

  const { data } = useSWR(
    wallet.address ? [wallet.address, wallet.balance, selectedWalletIdx] : null,
    fetcher
  )

  return data
}

// Polls lotus for up to date balances about the user's selected wallet
function Updatebalance() {
  useBalancePoller()

  return null
}

export default Updatebalance
