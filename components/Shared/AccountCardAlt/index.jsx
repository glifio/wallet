import React from 'react'
import { string, number } from 'prop-types'
import { ADDRESS_PROPTYPE } from '../../../customPropTypes'
import Box from '../Box'
import Glyph from '../Glyph'
import { Text } from '../Typography'
import truncate from '../../../utils/truncateAddress'

const AccountCardAlt = ({ address, index, balance, selected }) => {
  return (
    <Box
      display='flex'
      flexDirection='row'
      justifyContent='space-between'
      width={12}
      height={8}
      border={1}
      borderRadius={2}
      p={3}
      color='colors.core.black'
      boxShadow={1}
    >
      <Box display='flex' alignItems='center' justifyContent='flex-start'>
        <Glyph mr={3} color='colors.core.black' acronym={index} />
        <Box display='flex' flexDirection='column'>
          <Text fontSize={3} my={0}>
            Address
          </Text>
          <Text my={0} fontSize={6}>
            {truncate(address)}
          </Text>
        </Box>
      </Box>
      <Box display='flex' flexDirection='column'>
        <Text fontSize={3} my={0}>
          Balance
        </Text>
        <Text my={0} fontSize={6}>
          {balance}FIL
        </Text>
      </Box>
    </Box>
  )
}

AccountCardAlt.propTypes = {
  address: ADDRESS_PROPTYPE,
  index: number.isRequired,
  balance: string.isRequired
}

export default AccountCardAlt
