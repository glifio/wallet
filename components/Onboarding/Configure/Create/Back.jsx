import React from 'react'
import PropTypes from 'prop-types'

import { Box, Button, Card, Text, Glyph } from '../../../Shared'
import useReset from '../../../../utils/useReset'

const Back = ({ setReturningHome }) => {
  const resetState = useReset()
  return (
    <Box display='flex' flexDirection='column' alignItems='center' mt={8}>
      <Card
        display='flex'
        flexDirection='column'
        justifyContent='space-between'
        width='100%'
      >
        <Glyph acronym='Bk' />
        <Text>Do you really wish to exit onboarding?</Text>
        <Text>You will be taken back to the home screen.</Text>
      </Card>
      <Box mt={6} display='flex' justifyContent='space-between' width='100%'>
        <Button
          title='No, keep onboarding'
          onClick={() => setReturningHome(false)}
          variant='secondary'
          mr={2}
        />
        <Button
          title='Yes, take me home'
          onClick={() => resetState()}
          variant='primary'
          ml={2}
        />
      </Box>
    </Box>
  )
}

Back.propTypes = {
  setReturningHome: PropTypes.func.isRequired
}

export default Back
