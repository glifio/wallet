import React from 'react'
import { useRouter } from 'next/router'
import { InvestorHome } from '../../components/Investor'
import RequireValidInvestorUUID from '../../lib/RequireInvestor'
import RequireWallet from '../../lib/RequireWallet'

export default () => {
  const router = useRouter()
  if (!process.env.IS_DEV) {
    router.replace('/')
    return <></>
  }
  return (
    <RequireValidInvestorUUID>
      <RequireWallet>
        <InvestorHome />
      </RequireWallet>
    </RequireValidInvestorUUID>
  )
}
