import React from 'react'
import WarningCard from './WarningCard'

export const WarningScreen = () => {
  return (
    <WarningCard
      title='Ledger only supports Chrome'
      description='Please install Google Chrome to continue using your Ledger device, or choose an alternative setup option'
      linkDisplay='Install Google Chrome.'
      linkhref='https://www.google.com/chrome'
    />
  )
}
