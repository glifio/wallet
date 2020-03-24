import React from 'react'
import PropTypes from 'prop-types'
import { Box, Card, Glyph, Text } from '../../Shared'

const Import = ({
  onClick,
  glyphAcronym,
  title,
  description,
  Icon,
  tag,
  ...props
}) => (
  <Card
    display='flex'
    flexDirection='column'
    justifyContent='space-between'
    alignContent='space-between'
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
    <Box>
      <Box display='flex' alignItems='center'>
        <Glyph Icon={Icon} acronym={glyphAcronym} />
        <Text ml={3}>{title}</Text>
      </Box>
      <Box display='block'>
        <Text m={0} color='core.nearblack'>
          {description}
        </Text>
      </Box>
    </Box>
    {tag && (
      <Box
        display='inline-block'
        width='max-content'
        py={2}
        px={4}
        borderRadius={6}
        fontSize={3}
        my={2}
        backgroundColor='status.success.background'
        color='status.success.foreground'
      >
        {tag}
      </Box>
    )}
  </Card>
)

Import.propTypes = {
  onClick: PropTypes.func.isRequired,
  glyphAcronym: PropTypes.string,
  Icon: PropTypes.object,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  tag: PropTypes.string
}

export default Import
