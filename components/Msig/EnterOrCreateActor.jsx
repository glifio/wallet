import React, { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { validateAddressString } from '@glif/filecoin-address'
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
import { setMsigActor } from '../../store/actions'
import styled from 'styled-components'

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
`

const EnterActorAddress = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [err, setErr] = useState('')
  const input = useRef('')

  const onSubmit = e => {
    e.preventDefault()
    const trimmedAddr = input.current.value.trim()
    if (!validateAddressString(trimmedAddr)) return setErr('Invalid address.')
    if (Number(trimmedAddr[1]) !== 0 && Number(trimmedAddr[1]) !== 2)
      return setErr('Invalid Actor Address. Second character must be 0 or 2.')
    dispatch(setMsigActor(trimmedAddr))
    const searchParams = new URLSearchParams(router.query)
    router.push(`/vault/home?${searchParams.toString()}`)
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
