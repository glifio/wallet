import React, { useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import {
  Box,
  Button,
  StyledATag,
  Input,
  Label,
  Title,
  Text,
  HeaderGlyph,
  Header,
  Card
} from '../Shared'
import InvestorOnboard from './InvestorOnboard'

export default () => {
  const [error, setError] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [email, setEmail] = useState('')
  const router = useRouter()

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

        setError('We ran into an error. Please check your email and try again.')
      } else {
        setSubscribed(true)
      }
    } catch (error) {
      setError(error.toString())
    }
  }

  const onClick = () => {
    const searchParams = new URLSearchParams(router.query)
    searchParams.set('setup', 'true')
    router.replace(`/vault?${searchParams.toString()}`)
  }

  const searchParams = new URLSearchParams(router.query)
  const showSetup = !!searchParams.get('setup')

  return (
    <>
      {showSetup ? (
        <InvestorOnboard />
      ) : (
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
              text='Vault'
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
              <Header fontSize={6}>
                Use your Ledger device to manage your Filecoin SAFT.
              </Header>
              <Title mt={3} color='core.darkgray'>
                This website does not store any personal or secret information.
              </Title>
              <Title mt={3} color='core.darkgray'>
                Your private keys remain on your Ledger and are never seen by
                the browser.
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
            alignItems='center'
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

            <Box
              display='flex'
              flexDirection='column'
              p={3}
              mt={[5, 0, 0]}
              minHeight={10}
              width='100%'
              maxWidth={13}
              alignItems='center'
              justifyContent='center'
              borderRadius={2}
              bg='background.screen'
            >
              {' '}
              <Text color='core.darkgray' textAlign='center' p='0'>
                Begin your SAFT setup
              </Text>
              <Button
                onClick={onClick}
                variant='primary'
                title='Get started'
                my={3}
                boxShadow={2}
              />
              <StyledATag
                fontSize={2}
                my={3}
                target='_blank'
                href='https://paper.dropbox.com/doc/Self-Custodied-SAFT-Guide--A65usBCOBC6H0c2e_JUleP63Ag-dHxZu59oAeSw03RrRpCrd'
                rel='noopener'
              >
                Need help? Follow along with this guided tutorial.
              </StyledATag>
            </Box>

            <Box
              display='flex'
              flexDirection='column'
              p={3}
              mt={5}
              minHeight={10}
              width='100%'
              maxWidth={13}
              alignItems='center'
              justifyContent='center'
            >
              <Box
                display='flex'
                width='100%'
                justifyContent='space-between'
                flexWrap='wrap'
                mb={3}
              >
                <Text
                  color='core.nearblack'
                  textAlign='center'
                  p='0'
                  m={0}
                  textTransform='uppercase'
                >
                  STAY IN THE LOOP
                </Text>
                <Text color='core.darkgray' textAlign='left' p='0' m={0}>
                  Receive important email updates from us
                </Text>
              </Box>
              <Card
                p={0}
                border={0}
                width='100%'
                maxWidth={13}
                height={7}
                display='flex'
                flexDirection='column'
                justifyContent='space-between'
                boxShadow={2}
              >
                <Box
                  display='flex'
                  flexDirection='row'
                  justifyContent='space-between'
                  flexWrap='wrap'
                >
                  <Box
                    position='relative'
                    display='flex'
                    flexGrow='1'
                    flexWrap='wrap'
                    alignItems='center'
                  >
                    <Input.Base
                      width='100%'
                      height={7}
                      flexShrink='1'
                      pr={8}
                      overflow='scroll'
                      textAlign='right'
                      placeholder='Your Email'
                      onChange={e => setEmail(e.target.value)}
                    />
                    <Button
                      position='absolute'
                      right='0'
                      type='submit'
                      title='Join'
                      variant='secondary'
                      mx={2}
                      px={4}
                      onClick={postToMailChimp}
                      bg='transparent'
                    />
                  </Box>
                </Box>
              </Card>
              <Box display='flex' width='100%' minHeight={6} pt={3} px={2}>
                {error && (
                  <Text m={0} color='red'>
                    {error}
                  </Text>
                )}

                {subscribed && !error && (
                  <Label display='inline-block' color='core.darkgray' m={0}>
                    You&rsquo;re subscribed. Keep an eye out.
                  </Label>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  )
}

// nu
// display='flex'
// alignItems='center'
// justifyContent='center'
// flexDirection='column'
// >
// <MenuItem>
//   <Title my={3}>Receive an email for updates</Title>
// </MenuItem>
// <MenuItem textAlign='center'>
//   <Box
//     display='flex'
//     flexWrap='wrap'
//     justifyContent='center'
//     maxWidth={12}
//   >
//     <InputEmail
//       width='100%'
//       fontSize={4}
//       color='core.nearblack'
//       border={1}
//       borderWidth={2}
//       px={3}
//       py={3}
//       textAlign='center'
//       placeholder='Your email'
//       borderTopLeftRadius={4}
//       borderTopRightRadius={4}
//       onChange={e => setEmail(e.target.value)}
//     />
//     <ButtonSignUp
//       width='100%'
//       color='core.white'
//       bg='core.nearblack'
//       fontSize={4}
//       border={1}
//       borderColor='core.nearblack'
//       borderWidth={2}
//       borderBottomLeftRadius={4}
//       borderBottomRightRadius={4}
//       px={6}
//       py={3}
//       height='max-content'
//       onClick={postToMailChimp}
//     >
//       Submit
//     </ButtonSignUp>
//   </Box>
//   <Box textAlign='center' my={3}>
//     {error && <Text color='red'>{error}</Text>}
//     {subscribed && !error && (
//       <Text color='status.success.background'>
//         You&rsquo;re subscribed. Keep an eye out.
//       </Text>
//     )}
//   </Box>
// </MenuItem>
// </Menu>
