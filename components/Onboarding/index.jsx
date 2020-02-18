import React from 'react'
import ChooseWallet from './Choose'
import ConfigureWallet from './Configure'
import { useWalletProvider } from '../../WalletProvider'

export default () => {
  const { walletType } = useWalletProvider()
  return (
    <>
      {walletType ? (
        <ConfigureWallet walletType={walletType} />
      ) : (
        <ChooseWallet />
      )}
    </>
  )
}
