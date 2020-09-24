import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Balances from './Balances'
import {
  ADDRESS_PROPTYPE,
  FILECOIN_NUMBER_PROP
} from '../../../customPropTypes'
import { Box, Button, Title, Text, Menu, MenuItem } from '../../Shared'
import AccountSummary from './AccountSummary'
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
    <Box
      display='flex'
      flexDirection='column'
      minHeight='100vh'
      width='100%'
      maxWidth={16}
    >
      <Menu
        display='flex'
        width='100%'
        alignItems='center'
        justifyContent='space-between'
      >
        <MenuItem>
          <Title>Self Custody</Title>
        </MenuItem>
        <MenuItem>
          <Button
            type='button'
            variant='secondary'
            onClick={setChangingOwner}
            title='Change Owner'
            maxWidth={10}
            minWidth={9}
          />
        </MenuItem>
      </Menu>
      <Menu
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        mt={3}
      >
        <MenuItem>
          <Menu>
            <MenuItem mb={4}>
              <Text>Your Multisig account</Text>
            </MenuItem>
            <MenuItem mt={4}>
              <Text>Is linked to your Ledger Device</Text>
            </MenuItem>
          </Menu>
        </MenuItem>
        <MenuItem>
          <AccountSummary
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
        </MenuItem>
      </Menu>

      <Box
        display='flex'
        flexDirection='column'
        flexGrow='1'
        alignItems='center'
        justifyContent='center'
      >
        <Balances
          available={available}
          total={total}
          setWithdrawing={setWithdrawing}
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
