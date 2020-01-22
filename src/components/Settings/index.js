import React, { useState } from 'react'

import { Wrapper } from '../StyledComponents'
import { AccountPicker } from '../Shared'
import AccountAndNetworkPanel from './AccountAndNetworkPanel'

export default () => {
  const [loadingAccounts, setLoadingAccounts] = useState(false)
  return (
    <Wrapper>
      <AccountPicker loadingAccounts={loadingAccounts} />
      <AccountAndNetworkPanel
        loadingAccounts={loadingAccounts}
        setLoadingAccounts={setLoadingAccounts}
      />
    </Wrapper>
  )
}
