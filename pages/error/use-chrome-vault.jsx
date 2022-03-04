import React from 'react'
import { ErrorView } from '@glif/react-components'
import { OneColumnCentered } from '@glif/react-components'
import WalletPage from '../../components/WalletPage'

const UseChromeVault = () => {
  return (
    <WalletPage>
      <OneColumnCentered>
        <ErrorView
          title='You must use Google Chrome to use this feature.'
          description='Please install Google Chrome to continue using the Vault.'
          linkDisplay='Install Google Chrome.'
          linkhref='https://www.google.com/chrome'
        />
      </OneColumnCentered>
    </WalletPage>
  )
}

export default UseChromeVault
