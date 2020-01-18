import React from 'react'

import {
  BalanceBanner,
  FilecoinLogo,
  BalanceInBanner
} from '../StyledComponents'

import { useBalance } from '../../hooks'

export default () => {
  const balance = useBalance()
  return (
    <BalanceBanner>
      <FilecoinLogo src='/filecoin.png' alt='' />
      <BalanceInBanner>{balance.toString()} FIL</BalanceInBanner>
    </BalanceBanner>
  )
}
