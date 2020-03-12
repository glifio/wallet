import React from 'react'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import Box from '../Box'
import Button from '../Button'
import Card from '../Card'
import Glyph from '../Glyph'
import { StyledATag } from '../Link'
import { Text, Title } from '../Typography'

const ErrorView = ({ description, linkhref, linkDisplay, title }) => {
  const router = useRouter()
  const sendHome = () => {
    const params = new URLSearchParams(router.query)
    router.replace(`/onboard?${params.toString()}`)
  }
  return (
    <Box
      display='flex'
      flexDirection='column'
      width='100%'
      height='90vh'
      alignItems='center'
      justifyContent='center'
    >
      <Box display='flex' justifyContent='center'>
        <Card
          display='flex'
          flexDirection='column'
          justifyContent='space-between'
          borderColor='card.error.background'
          bg='card.error.background'
          color='card.error.foreground'
          height={300}
          ml={2}
        >
          <Box display='flex' alignItems='center'>
            <Glyph acronym='!' />
          </Box>
          <Box>
            <Title mb={2}>{title}</Title>
          </Box>
        </Card>
        <Card
          display='flex'
          flexDirection='column'
          justifyContent='space-between'
          borderColor='silver'
          height={300}
          ml={2}
        >
          <Box display='flex' alignItems='center'>
            <Text>{description}</Text>
          </Box>
          <Box>
            <StyledATag rel='noopener' target='_blank' href={linkhref}>
              {linkDisplay}
            </StyledATag>
          </Box>
        </Card>
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
  linkhref: PropTypes.string.isRequired,
  linkDisplay: PropTypes.string.isRequired
}

export default ErrorView
