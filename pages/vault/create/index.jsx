import React from 'react'
import RequireWallet from '../../../lib/RequireWallet'
import CreateMsig from '../../../components/Msig/Create'

const Create = () => {
  return (
    <RequireWallet>
      <CreateMsig />
    </RequireWallet>
  )
}

export default Create
