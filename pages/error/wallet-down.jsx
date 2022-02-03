import React from 'react'
import { ErrorView } from '@glif/react-components'

const WalletDown = () => {
  return (
    <ErrorView
      title='Oops! Something went wrong.'
      description="We've been notified of the outage and expect to be back up and running again shortly."
    />
  )
}

export default WalletDown
