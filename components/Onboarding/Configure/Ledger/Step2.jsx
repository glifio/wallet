import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Button, Card, Text, Title } from '../../../Shared'

import { useWalletProvider } from '../../../../WalletProvider'
import { error, walletList } from '../../../../store/actions'
import StepCard from './StepCard'
import {
  hasLedgerError,
  reportLedgerConfigError
} from '../../../../utils/ledger/reportLedgerConfigError'

const Step2Helper = ({
  connectedFailure,
  ledgerLocked,
  filecoinAppNotOpen,
  replug,
  ledgerBusy,
  otherError
}) => (
  <Card
    display='flex'
    flexDirection='column'
    justifyContent='space-between'
    borderColor='silver'
    bg={
      hasLedgerError(
        connectedFailure,
        ledgerLocked,
        filecoinAppNotOpen,
        replug,
        ledgerBusy,
        otherError
      ) && 'card.error.background'
    }
    height={300}
    ml={2}
  >
    {hasLedgerError(
      connectedFailure,
      ledgerLocked,
      filecoinAppNotOpen,
      replug,
      ledgerBusy,
      otherError
    ) ? (
      <>
        <Box display='flex' alignItems='center'>
          <Title>Oops!</Title>
        </Box>
        <Box mt={3}>
          <Text mb={1}>We had trouble communicating with your device.</Text>
          <Text>
            {reportLedgerConfigError(
              connectedFailure,
              ledgerLocked,
              filecoinAppNotOpen,
              replug,
              ledgerBusy,
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
  connectedFailure: PropTypes.bool.isRequired,
  ledgerLocked: PropTypes.bool.isRequired,
  filecoinAppNotOpen: PropTypes.bool.isRequired,
  replug: PropTypes.bool.isRequired,
  ledgerBusy: PropTypes.bool.isRequired,
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
  const [loading, setLoading] = useState(false)

  return (
    <>
      <Box
        mt={8}
        mb={6}
        display='flex'
        flexDirection='row'
        justifyContent='center'
      >
        <StepCard step={2} loading={!ledger.userImportFailure && loading} />
        <Step2Helper
          connectedFailure={ledger.connectedFailure}
          ledgerLocked={ledger.locked}
          filecoinAppNotOpen={ledger.filecoinAppNotOpen}
          replug={ledger.replug}
          ledgerBusy={ledger.busy}
          otherError={generalError}
        />
      </Box>
      <Box mt={6} display='flex' flexDirection='row' justifyContent='center'>
        <Button
          title='Back'
          onClick={() => setWalletType(null)}
          variant='secondary'
          mr={2}
        />
        <Button
          title='My Ledger device is unlocked and Filecoin app open'
          onClick={async () => {
            setLoading(true)
            try {
              const wallet = await fetchDefaultWallet()
              if (wallet) {
                dispatch(walletList([wallet]))
                const params = new URLSearchParams(router.query)
                const hasParams = Array.from(params).length > 0
                const query = hasParams
                  ? `/wallet?${params.toString()}`
                  : '/wallet'
                setLoading(false)
                router.push(query)
              }
            } catch (err) {
              setLoading(false)
              dispatch(error(err))
            }
          }}
          disabled={!ledger.userImportFailure && loading}
          variant='primary'
          ml={2}
        />
      </Box>
    </>
  )
}
