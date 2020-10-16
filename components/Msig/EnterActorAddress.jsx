import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { validateAddressString } from '@glif/filecoin-address'
import {
  Box,
  Button,
  Input,
  OnboardCard,
  StepHeader,
  Text,
  Title
} from '../Shared'
import { IconLedger } from '../Shared/Icons'
import { setMsigActor } from '../../store/actions'

const EnterActorAddress = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [actorIDAdress, setActorIDAdress] = useState('')
  const [err, setErr] = useState('')

  const onClick = () => {
    const trimmedAddr = actorIDAdress.trim()
    if (!validateAddressString(trimmedAddr)) return setErr('Invalid address.')
    if (Number(trimmedAddr[1]) !== 0 && Number(trimmedAddr[1]) !== 2)
      return setErr('Invalid Actor Address. Second character must be 0 or 2.')
    dispatch(setMsigActor(trimmedAddr))
    const searchParams = new URLSearchParams(router.query)
    router.push(`/vault/home?${searchParams.toString()}`)
  }

  return (
    <Box
      display='flex'
      flexDirection='column'
      minHeight='100vh'
      justifyContent='center'
      alignItems='center'
      padding={[2, 3, 5]}
    >
      <OnboardCard width='100%' maxWidth={13}>
        <StepHeader currentStep={4} totalSteps={4} Icon={IconLedger} />
        <Title mt={3}>Actor ID</Title>
        <Text>Please input your actor ID address below to continue </Text>
        <Input.Text
          value={actorIDAdress}
          onChange={e => setActorIDAdress(e.target.value)}
          label='ID'
          placeholder='f01'
          error={err}
        />
      </OnboardCard>
      <Box
        mt={6}
        display='flex'
        flexDirection='row'
        justifyContent='space-between'
        width='100%'
        maxWidth={13}
      >
        <Button title='Back' onClick={router.back} variant='secondary' mr={2} />
        <Button title='Submit' onClick={onClick} variant='primary' ml={2} />
      </Box>
    </Box>
  )
}

export default EnterActorAddress
