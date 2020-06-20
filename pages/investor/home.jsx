import React from 'react'
import { InvestorHome } from '../../components/Investor'
import RequireValidInvestorUUID from '../../lib/RequireInvestor'
import RequireWallet from '../../lib/RequireWallet'

export default () => {
  return (
    <RequireValidInvestorUUID>
      <RequireWallet>
        <InvestorHome />
      </RequireWallet>
    </RequireValidInvestorUUID>
  )
}
