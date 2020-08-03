import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { validateAddressString } from '@openworklabs/filecoin-address'
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
  const networkPrefix = useSelector(state => state.network)
  const [actorIDAdress, setActorIDAdress] = useState('')
  const [err, setErr] = useState('')

  const onClick = () => {
    if (!validateAddressString(actorIDAdress)) return setErr('Invalid address.')
    if (actorIDAdress[0] !== networkPrefix) return setErr('Network mismatch.')
    if (Number(actorIDAdress[1]) !== 0)
      return setErr('Invalid Actor Address. Second character must be 0.')
    dispatch(setMsigActor(actorIDAdress))
    const searchParams = new URLSearchParams(router.query)
    router.push(`/msig/home?${searchParams.toString()}`)
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
          placeholder='t01'
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
