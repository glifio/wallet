import React from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { Box, Button, Card, Text, Title, StepCard } from '../../../Shared'
import { IconLedger } from '../../../Shared/Icons'

import { useWalletProvider } from '../../../../WalletProvider'
import isValidBrowser from '../../../../utils/isValidBrowser'

const Step1Helper = ({ inUseByAnotherApp, connectedFailure }) => {
  return (
    <Card
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
      borderColor='silver'
      bg={(connectedFailure || inUseByAnotherApp) && 'card.error.background'}
      height={300}
      m={2}
    >
      {connectedFailure && (
        <>
          <Box display='flex' alignItems='center'>
            <Title>Oops!</Title>
          </Box>
          <Box>
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
          <Box display='flex' alignItems='center'>
            <Title>First</Title>
          </Box>
          <Box mt={3}>
            <Text>Please connect your Ledger to your computer.</Text>
          </Box>
        </>
      )}
    </Card>
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
  return (
    <>
      <Box
        display='flex'
        flexWrap='wrap'
        flexDirection='row'
        justifyContent='center'
      >
        <StepCard
          currentStep={1}
          description='Complete the following steps to connect Glif with your Ledger device.'
          loading={ledger.connecting}
          totalSteps={3}
          Icon={IconLedger}
        />
        <Step1Helper
          connectedFailure={ledger.connectedFailure}
          inUseByAnotherApp={ledger.inUseByAnotherApp}
        />
      </Box>
      <Box
        mt={6}
        mx={2}
        display='flex'
        flexDirection='row'
        justifyContent='space-between'
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
