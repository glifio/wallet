import React from 'react'
import PropTypes from 'prop-types'
import { Box, Card, Glyph, Text } from '../../Shared'

const Import = ({ onClick, glyphAcronym, title, description, ...props }) => (
  <Card
    css={`
      cursor: pointer;
      transition: 0.13s ease-in-out;
      &:hover {
        transform: scale(1.05);
      }
    `}
    role='button'
    onClick={onClick}
    {...props}
  >
    <Box display='flex' alignItems='center'>
      <Glyph acronym={glyphAcronym} />
      <Text ml={3}>{title}</Text>
    </Box>
    <Box display='block'>
      <Text mb={0} color='core.nearblack'>
        {description}
      </Text>
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
