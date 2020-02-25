import React from 'react'
import { Box, Text, Title } from '../../Shared'

export default ({ ...props }) => (
  <Box {...props}>
    <Title>Hello.</Title>
    <Text>How do you want to use Filament?</Text>
  </Box>
)
