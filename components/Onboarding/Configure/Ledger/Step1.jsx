import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import {
  Box,
  Button,
  OnboardCard,
  Text,
  Title,
  StepHeader
} from '../../../Shared'
import { IconLedger } from '../../../Shared/Icons'

import { useWalletProvider } from '../../../../WalletProvider'
import isDesktopChromeBrowser from '../../../../utils/isDesktopChromeBrowser'
import { hasLedgerError } from '../../../../utils/ledger/reportLedgerConfigError'
import useReset from '../../../../utils/useReset'

const Step1Helper = ({ inUseByAnotherApp, connectedFailure }) => {
  return (
    <Box
      display='block'
      flexDirection='column'
      justifyContent='space-between'
      borderColor='silver'
      mt={4}
      minHeight={9}
    >
      {connectedFailure && (
        <>
          <Box
            display='flex'
            alignItems='center'
            color='status.fail.foreground'
          >
            <Title>Oops!</Title>
          </Box>
          <Box color='status.fail.foreground'>
            <Text mb={2}>We couldn&rsquo;t connect to your Ledger Device.</Text>
            <Text>Please unlock your Ledger and try again.</Text>
          </Box>
        </>
      )}
      {inUseByAnotherApp && (
        <>
          <Box
            display='flex'
            alignItems='center'
            color='status.fail.foreground'
          >
            <Title>Oops!</Title>
          </Box>
          <Box color='status.fail.foreground'>
            <Text mb={2}>
              Looks like another app is connected to your Ledger device.
            </Text>
            <Text>
              Please quit any other application using your Ledger device, and
              try again.
            </Text>
          </Box>
        </>
      )}
      {!inUseByAnotherApp && !connectedFailure && (
        <>
          <Box display='flex' alignItems='center' mt={4} color='core.nearblack'>
            <Title>Connect</Title>
          </Box>
          <Box color='core.nearblack' mt={3}>
            <Text>Please connect your Ledger to your computer.</Text>
          </Box>
        </>
      )}
    </Box>
  )
}

Step1Helper.propTypes = {
  connectedFailure: PropTypes.bool.isRequired,
  inUseByAnotherApp: PropTypes.bool.isRequired
}

const Step1 = ({ premainnetInvestor, msig, setStep }) => {
  const { ledger, setLedgerProvider } = useWalletProvider()
  const router = useRouter()
  const resetState = useReset()
  if (!isDesktopChromeBrowser()) router.push(`/error/use-chrome`)
  const errFromRdx = useSelector(state => state.error)
  const error = hasLedgerError({ ...ledger, otherError: errFromRdx })

  const back = () => {
    if (premainnetInvestor || msig) router.replace('/')
    else resetState()
  }

  const calculateCurrentSteps = () => {
    if (premainnetInvestor) return 2
    if (msig) return 1
    return 1
  }

  const calculateTotalSteps = () => {
    if (premainnetInvestor) return 5
    if (msig) return 3
    return 2
  }

  return (
    <>
      <OnboardCard
        maxWidth={13}
        minHeight={9}
        width='100%'
        borderColor={error && 'status.fail.background'}
        bg={error ? 'status.fail.background' : 'core.transparent'}
      >
        <StepHeader
          currentStep={calculateCurrentSteps()}
          loading={ledger.connecting}
          totalSteps={calculateTotalSteps()}
          Icon={IconLedger}
          error={!!error}
          color={error ? 'status.fail.foreground' : 'core.transparent'}
        />
        <Step1Helper
          connectedFailure={ledger.connectedFailure}
          inUseByAnotherApp={ledger.inUseByAnotherApp}
        />
      </OnboardCard>
      <Box
        mt={6}
        display='flex'
        flexDirection='row'
        justifyContent='space-between'
        width='100%'
      >
        <Button title='Back' onClick={back} variant='secondary' mr={2} />
        <Button
          title='Yes, my Ledger device is connected.'
          onClick={async () => {
            const provider = await setLedgerProvider()
            if (provider) setStep(2)
          }}
          variant='primary'
          ml={2}
        />
      </Box>
    </>
  )
}

Step1.propTypes = {
  setStep: PropTypes.func.isRequired,
  premainnetInvestor: PropTypes.bool.isRequired,
  msig: PropTypes.bool.isRequired
}

export default Step1
