import React from 'react'
import { ErrorView } from '@glif/react-components'
import { OneColumnCentered } from '@glif/react-components'
import WalletPage from '../../components/WalletPage'

const NodeDisconnected = () => {
  return (
    <WalletPage>
      <OneColumnCentered>
        <ErrorView
          title='Disconnected!'
          description='We had trouble connecting to our Filecoin nodes. Sorry for the inconvenience, please try again in a few hours!'
        />
      </OneColumnCentered>
    </WalletPage>
  )
}

export default NodeDisconnected
