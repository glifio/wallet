import React from 'react'
import { string, func, bool } from 'prop-types'
import { ADDRESS_PROPTYPE } from '../../../customPropTypes'
import Box from '../Box'
import Glyph from '../Glyph'
import Button from '../Button'
import { ButtonCopyAccountAddress } from '../IconButtons'
import { BigTitle, Text } from '../Typography'
import truncate from '../../../utils/truncateAddress'
import copyToClipboard from '../../../utils/copyToClipboard'

const AccountCardAlt = ({ address }) => {
  return (
    <Box
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
      width={11}
      height={11}
      borderRadius={2}
      p={3}
      color='card.account.color'
      bg='card.account.background'
      boxShadow={1}
    >
      <Box
        display='flex'
        alignItems='center'
        justifyContent='flex-start'
        color='card.account.color'
      >
        <Glyph mr={3} color='card.account.color' acronym='Ac' />
        <Text>Account</Text>
      </Box>
      <Box color='card.account.color'>
        <BigTitle>{address.slice(0, 4)}</BigTitle>
        <Box display='flex' alignContent='center'>
          <Text margin={0}>{truncate(address)}</Text>
          <ButtonCopyAccountAddress
            border={0}
            onClick={() => copyToClipboard(address)}
          />
        </Box>
      </Box>
    </Box>
  )
}

AccountCardAlt.propTypes = {
  address: ADDRESS_PROPTYPE
}

export default AccountCardAlt
