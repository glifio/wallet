import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { validateAddressString } from '@glif/filecoin-address'
import styled from 'styled-components'
import { useMsigProvider } from '../../MsigProvider'
import {
  Box,
  Button,
  Input,
  OnboardCard,
  StepHeader,
  StyledLink,
  Text,
  Title
} from '../Shared'
import { IconLedger } from '../Shared/Icons'

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
`

const ACTOR_NOT_FOUND_ERR = 'Actor not found'

const EnterActorAddress = () => {
  const { setMsigActor, errors: msigActorErrors } = useMsigProvider()
  const router = useRouter()
  const [err, setErr] = useState('')
  const input = useRef('')

  useEffect(() => {
    if (!err && msigActorErrors.actorNotFound) {
      setErr(ACTOR_NOT_FOUND_ERR)
    }
  }, [err, setErr, msigActorErrors.actorNotFound])

  const onSubmit = e => {
    e.preventDefault()
    setErr('')
    const trimmedAddr = input.current.value.trim()
    if (!validateAddressString(trimmedAddr)) return setErr('Invalid address.')
    if (Number(trimmedAddr[1]) !== 0 && Number(trimmedAddr[1]) !== 2)
      return setErr('Invalid Actor Address. Second character must be 0 or 2.')
    setMsigActor(trimmedAddr)

    // commented out for testing for now - TODO - comment back in when ready
    // const searchParams = new URLSearchParams(router.query)
    // router.push(`/vault/home?${searchParams.toString()}`)
  }

  return (
    <Box padding={[2, 3, 5]}>
      <Form autoComplete='on' onSubmit={onSubmit}>
        <OnboardCard>
          <StepHeader currentStep={4} totalSteps={4} Icon={IconLedger} />
          <Title mt={3}>Actor ID</Title>
          <Text>Please input your actor ID address below to continue </Text>
          <Input.Text
            ref={input}
            autoComplete='on'
            label='ID'
            name='ID'
            placeholder='f02'
            error={err}
          />

          <br />
          <Box display='flex' flexDirection='row' alignItems='center'>
            <Text mr={3}>Don&apos;t have a multisig actor ID?</Text>
            <StyledLink href='/vault/create?network=f' name='Create one' />
          </Box>
        </OnboardCard>
        <Box
          mt={6}
          display='flex'
          flexDirection='row'
          justifyContent='space-between'
          width='100%'
          maxWidth={13}
        >
          <Button
            title='Back'
            onClick={router.back}
            variant='secondary'
            mr={2}
          />
          <Button title='Submit' type='submit' variant='primary' ml={2} />
        </Box>
      </Form>
    </Box>
  )
}

export default EnterActorAddress
