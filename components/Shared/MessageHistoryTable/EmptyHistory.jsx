import React from 'react'
import Box from '../Box'
import { Text } from '../Typography'

export default () => {
  return (
    <Box border={1}>
      <Text ml={2} my='0' color='core.darkgray'>
        You currently don&apos;t have any transactions
      </Text>
      <Text ml={2} my='0' color='core.lightgray'>
        Want some? Start sending and receiving FIL!
      </Text>
    </Box>
  )
}
