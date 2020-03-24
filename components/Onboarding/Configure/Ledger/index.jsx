import React from 'react'
import { Box } from '../../../Shared'

import { useWalletProvider } from '../../../../WalletProvider'
import Step1 from './Step1'
import Step2 from './Step2'

export default () => {
  const { step } = useWalletProvider()
  return (
    <Box
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      width='100%'
      maxWidth={13}
    >
      {step === 1 && <Step1 />}
      {step === 2 && <Step2 />}
    </Box>
  )
}
