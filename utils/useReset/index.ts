import { useCallback } from 'react'
import { useWalletProvider } from '@glif/react-components'

export default function useReset() {
  const { resetState } = useWalletProvider()

  return useCallback(() => {
    resetState()
  }, [resetState])
}
