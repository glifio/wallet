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

const Step1Helper = ({
  inUseByAnotherApp,
  connectedFailure,
  webUSBSupported
}) => {
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
      {!webUSBSupported && (
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
              We&apos;re having trouble connecting to your Ledger device.
            </Text>
            <Text>
              This is a problem we&apos;ve been made aware of, mostly with
              Windows computers. We are diligently working on fixing this
              problem. In the meantime, this problem should not appear if you
              have access to a Mac computer.
            </Text>
          </Box>
        </>
      )}
      {!inUseByAnotherApp && !connectedFailure && webUSBSupported && (
        <>
          <Box display='flex' alignItems='center' mt={4} color='core.nearblack'>
            <Title>Connect</Title>
          </Box>
          <Box color='core.nearblack' mt={3}>
            <Text>Please connect your Ledger to your computer.</Text>
          </Box>
          {navigator.platform.indexOf('Win') > -1 && (
            <Box color='core.nearblack' mt={3}>
              <Text
                display='inline-block'
                bg='status.warning.background'
                borderRadius={2}
                px={2}
                py={1}
                mr={2}
                mb={0}
              >
                Having trouble connecting to your Ledger device?{' '}
              </Text>
              <Text mt={0}>
                Try navigating to{' '}
                <Text display='inline' color='core.primary'>
                  chrome://flags#new-usb-backend
                </Text>{' '}
                and disabling the new USB backend.
              </Text>
            </Box>
          )}
        </>
      )}
    </Box>
  )
}

Step1Helper.propTypes = {
  connectedFailure: PropTypes.bool.isRequired,
  inUseByAnotherApp: PropTypes.bool.isRequired,
  webUSBSupported: PropTypes.bool.isRequired
}

const Step1 = ({ msig, setStep }) => {
  const { ledger, setLedgerProvider } = useWalletProvider()
  const router = useRouter()
  const resetState = useReset()
  if (!isDesktopChromeBrowser()) router.push(`/error/use-chrome`)
  const errFromRdx = useSelector(state => state.error)
  const error = hasLedgerError({ ...ledger, otherError: errFromRdx })

  const back = () => {
    if (msig) router.replace('/')
    resetState()
  }

  const calculateTotalSteps = () => {
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
          currentStep={1}
          loading={ledger.connecting}
          totalSteps={calculateTotalSteps()}
          Icon={IconLedger}
          error={!!error}
          color={error ? 'status.fail.foreground' : 'core.transparent'}
        />
        <Step1Helper
          connectedFailure={ledger.connectedFailure}
          inUseByAnotherApp={ledger.inUseByAnotherApp}
          webUSBSupported={ledger.webUSBSupported}
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
  msig: PropTypes.bool.isRequired
}

export default Step1
