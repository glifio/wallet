import React from 'react'
import AccountPicker from './AccountPicker'
import MessageCreator from './MessageCreator'
import TransactionHistory from './TransactionHistory'
import {
  BalanceBanner,
  FilecoinLogo,
  BalanceInBanner,
  Wrapper
} from '../StyledComponents'
import { useBalance } from '../../hooks'

export default () => {
  const balance = useBalance()
  return (
    <Wrapper>
      <AccountPicker />
      <BalanceBanner>
        <FilecoinLogo src='/filecoin.png' alt='' />
        <BalanceInBanner>{balance.toString()} FIL</BalanceInBanner>
      </BalanceBanner>
      <MessageCreator />
      <TransactionHistory />
    </Wrapper>
  )
}
