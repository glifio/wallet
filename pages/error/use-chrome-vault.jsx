import React from 'react'
import { ErrorView } from '@glif/react-components'

const UseChromeVault = () => {
  return (
    <ErrorView
      title='You must use Google Chrome to use this feature.'
      description='Please install Google Chrome to continue using the Vault.'
      linkDisplay='Install Google Chrome.'
      linkhref='https://www.google.com/chrome'
    />
  )
}

export default UseChromeVault
