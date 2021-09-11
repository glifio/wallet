import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { Box } from '@glif/react-components'
import {
  PAGE_MSIG_HOME,
  PAGE_MSIG_HISTORY,
  PAGE_MSIG_OWNERS
} from '../../../constants'
import { gotoRouteWithKeyUrlParams } from '../../../utils/urlParams'

import Balances from './Balances'
import NavMenu from './NavMenu'

import {
  ADDRESS_PROPTYPE,
  FILECOIN_NUMBER_PROP
} from '../../../customPropTypes'
import AccountSummary from './AccountSummary'
import useWallet from '../../../WalletProvider/useWallet'
import { useWalletProvider } from '../../../WalletProvider'
import { reportLedgerConfigError } from '../../../utils/ledger/reportLedgerConfigError'
import MessageHistory from '../MessageHistory'

const State = ({
  signers,
  msigAddress,
  available,
  total,
  walletAddress,
  pageId
}) => {
  const wallet = useWallet()
  const router = useRouter()
  const { ledger, connectLedger, resetState } = useWalletProvider()
  const [uncaughtError, setUncaughtError] = useState('')
  const [ledgerBusy, setLedgerBusy] = useState(false)
  const onShowOnLedger = async () => {
    setLedgerBusy(true)
    const provider = await connectLedger()
    if (provider) await provider.wallet.showAddressAndPubKey(wallet.path)
    setLedgerBusy(false)
  }

  const reset = () => {
    setUncaughtError('')
    resetState()
  }

  return (
    <Box
      display='flex'
      flexWrap='wrap'
      justifyContent='center'
      width='100%'
      maxWidth={18}
      margin='0 auto'
    >
      {pageId === PAGE_MSIG_HOME && (
        <Balances available={available} total={total} />
      )}
      {pageId === PAGE_MSIG_HISTORY && <MessageHistory address={msigAddress} />}
      {pageId === PAGE_MSIG_OWNERS && (
        <AccountSummary
          msigAddress={msigAddress}
          walletAddress={walletAddress}
          signers={signers}
          showOnDevice={onShowOnLedger}
          ledgerBusy={ledgerBusy}
          error={reportLedgerConfigError({
            ...ledger,
            otherError: uncaughtError
          })}
          reset={reset}
        />
      )}
    </Box>
  )
}

State.propTypes = {
  available: FILECOIN_NUMBER_PROP,
  total: FILECOIN_NUMBER_PROP,
  msigAddress: ADDRESS_PROPTYPE,
  walletAddress: ADDRESS_PROPTYPE,
  signers: PropTypes.arrayOf(
    PropTypes.shape({
      account: ADDRESS_PROPTYPE,
      id: ADDRESS_PROPTYPE
    })
  ).isRequired,
  pageId: PropTypes.string
}

export default State
