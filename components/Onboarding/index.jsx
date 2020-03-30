import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import ChooseWallet from './Choose'
import ConfigureWallet from './Configure'
import { useWalletProvider } from '../../WalletProvider'
import { Box } from '../Shared'
import { resetState as resetRdxState } from '../../store/actions'

export default () => {
  const { walletType, resetState } = useWalletProvider()
  const dispatch = useDispatch()
  useEffect(() => {
    resetState()
    dispatch(resetRdxState())
  }, [resetState, dispatch])
  return (
    <Box
      display='flex'
      minHeight='100vh'
      justifyContent='center'
      alignContent='center'
      padding={[2, 3, 5]}
    >
      {walletType ? (
        <ConfigureWallet walletType={walletType} />
      ) : (
        <ChooseWallet />
      )}
    </Box>
  )
}
