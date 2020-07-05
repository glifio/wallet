import React from 'react'
import Ledger from '../Onboarding/Configure/Ledger'
import { Box } from '../Shared'

export default () => {
  return (
    <Box
      display='flex'
      flexDirection='column'
      minHeight='100vh'
      justifyContent='center'
      alignItems='center'
      padding={[2, 3, 5]}
    >
      <Ledger msig />
    </Box>
  )
}
