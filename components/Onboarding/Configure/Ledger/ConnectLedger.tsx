import React, { FC, useState } from 'react'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import {
  Box,
  Button,
  OnboardCard,
  Text,
  Title,
  StepHeader,
  StyledATag,
  IconLedger
} from '@glif/react-components'

import { useWalletProvider } from '../../../../WalletProvider'
import {
  hasLedgerError,
  reportLedgerConfigError
} from '../../../../utils/ledger/reportLedgerConfigError'
import useReset from '../../../../utils/useReset'
import { navigate } from '../../../../utils/urlParams'
import {
  LedgerState,
  LEDGER_STATE_PROPTYPES
} from '../../../../utils/ledger/ledgerStateManagement'
import { PAGE } from '../../../../constants'

const Helper: FC<LedgerState & { otherError: string }> = ({ ...errors }) => (
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

Helper.propTypes = {
  ...LEDGER_STATE_PROPTYPES,
  otherError: PropTypes.string
}

Helper.defaultProps = {
  otherError: ''
}

const ConnectLedger: FC<{ msig: boolean }> = ({ msig }) => {
  const { connectLedger, ledger, fetchDefaultWallet, walletList } =
    useWalletProvider()
  const resetState = useReset()
  const [uncaughtError, setUncaughtError] = useState('')
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const error = hasLedgerError({
    ...ledger,
    otherError: uncaughtError
  })

  const routeToNextPage = () => {
    msig
      ? navigate(router, {
          pageUrl: PAGE.MSIG_CHOOSE_ACCOUNTS
        })
      : navigate(router, { pageUrl: PAGE.WALLET_HOME })
  }

  const onClick = async () => {
    setLoading(true)
    try {
      const provider = await connectLedger()
      console.log(provider)
      if (provider) {
        setUncaughtError('')
        const wallet = await fetchDefaultWallet(provider)
        if (wallet) {
          walletList([wallet])
          routeToNextPage()
        }
      }
    } catch (err) {
      console.log(err)
      setUncaughtError(err?.message || err.toString())
    } finally {
      setLoading(false)
    }
  }

  const back = () => {
    resetState()
    router.replace('/')
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
          loading={!ledger.userImportFailure && loading}
          showStepper={false}
          Icon={IconLedger}
          error={!!error}
        />
        <Helper otherError={uncaughtError} {...ledger} />
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

ConnectLedger.propTypes = {
  msig: PropTypes.bool.isRequired
}

export default ConnectLedger
