import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
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
import { setInvestorUUID } from '../../store/actions'

const UUID = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [localInvestorUUID, setLocalInvestorUUID] = useState('')
  const [error, setError] = useState('')

  const onClick = () => {
    // validate investorUUID by hashing it and checking against a valid list
    dispatch(setInvestorUUID(localInvestorUUID))
  }

  return (
    <Box width='100%' maxWidth={13}>
      <OnboardCard>
        <StepHeader
          currentStep={1}
          totalSteps={4}
          Icon={IconLedger}
          error={!!error}
          color={error ? 'status.fail.foreground' : 'core.transparent'}
        />
        <Title mt={3}>Investor ID</Title>
        <Text>Please input your investor ID below to continue </Text>
        <Input.Text
          value={localInvestorUUID}
          onChange={e => setLocalInvestorUUID(e.target.value)}
          label='ID'
          placeholder='twd-dfsads-f21412-fxsm'
        />
      </OnboardCard>
      <Box
        mt={6}
        display='flex'
        flexDirection='row'
        justifyContent='space-between'
        width='100%'
      >
        <Button
          title='Back'
          onClick={() => router.replace('/')}
          variant='secondary'
          mr={2}
        />
        <Button title='Submit' onClick={onClick} variant='primary' ml={2} />
      </Box>
    </Box>
  )
}

export default UUID
