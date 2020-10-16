import React from 'react'
import RequireWallet from '../../lib/RequireWallet'
import EnterActorAddress from '../../components/Msig/EnterActorAddress'

export default () => {
  return (
    <RequireWallet>
      <EnterActorAddress />
    </RequireWallet>
  )
}
