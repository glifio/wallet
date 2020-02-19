import React from 'react'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Button,
  Card,
  Text,
  Title
} from '@openworklabs/filecoin-wallet-styleguide'

import { useWalletProvider } from '../../../../WalletProvider'
import { error, walletList } from '../../../../store/actions'
import StepCard from './StepCard'

const reportLedgerConfigError = (
  ledgerLocked,
  filecoinAppNotOpen,
  replug,
  otherError
) => {
  if (ledgerLocked) return 'Is your Ledger device unlocked?'
  if (filecoinAppNotOpen) return 'Is the Filecoin App open on your device?'
  if (replug || otherError)
    return 'Please unplug and replug your device, and try again.'

  console.error('Unhandled error event: ', otherError.message)
  return 'Please unplug and replug your device, and try again.'
}

const hasLedgerError = (ledgerLocked, filecoinAppNotOpen, replug, otherError) =>
  ledgerLocked || filecoinAppNotOpen || replug || otherError

const Step2Helper = ({
  ledgerLocked,
  filecoinAppNotOpen,
  replug,
  otherError
}) => (
  <Card
    display='flex'
    flexDirection='column'
    justifyContent='space-between'
    borderColor='silver'
    backgroundColor={
      hasLedgerError(ledgerLocked, filecoinAppNotOpen, replug, otherError) &&
      'error.base'
    }
    height={300}
    ml={2}
  >
    {hasLedgerError(ledgerLocked, filecoinAppNotOpen, replug, otherError) ? (
      <>
        <Box display='flex' alignItems='center'>
          <Title>Oops!</Title>
        </Box>
        <Box mt={3}>
          <Text mb={1}>We had trouble communicating with your device.</Text>
          <Text>
            {reportLedgerConfigError(
              ledgerLocked,
              filecoinAppNotOpen,
              replug,
              otherError
            )}
          </Text>
        </Box>
      </>
    ) : (
      <>
        <Box display='flex' alignItems='center'>
          <Title>Next</Title>
        </Box>
        <Box mt={3}>
          <Text mb={1}>Please unlock your Ledger device</Text>
          <Text>And make sure the Filecoin App is open</Text>
        </Box>
      </>
    )}
  </Card>
)

Step2Helper.propTypes = {
  ledgerLocked: PropTypes.bool.isRequired,
  filecoinAppNotOpen: PropTypes.bool.isRequired,
  replug: PropTypes.bool.isRequired,
  otherError: PropTypes.instanceOf(Error)
}

Step2Helper.defaultProps = {
  otherError: null
}

export default () => {
  const { ledger, setWalletType, fetchDefaultWallet } = useWalletProvider()
  const dispatch = useDispatch()
  const generalError = useSelector(state => state.error)
  const router = useRouter()
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
          otherError={generalError}
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
            try {
              const wallet = await fetchDefaultWallet()
              dispatch(walletList([wallet]))
              router.push(`/wallet`)
            } catch (err) {
              dispatch(error(err))
            }
          }}
          type='primary'
          ml={2}
        />
      </Box>
    </>
  )
}
