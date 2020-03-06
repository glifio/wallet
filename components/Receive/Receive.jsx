import React from 'react'
import styled from 'styled-components'
import { Address, Box, Glyph, Text, ButtonClose } from '../Shared'
import { ADDRESS_PROPTYPE } from '../../customPropTypes'

const Wrapper = styled(Box).attrs(() => ({
  display: 'flex',
  flexDirection: 'column',
  border: 'none',
  p: 3,
  borderRadius: 2,
  borderWidth: 1,
  bg: 'background.screen'
}))``

const Receive = ({ address }) => {
  return (
    <Wrapper>
      <Box display='flex' alignItems='center' justifyContent='space-between'>
        <Box display='flex' alignItems='center'>
          <Glyph
            acronym='Rc'
            color='background.screen'
            borderColor='core.primary'
            backgroundColor='core.primary'
          />

          <Text color='core.primary' ml={2}>
            Receive Filecoin
          </Text>
        </Box>
        <Box display='flex' alignItems='center'>
          <ButtonClose ml={2} type='button' onClick={() => {}} />
        </Box>
      </Box>
      <Text my={6}>
        To receive Filecoin, share your address with the sender
      </Text>
      <Address address={address} />
      <Text my={6}>Or share this QR code:</Text>
    </Wrapper>
  )
}

Receive.propTypes = {
  address: ADDRESS_PROPTYPE
}

export default Receive
