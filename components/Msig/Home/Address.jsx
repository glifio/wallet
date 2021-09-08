import React from 'react'
import PropTypes from 'prop-types'
import { ADDRESS_PROPTYPE } from '../../../customPropTypes'

import { Box, Glyph, CopyAddress, Label, IconLedger } from '../../Shared'

const Address = ({ setWidth, address, label, glyphAcronym }) => {
  return (
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
      maxWidth={setWidth ? 'none' : 11}
      width={setWidth || 'auto'}
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
        <CopyAddress color='core.nearblack' address={address} />
      </Box>
    </Box>
  )
}

Address.propTypes = {
  address: ADDRESS_PROPTYPE,
  label: PropTypes.string.isRequired,
  glyphAcronym: PropTypes.string
}

export default Address
