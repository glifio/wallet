import React, { useState, useCallback } from 'react'

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

import CopyToClipboardIcon from './ClipboardIcon'
import { copyToClipboard } from '../../utils'

export default () => {
  const { selectedWallet } = useWallets()
  const [copiedToClipboard, setCopiedToClipboard] = useState(false)

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
      <SwitchAccountButton>Switch account</SwitchAccountButton>
    </AccountHeader>
  )
}
