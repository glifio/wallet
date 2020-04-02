import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useWalletProvider } from '../../WalletProvider'
import { resetState as resetRdxState } from '../../store/actions'

export default () => {
  const dispatch = useDispatch()
  const { resetState } = useWalletProvider()
  return useCallback(() => {
    dispatch(resetRdxState())
    resetState()
  }, [resetState, dispatch])
}
