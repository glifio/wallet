import React, { useState, useCallback } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import { useWallets } from '../../hooks'
import {
  AccountLabel,
  AccountBalance,
  SwitchAccountButton,
  AccountHeader,
  AccountDetail,
  AccountAddress,
  JustifyContentContainer
} from '../StyledComponents'

import CopyToClipboardIcon from '../DisplayWallet/ClipboardIcon'
import { copyToClipboard } from '../../utils'

import { ACCOUNT_BATCH_SIZE, LEDGER } from '../../constants'

export default () => {
  const { selectedWallet, walletType } = useWallets()
  const [copiedToClipboard, setCopiedToClipboard] = useState(false)
  const history = useHistory()
  const { pathname } = useLocation()

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
        <AccountBalance>{selectedWallet.balance.toString()} FIL</AccountBalance>
      </AccountDetail>
      <SwitchAccountButton
        onClick={() => {
          let page = 0
          if (walletType === LEDGER) {
            page = Math.floor(selectedWallet.path[4] / ACCOUNT_BATCH_SIZE)
          }
          if (pathname.includes('/settings')) history.push('/')
          else history.push(`/settings/accounts?page=${page}`)
        }}
      >
        {pathname === '/settings' ? (
          <span>Back</span>
        ) : (
          <span>&#x2699;account/network</span>
        )}
      </SwitchAccountButton>
    </AccountHeader>
  )
}
