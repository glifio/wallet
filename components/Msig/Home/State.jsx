import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from '@glif/react-components'
import { useRouter } from 'next/router'
import {
  PAGE_MSIG_HOME,
  PAGE_MSIG_HISTORY,
  PAGE_MSIG_OWNERS
} from '../../../constants'
import { gotoRouteWithKeyUrlParams } from '../../../utils/urlParams'

import Balances from './Balances'
import Address from './Address'
import {
  ADDRESS_PROPTYPE,
  FILECOIN_NUMBER_PROP
} from '../../../customPropTypes'
import {
  Box,
  Button,
  Title,
  Text,
  Menu,
  MenuItem,
  IconGlif
} from '../../Shared'
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
  childView
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

  const repairLink = e => {
    e.preventDefault()

    console.log(e.currentTarget.pathname)
    gotoRouteWithKeyUrlParams(router, e.currentTarget.pathname)
  }

  // todo: decide how to do responsive design
  // add enough room for vault icon
  const responsiveMenuBuffer = 1024 + 300

  return (
    <Box
      display='flex'
      flexDirection='column'
      minHeight='100vh'
      width='100%'
      maxWidth={20}
      margin='0 auto'
    >
      <Box display='flex'
        alignItems='center'
        position='absolute'
        my={5}
        css={`
          /* todo: decide how to do responsive design */
          @media only screen and (max-width: ${responsiveMenuBuffer}px) {
            display: none;
          }
        `}
      >
        <IconGlif
          size={6}
          css={`
            transform: rotate(-90deg);
          `}
        />
        <Title ml={2}>Vault</Title>
      </Box>
      <Menu
        display='flex'
        flexWrap='wrap'
        width='100%'
        maxWidth={18}
        margin='0 auto'
        justifyContent='flex-start'
        alignItems='center'
        my={5}
      >
        <MenuItem display='flex'
          justifyContent='space-between'
          alignItems='center'
          pr={3}
          css={`
            /* todo: decide how to do responsive design */
            @media only screen and (min-width: ${responsiveMenuBuffer + 1}px) {
              display: none;
            }
          `}
        >
          <IconGlif
            size={6}
            css={`
              transform: rotate(-90deg);
            `}
          />
          <Title ml={2}>Vault</Title>
        </MenuItem>
        <MenuItem display='flex'
          justifyContent='space-between'
        >
            <NavLink
              name='Assets'
              href={PAGE_MSIG_HOME}
              onClick={repairLink}
              isActive={childView === PAGE_MSIG_HOME}
            />
            <NavLink
              name='History'
              href={PAGE_MSIG_HISTORY}
              onClick={repairLink}
              isActive={childView === PAGE_MSIG_HISTORY}
            />
            <NavLink
              name='Owners'
              href={PAGE_MSIG_OWNERS}
              onClick={repairLink}
              isActive={childView === PAGE_MSIG_OWNERS}
            />
        </MenuItem>
        <MenuItem ml={'auto'}>
          <Box>
            <Address
              label='Multisig Address'
              address={msigAddress}
              glyphAcronym='Ms'
            />
          </Box>
        </MenuItem>

      </Menu>
      <Box
        display='flex'
        flexWrap='wrap'
        justifyContent='center'
        width='100%'
        maxWidth={18}
        margin='0 auto'
      >
        {childView === PAGE_MSIG_HOME && (
          <Balances
            available={available}
            total={total}
          />
        )}
        {childView === PAGE_MSIG_HISTORY && (
          <MessageHistory address={msigAddress} />
        )}
        {childView === PAGE_MSIG_OWNERS && (
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
  childView: null
}

export default State
