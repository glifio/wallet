import React from 'react'
import { Box } from '../../../Shared'

import { useWalletProvider } from '../../../../WalletProvider'
import Step1 from './Step1'
import Step2 from './Step2'

export default () => {
  const { ledger } = useWalletProvider()
  return (
    <Box display='flex' flexDirection='column'>
      {ledger.connectedSuccess ? <Step2 /> : <Step1 />}
    </Box>
  )
}
