import React from 'react'

import { useAccounts } from '../hooks'

export default () => {
  const {selectedAccount} = useAccounts()

  return (
    <h5>Account details</h5>
  )
}