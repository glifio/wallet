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
import isValidBrowser from '../../../../utils/isValidBrowser'
import { hasLedgerError } from '../../../../utils/ledger/reportLedgerConfigError'

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
          <Box display='flex' alignItems='center'>
            <Title>Oops!</Title>
          </Box>
          <Box>
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
          <Box
            display='flex'
            alignItems='center'
            mt={4}
            color='status.fail.foreground'
          >
            <Title>Connect</Title>
          </Box>
          <Box mt={3} color='status.fail.foreground'>
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

export default () => {
  const { ledger, setLedgerProvider, setWalletType } = useWalletProvider()
  const router = useRouter()
  if (!isValidBrowser()) {
    const params = new URLSearchParams(router.query)
    setWalletType(null)
    router.push(`/error/unsupported-browser?${params.toString()}`)
  }
  const errFromRdx = useSelector(state => state.error)
  const error = hasLedgerError({ ...ledger, otherError: errFromRdx })

  return (
    <>
      <OnboardCard
        maxWidth={13}
        width='100%'
        borderColor={error && 'status.fail.background'}
        bg={error ? 'status.fail.background' : 'core.transparent'}
      >
        <StepHeader
          currentStep={1}
          loading={ledger.connecting}
          totalSteps={2}
          Icon={IconLedger}
          error={error}
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
        <Button
          title='Back'
          onClick={() => setWalletType(null)}
          variant='secondary'
          mr={2}
        />
        <Button
          title='Yes, my Ledger device is connected.'
          onClick={setLedgerProvider}
          variant='primary'
          ml={2}
        />
      </Box>
    </>
  )
}
