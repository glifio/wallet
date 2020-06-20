import React from 'react'
import { useSelector } from 'react-redux'
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
import createMailToLink from '../../utils/mailto'
import noop from '../../utils/noop'
import useWallet from '../../WalletProvider/useWallet'

export default () => {
  const router = useRouter()
  const { investor } = useSelector(state => ({
    investor: state.investor
  }))
  const { address } = useWallet()

  const onClick = () => {
    const mailToLink = createMailToLink('investors@protocol.ai', {
      subject: `Investor self custodial SAFT link`,
      body: `InvestorID: ${investor}\nFilecoin address: ${address}`
    })
    window.location.href = mailToLink
  }

  const back = () => {
    const params = new URLSearchParams(router.query)
    router.push(`/investor/accounts?${params.toString()}`)
  }

  return (
    <Box
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      width='100%'
      minHeight='100vh'
      alignSelf='center'
      padding={[2, 3, 5]}
    >
      <OnboardCard>
        <StepHeader currentStep={4} totalSteps={4} Icon={IconLedger} />
        <Title mt={3}>Send Email</Title>
        <Text>
          Please send an email to investors@protocol.ai with the following in
          the body:
        </Text>
        <Input.Text
          value={investor}
          onChange={noop}
          label='InvestorID'
          disabled
        />
        <Input.Text
          value={address}
          onChange={noop}
          label='Filecoin address'
          disabled
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
        <Button title='Back' onClick={back} variant='secondary' mr={2} />
        <Button
          title='Generate email for me!'
          onClick={onClick}
          variant='primary'
          ml={2}
        />
      </Box>
    </Box>
  )
}
