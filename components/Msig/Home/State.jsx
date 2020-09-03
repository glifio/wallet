import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Balances from './Balances'
import {
  ADDRESS_PROPTYPE,
  FILECOIN_NUMBER_PROP
} from '../../../customPropTypes'
import { Box, Button } from '../../Shared'
import AccountInfo from './AccountInfo'
import useWallet from '../../../WalletProvider/useWallet'
import { useWalletProvider } from '../../../WalletProvider'
import { reportLedgerConfigError } from '../../../utils/ledger/reportLedgerConfigError'

const State = ({
  msigAddress,
  available,
  setChangingOwner,
  setWithdrawing,
  total,
  walletAddress
}) => {
  const wallet = useWallet()
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
    <Box display='flex' flexDirection='row' minHeight='100vh'>
      <AccountInfo
        msigAddress={msigAddress}
        walletAddress={walletAddress}
        showOnDevice={onShowOnLedger}
        ledgerBusy={ledgerBusy}
        error={reportLedgerConfigError({
          ...ledger,
          otherError: uncaughtError
        })}
        reset={reset}
      />
      <Box
        display='flex'
        flexDirection='column'
        flexGrow='1'
        alignItems='center'
        justifyContent='center'
      >
        <Balances available={available} total={total} />
        <Button
          type='button'
          variant='primary'
          onClick={setWithdrawing}
          title='Withdraw'
          maxWidth={10}
          minWidth={9}
          mb={3}
        />
        <Button
          type='button'
          variant='secondary'
          onClick={setChangingOwner}
          title='Change Owner'
          maxWidth={10}
          minWidth={9}
        />
      </Box>
    </Box>
  )
}

State.propTypes = {
  available: FILECOIN_NUMBER_PROP,
  total: FILECOIN_NUMBER_PROP,
  msigAddress: ADDRESS_PROPTYPE,
  walletAddress: ADDRESS_PROPTYPE,
  setChangingOwner: PropTypes.func.isRequired,
  setWithdrawing: PropTypes.func.isRequired
}

export default State
