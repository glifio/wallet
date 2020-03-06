import React from 'react'
import Box from '../Box'
import { Text } from '../Typography'

export default () => {
  return (
    <Box>
      <Text my='0' color='core.nearblack'>
        How do I see my transaction history?
      </Text>
      <Text my='0' color='core.darkgray'>
        If you&rsquo;re seeing this, you haven&rsquo;t sent or received any FIL
        from this account yet. When you do, your transactions will appear.
      </Text>
    </Box>
  )
}
