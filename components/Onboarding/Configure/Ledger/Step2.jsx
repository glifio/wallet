import React, { useState } from 'react'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Button,
  OnboardCard,
  Text,
  Title,
  StepCard,
  StepHeader
} from '../../../Shared'
import { IconLedger } from '../../../Shared/Icons'

import { useWalletProvider } from '../../../../WalletProvider'
import { error, walletList } from '../../../../store/actions'
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
  inUseByAnotherApp,
  otherError
}) => (
  <Box
    display='flex'
    flexDirection='column'
    justifyContent='space-between'
    borderColor='silver'
    width='100%'
    bg={
      hasLedgerError({
        connectedFailure,
        ledgerLocked,
        filecoinAppNotOpen,
        replug,
        ledgerBusy,
        inUseByAnotherApp,
        otherError
      }) && 'card.error.background'
    }
    mt={5}
  >
    {hasLedgerError({
      connectedFailure,
      ledgerLocked,
      filecoinAppNotOpen,
      replug,
      ledgerBusy,
      inUseByAnotherApp,
      otherError
    }) ? (
      <>
        <Box display='flex' alignItems='center'>
          <Title>Oops!</Title>
        </Box>
        <Box mt={3}>
          <Text mb={1}>We had trouble communicating with your device.</Text>
          <Text>
            {reportLedgerConfigError({
              connectedFailure,
              ledgerLocked,
              filecoinAppNotOpen,
              replug,
              ledgerBusy,
              inUseByAnotherApp,
              otherError
            })}
          </Text>
        </Box>
      </>
    ) : (
      <>
        <Box display='flex' alignItems='center'>
          <Title>Unlock & Open</Title>
        </Box>
        <Box>
          <Text>Please unlock your Ledger device</Text>
          <Text>And make sure the Filecoin App is open</Text>
        </Box>
      </>
    )}
  </Box>
)

Step2Helper.propTypes = {
  connectedFailure: PropTypes.bool.isRequired,
  ledgerLocked: PropTypes.bool.isRequired,
  filecoinAppNotOpen: PropTypes.bool.isRequired,
  replug: PropTypes.bool.isRequired,
  ledgerBusy: PropTypes.bool.isRequired,
  inUseByAnotherApp: PropTypes.bool.isRequired,
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
      <OnboardCard maxWidth={13} width='100%'>
        <StepHeader
          currentStep={2}
          description='Please complete the following steps so Filament can interface with
          your Ledger device.'
          loading={!ledger.userImportFailure && loading}
          totalSteps={2}
          Icon={IconLedger}
        />
        <Step2Helper
          connectedFailure={ledger.connectedFailure}
          ledgerLocked={ledger.locked}
          filecoinAppNotOpen={ledger.filecoinAppNotOpen}
          replug={ledger.replug}
          ledgerBusy={ledger.busy}
          inUseByAnotherApp={ledger.inUseByAnotherApp}
          otherError={generalError}
        />
      </OnboardCard>
      <Box
        mt={6}
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
