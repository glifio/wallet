import React from 'react'
import PropTypes from 'prop-types'
import { ADDRESS_PROPTYPE } from '../../../customPropTypes'

import { Box, Glyph, CopyAddress, Label } from '../../Shared'

const Address = ({ address, label, isOwnerAddress }) => {
  return (
    <Box display='flex' color={isOwnerAddress ? 'card.account.color' : 'red'}>
      <Box
        display='flex'
        alignItems='center'
        justifyContent='flex-start'
        color='core.darkgray'
        bg='background.messageHistory'
        height={6}
        px={2}
        mr={2}
        my={1}
        borderRadius={2}
      >
        <Glyph mr={3} color='core.nearblack' acronym='Ms' size={5} border={0} />
        <Box flexGrow='1'>
          <Label fontSize={1}>{label}</Label>
          <CopyAddress
            justifyContent='space-between'
            color='core.nearblack'
            address={address}
          />
        </Box>
      </Box>
    </Box>
  )
}

Address.propTypes = {
  address: ADDRESS_PROPTYPE,
  label: PropTypes.string.isRequired,
  isOwnerAddress: PropTypes.bool
}

Address.propTypes = {
  isOwnerAddress: false
}

export default Address
