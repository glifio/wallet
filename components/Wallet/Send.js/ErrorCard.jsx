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
      my={2}
      bg='card.error.background'
      color='card.error.foreground'
    >
      <Box
        display='flex'
        flexDirection='row'
        border='none'
        width='auto'
        justifyContent='space-between'
      >
        <Box display='flex' alignItems='center'>
          <Glyph
            acronym='Er'
            textAlign='center'
            color='card.error.background'
            borderColor='card.error.foreground'
            backgroundColor='card.error.foreground'
          />
          <Text ml={2}>Error</Text>
        </Box>
      </Box>
      <Box
        display='flex'
        flexWrap='wrap'
        justifyContent='space-between'
        alignItems='center'
        flexGrow='2'
      >
        <Text>{error}</Text>
        <Button
          onClick={reset}
          title='Clear'
          height='100%'
          backgroundColor='core.transparent'
          borderColor='status.fail.foreground'
          color='status.fail.foreground'
          py={2}
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
