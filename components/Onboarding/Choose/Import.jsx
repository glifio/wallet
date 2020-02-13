import React from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  Card,
  Glyph,
  Text
} from '@openworklabs/filecoin-wallet-styleguide'

const Import = ({ onClick, glyphAcronym, title, description, ...props }) => (
  <Card
    css={`
      cursor: pointer;
    `}
    role='button'
    onClick={onClick}
    {...props}
  >
    <Box display='flex' alignItems='center'>
      <Glyph acronym={glyphAcronym} />
      <Text ml={3}>{title}</Text>
    </Box>
    <Box display='block' mt={3}>
      <Text>{description}</Text>
    </Box>
  </Card>
)

Import.propTypes = {
  onClick: PropTypes.func.isRequired,
  glyphAcronym: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
}

export default Import
