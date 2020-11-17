import React from 'react'
import ConfirmMsgCreate from '../../../components/Msig/Create/Confirm'
import RequireWallet from '../../../lib/RequireWallet'

const Confirm = () => {
  return (
    <RequireWallet>
      <ConfirmMsgCreate />
    </RequireWallet>
  )
}

export default Confirm
