import React from 'react'
import { ErrorView } from '../../components/Shared'

const WalletDown = () => {
  return (
    <ErrorView
      title='Oops! Something went wrong.'
      description="We've been notified of the problem, but feel free to reach out to squad@infinitescroll.org with any questions or concerns."
    />
  )
}

export default WalletDown
