import React from 'react'
import PropTypes from 'prop-types'
import { Box, Glyph, Card, Text, Button } from '../../Shared'

const ErrorCard = ({ error, reset }) => {
  return (
    <Card
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
      border='none'
      width='auto'
      ml={4}
      mr={4}
      bg='card.error.background'
    >
      <Box display='flex' flexDirection='row'>
        <Glyph acronym='Er' color='' />
        <Box flexGrow='2' ml={2} mr={2}>
          <Text>Oops - something went wrong.</Text>
          <Text>{error}</Text>
        </Box>
        <Button
          onClick={reset}
          title='Try Again'
          buttonStyle='tertiary'
          height='100%'
          css={`
            align-self: flex-end;
          `}
        />
      </Box>
    </Card>
  )
}

ErrorCard.propTypes = {
  reset: PropTypes.func.isRequired,
  error: PropTypes.string
}

ErrorCard.defaultProps = {
  error: ''
}

export default ErrorCard
