import React, { useState } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import { space, layout, typography, border, color } from 'styled-system'
import {
  Box,
  Title,
  Text,
  HeaderGlyph,
  Header,
  InlineBox,
  Menu,
  MenuItem
} from '../Shared'

const ButtonSignUp = styled.button`
  outline: none;
  border: 0;
  cursor: pointer;
  background: transparent;
  transition: 0.18s ease-in;

  &:hover {
    opacity: 0.8;
  }
  ${space}
  ${layout}
  ${typography}
  ${border} 
  ${color}
`

const InputEmail = styled.input`
  outline: 0;
  border: 0;
  ::placeholder {
    color: #444;
  }
  ${space}
  ${layout}
  ${typography}
  ${border}
  ${color}
`

export default () => {
  const [error, setError] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [email, setEmail] = useState('')
  const postToMailChimp = async () => {
    if (!email) {
      setError('Please enter a valid email')
      return
    }
    setError('')
    try {
      const res = await axios.post(
        `https://mailchimp-proxy.openworklabs.com/saft?email=${email.trim()}`
      )

      if (res.data.indexOf('success') === -1) {
        if (res.data.indexOf('already subscribed') > -1) {
          setError("You're already subscribed. :)")
          return
        }

        setError(
          "There was an issue getting you subscribed. We're on the case!"
        )
      } else {
        setSubscribed(true)
      }
    } catch (error) {
      setError(error.toString())
    }
  }

  return (
    <Box
      display='flex'
      flexWrap='wrap'
      minHeight='90vh'
      alignItems='center'
      justifyContent='center'
      flexGrow='1'
    >
      <Box
        display='flex'
        maxWidth={13}
        width={['100%', '100%', '40%']}
        flexDirection='column'
        alignItems='flex-start'
        alignContent='center'
        mb={4}
        p={4}
      >
        <HeaderGlyph
          alt='Source: https://unsplash.com/photos/OVO8nK-7Rfs'
          text='VAULT'
          imageUrl='/imgvault.png'
          color='white'
          fill='white'
        />

        <Box
          display='flex'
          flexDirection='column'
          mt={[2, 4, 4]}
          alignSelf='center'
          textAlign='left'
        >
          <Header>Use your Ledger device to hold your Filecoin SAFT.</Header>
          <Title mt={3} lineHeight='140%'>
            <InlineBox
              backgroundColor='status.warning.background'
              color='status.warning.foreground'
              py={1}
              px={3}
              mr={2}
              my={3}
              fontSize={4}
              borderRadius={6}
            >
              Launching this week
            </InlineBox>
          </Title>
        </Box>
      </Box>
      <Box
        display='flex'
        flexDirection='column'
        width='auto'
        minWidth={11}
        flexGrow='1'
        flexWrap='wrap'
        justifyContent='space-evenly'
        margin='auto'
      >
        <Box
          display='flex'
          justifyContent='center'
          flexDirection='column'
          alignItems='center'
          textAlign='center'
          flexGrow='1'
        />
        <Menu
          position='relative'
          display='flex'
          alignItems='center'
          justifyContent='center'
          flexWrap='wrap'
        >
          <MenuItem
            display='flex'
            flexWrap='wrap'
            justifyContent={['center', 'space-between']}
            width='100%'
            maxWidth={12}
            color='core.darkgray'
            my={[2, 3]}
          >
            <>
              <Menu
                display='flex'
                alignItems='center'
                justifyContent='center'
                flexDirection='column'
              >
                <MenuItem>
                  <Title my={3}>Receive an email when we launch</Title>
                </MenuItem>
                <MenuItem textAlign='center'>
                  <Box
                    display='flex'
                    flexWrap='wrap'
                    justifyContent='center'
                    maxWidth={12}
                  >
                    <InputEmail
                      width='100%'
                      fontSize={4}
                      color='core.nearblack'
                      border={1}
                      borderWidth={2}
                      px={3}
                      py={3}
                      textAlign='center'
                      placeholder='Your email'
                      borderTopLeftRadius={4}
                      borderTopRightRadius={4}
                      onChange={e => setEmail(e.target.value)}
                    />
                    <ButtonSignUp
                      width='100%'
                      color='core.white'
                      bg='core.nearblack'
                      fontSize={4}
                      border={1}
                      borderColor='core.nearblack'
                      borderWidth={2}
                      borderBottomLeftRadius={4}
                      borderBottomRightRadius={4}
                      px={6}
                      py={3}
                      height='max-content'
                      onClick={postToMailChimp}
                    >
                      Submit
                    </ButtonSignUp>
                  </Box>
                  <Box textAlign='center' my={3}>
                    {error && <Text color='red'>{error}</Text>}
                    {subscribed && !error && (
                      <Text color='status.success.background'>
                        You&rsquo;re subscribed. Keep an eye out.
                      </Text>
                    )}
                  </Box>
                </MenuItem>
              </Menu>
            </>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  )
}
