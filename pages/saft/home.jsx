import React from 'react'
import { InvestorHome } from '../../components/Investor'
import RequireValidInvestorUUID from '../../lib/RequireInvestor'
import RequireWallet from '../../lib/RequireWallet'
import useDesktopBrowser from '../../lib/useDesktopBrowser'

export default () => {
  useDesktopBrowser()

  return (
    <RequireValidInvestorUUID>
      <RequireWallet>
        <InvestorHome />
      </RequireWallet>
    </RequireValidInvestorUUID>
  )
}
