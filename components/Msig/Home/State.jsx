import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Balances from './Balances'
import {
  ADDRESS_PROPTYPE,
  FILECOIN_NUMBER_PROP
} from '../../../customPropTypes'
import { Box, Button, Title, Menu, MenuItem, IconGlif } from '../../Shared'
import AccountSummary from './AccountSummary'
import useWallet from '../../../WalletProvider/useWallet'
import { useWalletProvider } from '../../../WalletProvider'
import { reportLedgerConfigError } from '../../../utils/ledger/reportLedgerConfigError'
import MessageHistory from '../MessageHistory'

const State = ({
  msigAddress,
  available,
  setChangingOwner,
  setWithdrawing,
  setTakingCustody,
  showTakeCustodyOption,
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
      maxWidth='1440px'
    >
      <Menu
        display='flex'
        flexWrap='wrap'
        width='100%'
        alignItems='center'
        justifyContent='space-between'
      >
        <MenuItem display='flex' alignItems='center'>
          <IconGlif
            size={6}
            css={`
              transform: rotate(-90deg);
            `}
          />
          <Title ml={2}>Vault</Title>
        </MenuItem>
        {/* <MenuItem>
          <Button
            type='button'
            variant='secondary'
            onClick={setChangingOwner}
            title='Change Owner'
            maxWidth={10}
            minWidth={9}
            borderRadius={6}
          />
        </MenuItem> */}
        {showTakeCustodyOption && (
          <MenuItem>
            <Button
              type='button'
              variant='secondary'
              onClick={setTakingCustody}
              title='TAKE CONTROL'
              maxWidth={10}
              minWidth={9}
              borderRadius={6}
            />
          </MenuItem>
        )}
      </Menu>
      <Menu display='flex' justifyContent='space-between'>
        <MenuItem display='flex' width='100%' justifyContent='space-between'>
          <Box display='flex' alignItems='center'>
            <IconGlif
              size={6}
              css={`
                transform: rotate(-90deg);
              `}
            />
            <Title ml={2}>Vault</Title>
          </Box>

          {showTakeCustodyOption && (
            <Button
              type='button'
              variant='secondary'
              onClick={setTakingCustody}
              title='Take Control'
              maxWidth={10}
              minWidth={9}
              borderRadius={6}
            />
          )}
        </MenuItem>
        <Menu
          display='flex'
          width='100%'
          maxWidth='1024px'
          margin='0 auto'
          mt={[2, 4]}
        >
          <MenuItem
            display='flex'
            flexWrap='wrap'
            alignItems='center'
            justifyContent='space-between'
            width='100%'
          >
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
            <Button
              type='button'
              variant='secondary'
              onClick={setChangingOwner}
              title='Change Owner'
              height={6}
              maxWidth={10}
              minWidth={9}
              borderRadius={6}
            />
          </MenuItem>
        </Menu>
      </Menu>

      <Box
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
      >
        <Balances
          available={available}
          total={total}
          setWithdrawing={setWithdrawing}
        />

        <MessageHistory maxWidth={18} address={msigAddress} />
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
  setWithdrawing: PropTypes.func.isRequired,
  setTakingCustody: PropTypes.func.isRequired,
  showTakeCustodyOption: PropTypes.bool.isRequired
}

export default State
