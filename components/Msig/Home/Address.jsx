import React from 'react'
import PropTypes from 'prop-types'
import { ADDRESS_PROPTYPE } from '../../../customPropTypes'

import { Box, Glyph, CopyAddress, Label, IconLedger } from '../../Shared'

const Address = ({ address, label, isOwnerAddress, glyphAcronym }) => {
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
        {glyphAcronym ? (
          <Glyph
            mr={3}
            color='core.nearblack'
            acronym={glyphAcronym}
            size={5}
            border={0}
          />
        ) : (
          <Glyph
            justifyContent='flex-end'
            alignSelf='flex-end'
            mb='1px'
            mr={3}
            size={5}
            Icon={IconLedger}
            color='core.nearblack'
            bg='transparent'
            fill='#444'
            border={0}
            css='transform:translateY(-6px)'
          />
        )}
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
  isOwnerAddress: PropTypes.bool,
  glyphAcronym: PropTypes.string
}

Address.propTypes = {
  isOwnerAddress: false
}

export default Address
