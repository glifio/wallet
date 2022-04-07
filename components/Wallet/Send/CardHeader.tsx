import React from 'react'
import PropTypes from 'prop-types'
import { FilecoinNumber } from '@glif/filecoin-number'
import { Box, Glyph, Text } from '@glif/react-components'
import truncateAddress from '../../../utils/truncateAddress'
import makeFriendlyBalance from '../../../utils/makeFriendlyBalance'
import {
  ADDRESS_PROPTYPE,
  FILECOIN_NUMBER_PROP
} from '../../../customPropTypes'

export const CardHeader = ({ address, balance, glyphAcronym }) => {
  return (
    <header>
      <Box
        p='1.5em'
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        borderTopRightRadius={3}
        borderTopLeftRadius={3}
        bg='core.primary'
        color='core.white'
      >
        <Box display='flex' flexDirection='row' alignItems='center'>
          <Glyph acronym={glyphAcronym} color='white' mr={3} />
          <Box display='flex' flexDirection='column' alignItems='flex-start'>
            <Text m={0}>From</Text>
            <Text m={0}>{truncateAddress(address)}</Text>
          </Box>
        </Box>
        <Box display='flex' flexDirection='column' alignItems='flex-start'>
          <Text m={0}>Balance</Text>
          <Text m={0}>{makeFriendlyBalance(balance, 6, true)} FIL</Text>
        </Box>
      </Box>
    </header>
  )
}

CardHeader.propTypes = {
  address: ADDRESS_PROPTYPE,
  balance: FILECOIN_NUMBER_PROP,
  glyphAcronym: PropTypes.string
}

CardHeader.defaultProps = {
  msig: false,
  msigBalance: new FilecoinNumber('', 'attofil'),
  glyphAcronym: 'Ms'
}
