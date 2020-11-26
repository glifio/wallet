import React from 'react'
import { MsigHome } from '../../components/Msig'
import RequireWallet from '../../lib/RequireWallet'

const Home = () => {
  return (
    <RequireWallet>
      <MsigHome />
    </RequireWallet>
  )
}

export default Home
