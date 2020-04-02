import React, { useState } from 'react'
import Router from 'next/router'
import Link from 'next/link'
import styled from 'styled-components'
import axios from 'axios'
import { space, layout, typography, border, color } from 'styled-system'
import {
  Box,
  Menu,
  MenuItem,
  Title,
  Text,
  IconGlif
} from '../components/Shared'

const TitleCopy = styled(Title)`
  /* Used this: https://stackoverflow.com/questions/14431411/pure-css-to-make-font-size-responsive-based-on-dynamic-amount-of-characters */
  font-size: calc(48px + (64 - 40) * (100vw - 360px) / (1440 - 360));
  /* word-break: break-all; */
`

const Image = styled.img`
  z-index: -999;
`

const ButtonSignUp = styled.button`
  outline: none;
  border: 0;
  cursor: pointer;
  background: transparent;
  transition: 0.18s ease-in;

  &:hover {
    transform:scale(1.05);
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

const ExtLink = styled.a`
text-decoration: none;
${space}
${layout}
${typography}
${border}
${color}`

const postToMailChimp = async (setSubscribed, setError, email) => {
  const url = `http://localhost:80/${email}`

  try {
    const res = await axios.post(
      url,
      { email },
      { headers: { 'Content-Type': 'application/json' } }
    )

    // TODO—make this nicer
    if (res.data.indexOf('already subscribed') > -1) {
      setError("You're already subscribed")
      return
    }
    if (res.data.indexOf('error') > -1) {
      setError('We having an issue getting you subscribed.')
      return
    }

    setSubscribed(true)
    setError('')
  } catch (error) {
    setError(error.toString())
  }
}

// eslint-disable-next-line react/prop-types
const ShowSignUp = ({ setSubscribed, setError }) => {
  const [email, setEmail] = useState('')

  return (
    <>
      <Box display='flex' flexWrap='wrap' width={['100%', 'auto']}>
        <InputEmail
          width={['100%', 'auto']}
          fontSize={[4, 5, 6]}
          color='core.nearblack'
          // bg='core.nearblack'
          border={1}
          borderWidth={2}
          px={3}
          py={3}
          textAlign='center'
          placeholder='Your email, please'
          borderTopLeftRadius={[0, 2]}
          borderBottomLeftRadius={[0, 2]}
          onChange={e => setEmail(e.target.value)}
        />
        <ButtonSignUp
          width={['100%', 'auto']}
          color='core.white'
          bg='core.nearblack'
          fontSize={[4, 5, 6]}
          border={1}
          borderColor='core.nearblack'
          borderWidth={2}
          borderTopRightRadius={[0, 2]}
          borderBottomRightRadius={[0, 2]}
          px={6}
          py={3}
          height='max-content'
          onClick={() => postToMailChimp(setSubscribed, setError, email)}
        >
          Submit
        </ButtonSignUp>
      </Box>
    </>
  )
}

