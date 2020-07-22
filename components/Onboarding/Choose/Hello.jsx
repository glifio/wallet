import React from 'react'
import { Box, Text, BigTitle } from '../../Shared'

export default ({ ...props }) => (
  <Box {...props}>
    <BigTitle>Glif</BigTitle>
    <Text mb={1} maxWidth={12}>
      Create or login to your wallet to access the Filecoin network.
    </Text>
  </Box>
)
