import React from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  Button,
  Card,
  Text,
  Title
} from '@openworklabs/filecoin-wallet-styleguide'

import { useWalletProvider } from '../../../../WalletProvider'
import StepCard from './StepCard'

const Step2Helper = () => (
  <Card
    display='flex'
    flexDirection='column'
    justifyContent='space-between'
    borderColor='silver'
    height={300}
    ml={2}
  >
    <Box display='flex' alignItems='center'>
      <Title>Next</Title>
    </Box>
    <Box display='block' mt={3}>
      <Text mb={1}>Please unlock your Ledger device</Text>
      <Text>And make sure the Filecoin App is open</Text>
    </Box>
  </Card>
)

Step2Helper.propTypes = {
  ledgerLocked: PropTypes.bool.isRequired,
  filecoinAppNotOpen: PropTypes.bool.isRequired,
  replug: PropTypes.bool.isRequired
}

export default () => {
  const { ledger, setWalletType, fetchDefaultWallet } = useWalletProvider()
  return (
    <>
      <Box
        mt={8}
        mb={6}
        display='flex'
        flexDirection='row'
        justifyContent='center'
      >
        <StepCard step={2} />
        <Step2Helper
          ledgerLocked={ledger.ledgerLocked}
          filecoinAppNotOpen={ledger.filecoinAppNotOpen}
          replug={ledger.replug}
        />
      </Box>
      <Box mt={6} display='flex' flexDirection='row' justifyContent='center'>
        <Button
          title='Back'
          onClick={() => setWalletType(null)}
          type='secondary'
          mr={2}
        />
        <Button
          title='My Ledger device is unlocked  and Filecoin app open'
          onClick={async () => {
            const [wallet] = await fetchDefaultWallet()
          }}
          type='primary'
          ml={2}
        />
      </Box>
    </>
  )
}
