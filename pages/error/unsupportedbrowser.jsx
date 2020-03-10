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
            borderColor='silver'
            bg='card.error.background'
            color='card.error.foreground'
            height={300}
            ml={2}
          >
            <Box display='flex' alignItems='center'>
              <Glyph acronym='!' />
            </Box>
            <Box>
              <Text mb={2}>Sorry, Glif doesn't support Firefox</Text>
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
              <Title>Oops!</Title>
            </Box>
            <Box>
              <Text mb={2}>
                Please download the latest of Chrome to continue.
              </Text>
              <Button mt={3} variant='primary' title='Download' />
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
