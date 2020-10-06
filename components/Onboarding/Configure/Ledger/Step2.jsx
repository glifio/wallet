import React, { useState } from 'react'
import { FilecoinNumber } from '@glif/filecoin-number'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Button,
  OnboardCard,
  Text,
  Title,
  StepHeader,
  StyledATag
} from '../../../Shared'
import { IconLedger } from '../../../Shared/Icons'

import { useWalletProvider } from '../../../../WalletProvider'
import { walletList, error as rdxError } from '../../../../store/actions'
import {
  hasLedgerError,
  reportLedgerConfigError
} from '../../../../utils/ledger/reportLedgerConfigError'
import useReset from '../../../../utils/useReset'
import createPath from '../../../../utils/createPath'
import { MAINNET, MAINNET_PATH_CODE } from '../../../../constants'
import reportError from '../../../../utils/reportError'

const Step2Helper = ({ ...errors }) => (
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
      ...errors
    }) ? (
      <>
        <Box display='flex' alignItems='center' color='status.fail.foreground'>
          <Title>Oops!</Title>
        </Box>
        <Box mt={3} color='status.fail.foreground'>
          <Text>{reportLedgerConfigError({ ...errors })}</Text>
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
          <StyledATag
            fontSize={2}
            target='_blank'
            rel='noopener noreferrer'
            href='https://reading.supply/@glif/install-the-filecoin-app-on-your-ledger-device-y33vhX'
          >
            Click here for installation instructions.
          </StyledATag>
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

const Step2 = ({ premainnetInvestor, msig }) => {
  const { ledger, fetchDefaultWallet, walletProvider } = useWalletProvider()
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
    let query = ''
    if (premainnetInvestor) query = `/vault/accounts?${params.toString()}`
    else if (msig) query = `/msig/accounts?${params.toString()}`
    else query = `/home?${params.toString()}`
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
      // catch errors due to node connection and continue forward for saft
      if (premainnetInvestor) {
        try {
          const [address] = await walletProvider.wallet.getAccounts(
            MAINNET,
            0,
            1
          )
          const wallet = {
            address,
            balance: new FilecoinNumber('0', 'fil'),
            path: createPath(MAINNET_PATH_CODE, 0)
          }
          dispatch(walletList([wallet]))
          routeToNextPage()
        } catch (_) {
          // this is a noop since if this call failed, the outer catch statement would catch this gracefully
          reportError('/Onboarding/Configure/Ledger:1', false)
        }
      } else {
        dispatch(rdxError(err.message))
      }
    } finally {
      setLoading(false)
    }
  }

  const back = () => {
    if (premainnetInvestor || msig) router.replace('/')
    resetState()
  }

  const calculateCurrentSteps = () => {
    if (premainnetInvestor) return 3
    if (msig) return 2
    return 2
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
        width='100%'
        minHeight={9}
        borderColor={error && 'status.fail.background'}
        bg={error ? 'status.fail.background' : 'core.transparent'}
      >
        <StepHeader
          currentStep={calculateCurrentSteps()}
          description='Please complete the following steps so Filament can interface with
          your Ledger device.'
          loading={!ledger.userImportFailure && loading}
          totalSteps={calculateTotalSteps()}
          Icon={IconLedger}
          error={!!error}
        />
        <Step2Helper otherError={generalError} {...ledger} />
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
  premainnetInvestor: PropTypes.bool.isRequired,
  msig: PropTypes.bool.isRequired
}

export default Step2
