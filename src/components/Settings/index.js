import React from 'react'

import { Wrapper } from '../StyledComponents'
import { AccountPicker } from '../Shared'
import AccountAndNetworkPanel from './AccountAndNetworkPanel'

export default () => {
  return (
    <Wrapper>
      <AccountPicker />
      <AccountAndNetworkPanel />
    </Wrapper>
  )
}
