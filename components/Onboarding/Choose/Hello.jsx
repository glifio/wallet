import React from 'react'
import { Box, Text, BigTitle } from '../../Shared'

export default ({ ...props }) => (
  <Box {...props}>
    <BigTitle>Hello.</BigTitle>
    <Text maxWidth={11}>How would you like to access Glif?</Text>
  </Box>
)
