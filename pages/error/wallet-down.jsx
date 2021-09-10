import React from 'react'
import { ErrorView } from '../../components/Shared'

const WalletDown = () => {
  return (
    <ErrorView
      title='Oops! Something went wrong.'
      description="We've been notified of the problem."
      linkDisplay='Follow @openworklabs for updates.'
      linkhref='https://twitter.com/openworklabs'
    />
  )
};

export default WalletDown;
