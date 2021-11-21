import React from 'react'
import PropTypes from 'prop-types'
import Box from '../Box'
import Button from '../Button'
import Glyph from '../Glyph'
import OnboardCard from '../Card/OnboardCard'
import { StyledATag } from '../Link'
import { Text, Title } from '../Typography'

const ErrorView = ({ description, linkhref, linkDisplay, title }) => {
  const sendHome = () => {
    window.location.href = `${window.location.origin}?network=f`
  }
  return (
    <Box
      display='flex'
      flexDirection='column'
      width='100%'
      height='90vh'
      alignItems='center'
      justifyContent='center'
      p={4}
    >
      <Box display='flex' justifyContent='center' width='100%'>
        <OnboardCard
          display='flex'
          flexDirection='column'
          justifyContent='space-between'
          borderColor='card.error.background'
          bg='card.error.background'
          color='card.error.foreground'
          ml={2}
          minHeight={11}
        >
          <Box>
            <Glyph color='status.fail.foreground' acronym='Er' />
            <Title mt={4} mb={2}>
              {title}
            </Title>
            <Text>{description}</Text>
          </Box>

          <Box>
            <StyledATag
              rel='noopener'
              target='_blank'
              href={linkhref}
              fontSize={3}
              color='core.white'
            >
              {linkDisplay}
            </StyledATag>
          </Box>
        </OnboardCard>
      </Box>
      <Box>
        <Button mt={5} variant='secondary' title='Back' onClick={sendHome} />
      </Box>
    </Box>
  )
}

ErrorView.propTypes = {
  description: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  linkhref: PropTypes.string,
  linkDisplay: PropTypes.string
}

export default ErrorView
