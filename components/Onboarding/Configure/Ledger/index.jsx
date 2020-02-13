import React from 'react'
import { Box } from '@openworklabs/filecoin-wallet-styleguide'

import Step1 from './Step1'
import Step2 from './Step2'

export default () => {
  return (
    <Box display='flex' flexDirection='column'>
      <Step2 />
    </Box>
  )
}
