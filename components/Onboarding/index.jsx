import React from 'react'
import { useSelector } from 'react-redux'
import ChooseWallet from './Choose'
import ConfigureWallet from './Configure'

export default () => {
  const walletType = useSelector(state => state.walletType)
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
