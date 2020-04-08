import React from 'react'
import WarningCard from './WarningCard'

export default () => {
  return (
    <WarningCard
      title='Warning'
      description='We do not recommend you use any browser-based wallet to transact large sums of Filecoin. Glif should only be used with a Ledger hardware wallet.'
      linkDisplay="Why isn't it secure?"
      linkhref='https://www.google.com/chrome'
    />
  )
}
