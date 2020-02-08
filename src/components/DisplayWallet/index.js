import React from 'react'
import { AccountPicker } from '../Shared'
import MessageCreator from './MessageCreator'
// import TransactionHistory from './TransactionHistory'
import { Wrapper } from '../StyledComponents'
import { BalanceBanner } from '../Shared'

export default () => {
  return (
    <Wrapper>
      <AccountPicker />
      <BalanceBanner />
      <MessageCreator />
      {/* <TransactionHistory /> */}
    </Wrapper>
  )
}
