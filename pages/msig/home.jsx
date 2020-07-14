import React from 'react'
import { useRouter } from 'next/router'
import { MsigHome } from '../../components/Msig'
import RequireWallet from '../../lib/RequireWallet'

export default () => {
  const router = useRouter()
  if (!process.env.IS_DEV) {
    router.replace('/')
    return <></>
  }
  return (
    // <RequireWallet>
    <MsigHome />
    // </RequireWallet>
  )
}
