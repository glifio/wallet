import React from 'react'
import PropTypes from 'prop-types'
import { Box, Button, Card, Text, Title } from '../../../Shared'

import { useWalletProvider } from '../../../../WalletProvider'
import StepCard from './StepCard'

const Step1Helper = ({ connectedFailure }) => {
  return (
    <Card
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
      borderColor='silver'
      backgroundColor={connectedFailure && 'error.base'}
      height={300}
      ml={2}
    >
      {connectedFailure ? (
        <>
          <Box display='flex' alignItems='center'>
            <Title>Oops!</Title>
          </Box>
          <Box>
            <Text mb={2}>We couldn&rsquo;t connect to your Ledger Device.</Text>
            <Text>Please unlock your Ledger and try again.</Text>
          </Box>
        </>
      ) : (
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
  connectedFailure: PropTypes.bool.isRequired
}

export default () => {
  const { ledger, setLedgerProvider, setWalletType } = useWalletProvider()
  return (
    <>
      <Box
        mt={8}
        mb={6}
        display='flex'
        flexDirection='row'
        justifyContent='center'
      >
        <StepCard step={1} />
        <Step1Helper connectedFailure={ledger.connectedFailure} />
      </Box>
      <Box mt={6} display='flex' flexDirection='row' justifyContent='center'>
        <Button
          title='Back'
          onClick={() => setWalletType(null)}
          buttonStyle='secondary'
          mr={2}
        />
        <Button
          title='Yes, my Ledger device is connected.'
          onClick={() => setLedgerProvider()}
          buttonStyle='primary'
          ml={2}
        />
      </Box>
    </>
  )
}
