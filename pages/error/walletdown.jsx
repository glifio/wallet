import React from 'react'
import {
  Box,
  Button,
  Card,
  Text,
  Title,
  Glyph,
  ButtonClose
} from '../../components/Shared'

export default onClick => {
  return (
    <>
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
              <Title mb={2}>Glif is currently down</Title>
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
              <Text>
                We're aware of the outage and will be back up shortly.
              </Text>
            </Box>
            <Box>
              <Text mb={2}> Follow @glifwallet for updates.</Text>
            </Box>
          </Card>
        </Box>
        <Box>
          <Button mt={5} variant='secondary' title='Back' />
        </Box>
      </Box>
    </>
  )
}
