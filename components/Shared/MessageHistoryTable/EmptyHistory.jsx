import React from 'react'
import Box from '../Box'
import { Text } from '../Typography'

export default () => {
  return (
    <Box border={1} p={2}>
      <Text ml={2} my='0' color='core.darkgray'>
        How do I see my transaction history?
      </Text>
      <Text ml={2} my='0' color='core.lightgray'>
        If you're seeing this, you haven't sent or received any FIL from this
        account yet. When you do, your transactions will appear.
      </Text>
    </Box>
  )
}
