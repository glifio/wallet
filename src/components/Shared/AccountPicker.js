import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useHistory, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { useWallets } from '../../hooks'
import {
  AccountLabel,
  AccountBalance,
  SwitchAccountButton,
  AccountHeader,
  AccountDetail,
  AccountAddress,
  JustifyContentContainer,
  UnderlineOnHover
} from '../StyledComponents'

import CopyToClipboardIcon from '../DisplayWallet/ClipboardIcon'
import { copyToClipboard } from '../../utils'

import { ACCOUNT_BATCH_SIZE, LEDGER } from '../../constants'

import { error } from '../../store/actions'

const AccountPicker = ({ loadingAccounts }) => {
  const { selectedWallet, walletType, walletProvider } = useWallets()
  const [copiedToClipboard, setCopiedToClipboard] = useState(false)
  const history = useHistory()
  const { pathname } = useLocation()
  const dispatch = useDispatch()

  const onClick = useCallback(() => {
    setCopiedToClipboard(true)
    copyToClipboard(selectedWallet.address)
  }, [selectedWallet.address])

  return (
    <AccountHeader>
      <AccountLabel>Account</AccountLabel>
      <AccountDetail>
        <JustifyContentContainer
          flexDirection='row'
          justifyContent='space-between'
        >
          <AccountAddress role='button' onClick={onClick}>
            {selectedWallet.address}
          </AccountAddress>
          {copiedToClipboard ? (
            <span>&#10003;</span>
          ) : (
            <CopyToClipboardIcon onClick={onClick} />
          )}
        </JustifyContentContainer>
        <JustifyContentContainer
          flexDirection='row'
          justifyContent='space-between'
        >
          <AccountBalance>
            {selectedWallet.balance.toString()} FIL
          </AccountBalance>
          {walletType === LEDGER && (
            <UnderlineOnHover
              role='button'
              onClick={async () => {
                try {
                  if (walletProvider) {
                    await walletProvider.wallet.showAddressAndPubKey(
                      selectedWallet.path
                    )
                  } else {
                    throw new Error('Error connecting with Ledger')
                  }
                } catch (err) {
                  dispatch(error(err))
                }
              }}
            >
              Show address on Ledger
            </UnderlineOnHover>
          )}
        </JustifyContentContainer>
      </AccountDetail>
      <SwitchAccountButton
        disabled={loadingAccounts}
        onClick={() => {
          let page = 0
          if (walletType === LEDGER) {
            page = Math.floor(selectedWallet.path[4] / ACCOUNT_BATCH_SIZE)
          }
          if (pathname.includes('/settings')) history.push('/')
          else history.push(`/settings/accounts?page=${page}`)
        }}
      >
        {loadingAccounts ? (
          <span role='img' aria-label='loading'>
            ⌛
          </span>
        ) : pathname.includes('/settings') ? (
          <span>Back to wallet</span>
        ) : (
          <span>&#x2699;account/network</span>
        )}
      </SwitchAccountButton>
    </AccountHeader>
  )
}

AccountPicker.propTypes = {
  loadingAccounts: PropTypes.bool
}

AccountPicker.defaultProps = {
  loadingAccounts: false
}

export default AccountPicker
