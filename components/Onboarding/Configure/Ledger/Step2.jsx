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
  StepHeader
} from '../../../Shared'
import { IconLedger } from '../../../Shared/Icons'

import { useWalletProvider } from '../../../../WalletProvider'
import { walletList, error as rdxError } from '../../../../store/actions'
import {
  hasLedgerError,
  reportLedgerConfigError
} from '../../../../utils/ledger/reportLedgerConfigError'
import useReset from '../../../../utils/useReset'

const Step2Helper = ({
  connectedFailure,
  locked,
  filecoinAppNotOpen,
  replug,
  busy,
  inUseByAnotherApp,
  otherError
}) => (
  <Box
    display='flex'
    flexDirection='column'
    justifyContent='space-between'
    borderColor='silver'
    width='100%'
    minHeight={9}
    mt={4}
  >
    {hasLedgerError({
      connectedFailure,
      locked,
      filecoinAppNotOpen,
      replug,
      busy,
      inUseByAnotherApp,
      otherError
    }) ? (
      <>
        <Box display='flex' alignItems='center' color='status.fail.foreground'>
          <Title>Oops!</Title>
        </Box>
        <Box mt={3} color='status.fail.foreground'>
          <Text>
            {reportLedgerConfigError({
              connectedFailure,
              locked,
              filecoinAppNotOpen,
              replug,
              busy,
              inUseByAnotherApp,
              otherError
            })}
          </Text>
        </Box>
      </>
    ) : (
      <>
        <Box display='flex' alignItems='center' color='core.nearblack'>
          <Title>Unlock & Open</Title>
        </Box>
        <Box color='core.nearblack' mt={3}>
          <Text>Please unlock your Ledger device.</Text>
          <Text>And make sure the Filecoin App is open</Text>
        </Box>
      </>
    )}
  </Box>
)

Step2Helper.propTypes = {
  connectedFailure: PropTypes.bool.isRequired,
  locked: PropTypes.bool.isRequired,
  filecoinAppNotOpen: PropTypes.bool.isRequired,
  replug: PropTypes.bool.isRequired,
  busy: PropTypes.bool.isRequired,
  inUseByAnotherApp: PropTypes.bool.isRequired,
  otherError: PropTypes.string
}

Step2Helper.defaultProps = {
  otherError: ''
}

const Step2 = ({ investor }) => {
  const { ledger, fetchDefaultWallet } = useWalletProvider()
  const dispatch = useDispatch()
  const resetState = useReset()
  // TODO: fix hack to ignore proptype errors => || null
  const generalError = useSelector(state => state.error || null)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const error = hasLedgerError({
    ...ledger,
    otherError: generalError
  })

  const routeToNextPage = () => {
    const params = new URLSearchParams(router.query)
    const query = investor
      ? `/vault/accounts?${params.toString()}`
      : `/home?${params.toString()}`
    router.push(query)
  }

  const onClick = async () => {
    setLoading(true)
    try {
      const wallet = await fetchDefaultWallet()
      if (wallet) {
        dispatch(walletList([wallet]))
        routeToNextPage()
      }
    } catch (err) {
      dispatch(rdxError(err.message))
    } finally {
      setLoading(false)
    }
  }

  const back = () => {
    if (investor) router.replace('/')
    else resetState()
  }

  return (
    <>
      <OnboardCard
        maxWidth={13}
        width='100%'
        minHeight={9}
        borderColor={error && 'status.fail.background'}
        bg={error ? 'status.fail.background' : 'core.transparent'}
      >
        <StepHeader
          currentStep={investor ? 3 : 2}
          description='Please complete the following steps so Filament can interface with
          your Ledger device.'
          loading={!ledger.userImportFailure && loading}
          totalSteps={investor ? 5 : 2}
          Icon={IconLedger}
          error={!!error}
        />
        <Step2Helper
          connectedFailure={ledger.connectedFailure}
          locked={ledger.locked}
          filecoinAppNotOpen={ledger.filecoinAppNotOpen}
          replug={ledger.replug}
          busy={ledger.busy}
          inUseByAnotherApp={ledger.inUseByAnotherApp}
          otherError={generalError}
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
          title='My Ledger device is unlocked & Filecoin app open'
          onClick={onClick}
          disabled={loading}
          variant='primary'
          ml={2}
        />
      </Box>
    </>
  )
}

Step2.propTypes = {
  investor: PropTypes.bool.isRequired
}

export default Step2
