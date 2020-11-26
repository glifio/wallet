import React from 'react'
import RequireWallet from '../../lib/RequireWallet'
import EnterOrCreateActor from '../../components/Msig/EnterOrCreateActor'

const Choose = () => {
  return (
    <RequireWallet>
      <EnterOrCreateActor />
    </RequireWallet>
  )
}

export default Choose
