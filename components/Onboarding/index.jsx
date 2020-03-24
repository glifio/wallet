import React from 'react'
import ChooseWallet from './Choose'
import ConfigureWallet from './Configure'
import { useWalletProvider } from '../../WalletProvider'
import { Box } from '../Shared'

export default () => {
  const { walletType } = useWalletProvider()
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
