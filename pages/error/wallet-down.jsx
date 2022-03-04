import React from 'react'
import { ErrorView } from '@glif/react-components'
import { OneColumnCentered } from '@glif/react-components'
import WalletPage from '../../components/SafePage'

const WalletDown = () => {
  return (
    <WalletPage>
      <OneColumnCentered>
        <ErrorView
          title='Oops! Something went wrong.'
          description="We've been notified of the outage and expect to be back up and running again shortly."
        />
      </OneColumnCentered>
    </WalletPage>
  )
}

export default WalletDown
