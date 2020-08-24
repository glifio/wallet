import React, { useState } from 'react'
import { func } from 'prop-types'
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
import { setInvestorId } from '../../store/actions'
import { isValidInvestorId } from '../../utils/investor'

const EnterInvestorId = ({ setWalletType }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [localInvestorId, setLocalInvestorId] = useState('')
  const [error, setError] = useState('')

  const onClick = () => {
    if (isValidInvestorId(localInvestorId)) {
      dispatch(setInvestorId(localInvestorId))
    } else {
      setError('Invalid investor ID.')
    }
  }

  return (
    <Box width='100%' maxWidth={13}>
      <OnboardCard>
        <StepHeader currentStep={1} totalSteps={5} Icon={IconLedger} />
        <Title mt={3}>Investor ID</Title>
        <Text>Please input your investor ID below to continue </Text>
        <Input.Text
          value={localInvestorId}
          onChange={e => setLocalInvestorId(e.target.value)}
          label='ID'
          placeholder='ID'
          error={error}
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
          onClick={() => {
            setWalletType(null)
            router.replace('/')
          }}
          variant='secondary'
          mr={2}
        />
        <Button title='Submit' onClick={onClick} variant='primary' ml={2} />
      </Box>
    </Box>
  )
}

EnterInvestorId.propTypes = {
  setWalletType: func.isRequired
}

export default EnterInvestorId
