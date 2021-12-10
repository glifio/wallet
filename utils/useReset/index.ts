import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useWalletProvider } from '@glif/wallet-provider-react'
import { resetState as resetRdxState } from '../../store/actions'

export default function useReset() {
  const dispatch = useDispatch()
  const { resetState } = useWalletProvider()

  return useCallback(() => {
    dispatch(resetRdxState())
    resetState()
  }, [resetState, dispatch])
}
