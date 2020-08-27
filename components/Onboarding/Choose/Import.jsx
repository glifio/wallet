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
  <>
    <Card
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
      alignContent='space-between'
      height={7}
      p={2}
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
      <Box display='flex' alignItems='center' textAlign='center'>
        <Glyph Icon={Icon} acronym={glyphAcronym} border={0} />
        <Text ml={4} my={0}>
          {title}
        </Text>
      </Box>
    </Card>
  </>
)

Import.defaultProps = {
  description: '',
  Icon: {},
  glyphAcronym: ''
}

Import.propTypes = {
  onClick: PropTypes.func.isRequired,
  glyphAcronym: PropTypes.string,
  Icon: PropTypes.object,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  tag: PropTypes.string
}

export default Import
