import React from 'react'
import { ErrorView, OneColumnCentered } from '@glif/react-components'
import WalletPage from '../../components/WalletPage'

const UseChrome = () => {
  return (
    <WalletPage>
      <OneColumnCentered>
        <ErrorView
          title='Only Chrome has Ledger support'
          description='Please install Google Chrome to continue using your Ledger device, or choose an alternative setup option'
          linkDisplay='Install Google Chrome.'
          linkhref='https://www.google.com/chrome'
        />
      </OneColumnCentered>
    </WalletPage>
  )
}

export default UseChrome
