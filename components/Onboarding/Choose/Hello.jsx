import React from 'react'
import { Box, Text, BigTitle } from '../../Shared'

export default ({ ...props }) => (
  <Box {...props}>
    <BigTitle>Welcome to Glif</BigTitle>
    <Text maxWidth={12}>How do you want to create your wallet?</Text>
  </Box>
)
