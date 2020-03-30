import React, { useEffect } from 'react'
import ChooseWallet from './Choose'
import ConfigureWallet from './Configure'
import { useWalletProvider } from '../../WalletProvider'
import { Box } from '../Shared'
import useReset from '../../utils/useReset'

export default () => {
  const { walletType } = useWalletProvider()
  const resetState = useReset()
  useEffect(() => {
    resetState()
  }, [resetState])
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
