import React from 'react'
import { ErrorView } from '../../components/Shared'

export default () => {
  return (
    <ErrorView
      title='Ledger only supports Chrome'
      description='Please install Google Chrome to continue using your Ledger device, or choose an alternative setup option'
      linkDisplay='Install Google Chrome.'
      linkhref='https://www.google.com/chrome'
    />
  )
}
