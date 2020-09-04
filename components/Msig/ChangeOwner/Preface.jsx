import React from 'react'

import { Box, Text } from '../../Shared'

export default () => {
  return (
    <Box>
      <Text textAlign='center' color='core.primary'>
        You&apos;re changing the ownership of your multisig account to a new
        Filecoin address.
      </Text>
      <Text textAlign='center' color='core.primary'>
        Make sure you own the private key to this new Filecoin address.
      </Text>
      <Text textAlign='center' color='core.primary'>
        If you do not own the private key, you will lose access to your funds
        permanently. There is no way to resolve this.
      </Text>
    </Box>
  )
}
