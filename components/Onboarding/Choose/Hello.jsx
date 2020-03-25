import React from 'react'
import { Box, Text, BigTitle } from '../../Shared'

export default ({ ...props }) => (
  <Box {...props}>
    <BigTitle>Glif</BigTitle>
    <Text maxWidth={12}>Let&rsquo;s start by choosing a wallet option:</Text>
  </Box>
)
