import { useCallback } from 'react'
import { useWalletProvider } from '@glif/wallet-provider-react'

export default function useReset() {
  const { resetState } = useWalletProvider()

  return useCallback(() => {
    resetState()
  }, [resetState])
}
