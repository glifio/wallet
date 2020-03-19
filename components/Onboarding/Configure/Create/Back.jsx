import React from 'react'
import PropTypes from 'prop-types'

import { useWalletProvider } from '../../../../WalletProvider'
import { Box, Button, Card, Text, Glyph } from '../../../Shared'

const Back = ({ setReturningHome }) => {
  const { setWalletType } = useWalletProvider()
  return (
    <Box display='flex' flexDirection='column' alignItems='center' mt={8}>
      <Card width={11} height={11}>
        <Glyph acronym='Bk' />
        <Text>Do you really wish to exit onboarding?</Text>
        <Text>You will be taken back to the home screen.</Text>
      </Card>
      <Box mt={6} display='flex' flexDirection='row' justifyContent='center'>
        <Button
          title='No, keep onboarding'
          onClick={() => setReturningHome(false)}
          variant='secondary'
          mr={2}
        />
        <Button
          title='Yes, take me home'
          onClick={() => setWalletType(null)}
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