export default () => {
  const [clicked, setClicked] = useState(false)
  const [error, setError] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  return (
    <section name='Introduction'>
      <Box
        display='block'
        margin='0 auto'
        py={[2, 4]}
        pl={[3, 4, 6, 7]}
        pr={[3, 4, 6]}
        maxWidth='1680px'
        width='100%'
        minHeight='100vh'
        // bg='core.white'
      >
        <Menu
          display='flex'
          alignItems='center'
          justifyContent='flex-start'
          flexWrap='wrap'
        >
          <MenuItem>
            <Box
              display='inline-block'
              py={3}
              mr={[4, 6, 7, 8]}
              px={2}
              borderRadius={4}
              css={`
                background: linear-gradient(180deg, #ff8d3b 0%, #ffeb80 100%);
                border-radius: 16px;
              `}
            >
              <IconGlif size={[6, 7, 8]} />
            </Box>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3, 5]}>
            <TitleCopy>is</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3, 5]}>
            <TitleCopy>an</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3, 5]}>
            <TitleCopy>interoperable</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3, 5]}>
            <TitleCopy>set</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3, 5]}>
            <TitleCopy>of</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3, 5]}>
            <TitleCopy>tools</TitleCopy>
          </MenuItem>

          <MenuItem height='100px' mr='8%' my={[2, 3, 5]}>
            <Image
              width='200px'
              alt='Credit & Source: https://www.behance.net/gallery/14115935/Lapka-PEM-Achievement-Stones'
              src='/static/imgtools.png'
            />
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3, 5]}>
            <TitleCopy>for</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3, 5]}>
            <TitleCopy>the</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3, 5]}>
            <TitleCopy>Filecoin</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3, 5]}>
            <TitleCopy>network.</TitleCopy>
          </MenuItem>
          <MenuItem
            display='flex'
            flexWrap='wrap'
            alignItems='baseline'
            justifyContent='space-between'
            width='100%'
            color='core.darkgray'
            my={[2, 3]}
          >
            <>
              {clicked ? (
                <>
                  <Menu display='flex' alignItems='center'>
                    <MenuItem>
                      <ShowSignUp
                        setSubscribed={setSubscribed}
                        setError={setError}
                      />

                      {error ? (
                        <Title mt={2} color='red'>
                          {error}
                        </Title>
                      ) : (
                        <Title mt={2}>Glif don't spam! Unsub whenever.</Title>
                      )}
                      {subscribed && (
                        <Title mt={2} color='status.success.background'>
                          You're subscribed. Keep an eye out.
                        </Title>
                      )}
                    </MenuItem>
                  </Menu>
                  <ButtonSignUp
                    width={['100%', 'auto']}
                    background='transparent'
                    color='core.nearblack'
                    fontSize={[4, 5, 6]}
                    border={1}
                    px={6}
                    py={2}
                    my={2}
                    height='max-content'
                    borderRadius={6}
                    onClick={() => setClicked(false)}
                  >
                    Cancel
                  </ButtonSignUp>
                </>
              ) : (
                <>
                  <Text fontSize={[4, 5, 6]} my={2}>
                    Be the first to learn when we launch
                  </Text>

                  <ButtonSignUp
                    background='transparent'
                    color='core.nearblack'
                    fontSize={[4, 5, 6]}
                    border={1}
                    px={6}
                    py={2}
                    height='max-content'
                    borderRadius={6}
                    onClick={() => setClicked(true)}
                  >
                    Sign Up
                  </ButtonSignUp>
                </>
              )}
            </>
          </MenuItem>
        </Menu>
      </section>
      <section name='Glif Wallet'>
        <Menu
          display='flex'
          alignItems='center'
          justifyContent='flex-start'
          flexWrap='wrap'
          my={8}
        >
          <MenuItem display='flex' alignItems='center' width='100%' mb={5}>
            <Box
              display='inline-block'
              py={2}
              mr={4}
              px={3}
              borderRadius={4}
              css={`
                background: linear-gradient(
                  180deg,
                  #1a1a1a 2.72%,
                  rgba(128, 128, 128, 0.6) 100%
                );
                border-radius: 16px;
              `}
            >
              <IconGlif
                fill='#fff'
                size={[6, 7, 8]}
                css={`
                  transform: rotate(-90deg);
                `}
              />
            </Box>
            <TitleCopy>Wallet</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3, 5]}>
            <TitleCopy>A</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3, 5]}>
            <TitleCopy>lightweight</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3]} height='120px'>
            <Image width='300px' alt='' src='/static/imgwallet.png' />
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3, 5]}>
            <TitleCopy>interface</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3, 5]}>
            <TitleCopy>for</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3, 5]}>
            <TitleCopy>sending</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3, 5]}>
            <TitleCopy>and</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3, 5]}>
            <TitleCopy>receiving</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3, 5]}>
            <TitleCopy>Filecoin</TitleCopy>
          </MenuItem>
        </Menu>
      </section>
      <section name='Glif Node'>
        <Menu
          display='flex'
          alignItems='center'
          justifyContent='flex-start'
          flexWrap='wrap'
          my={8}
        >
          <MenuItem display='flex' alignItems='center' width='100%' mb={5}>
            <Box
              display='inline-block'
              py={2}
              mr={4}
              px={3}
              borderRadius={4}
              css={`
                background: linear-gradient(
                  180deg,
                  #1a1a1a 2.72%,
                  rgba(128, 128, 128, 0.6) 100%
                );
                border-radius: 16px;
              `}
            >
              <IconGlif
                fill='#fff'
                size={[6, 7, 8]}
                css={`
                  transform: rotate(-90deg);
                `}
              />
            </Box>
            <TitleCopy>Node</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3, 5]}>
            <TitleCopy>A</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3, 5]}>
            <TitleCopy>fully</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3, 5]}>
            <TitleCopy>managed</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3, 5]}>
            <TitleCopy>Filecoin</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3, 5]}>
            <TitleCopy>node</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3, 5]}>
            <TitleCopy>you</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3]} height='120px'>
            <Image
              width='200px'
              alt='Credit & Source: https://www.nontemporary.com/post/187451107349/rob-nick-carter'
              src='/static/imgnode.png'
            />
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3, 5]}>
            <TitleCopy>can</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3, 5]}>
            <TitleCopy>deploy</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3, 5]}>
            <TitleCopy>from</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3, 5]}>
            <TitleCopy>the</TitleCopy>
          </MenuItem>

          <MenuItem mr='8%' my={[2, 3, 5]}>
            <TitleCopy>command-line</TitleCopy>
          </MenuItem>
        </Menu>
      </section>
      <section name='Made by OWL'>
        <Menu>
          <MenuItem display='flex' alignItems='center' my={[2, 3, 5]}>
            <IconGlif size={6} />
            <Title my={0} mx={2}>
              is an
              <ExtLink
                href='https://www.openworklabs.com'
                color='core.primary'
                borderBottom={1}
                borderWidth={3}
                fontSize={4}
                mx={1}
                target='_blank'
              >
                OWL
              </ExtLink>{' '}
              project {'\u00A9'} 2020
            </Title>
          </MenuItem>
        </Menu>
      </section>
    </Box>
  )
}
