import React, { useState } from 'react'
import {
  AccountCard,
  BalanceCard,
  Box
} from '@openworklabs/filecoin-wallet-styleguide'

import { WALLET_PROP_TYPE } from '../../customPropTypes'
import Send from './Send.js'
import MessageHistory from './MessageHistory'

const WalletView = ({ wallet }) => {
  const [sending, setSending] = useState(true)
  return (
    <Box
      display='flex'
      flexDirection='row'
      flexWrap='wrap'
      justifyContent='space-between'
    >
      <Box display='flex' flexDirection='column' flexWrap='wrap' ml={2} mt={1}>
        <AccountCard
          onAccountSwitch={() => {}}
          color='purple'
          alias='Prime'
          address={wallet.address}
          mb={2}
        />
        <BalanceCard
          balance={wallet.balance.toFil()}
          disableButtons={sending}
          onReceive={() => {}}
          onSend={() => setSending(true)}
        />
      </Box>
      <Box display='flex' flexWrap='wrap' flexGrow='1' justifyContent='center'>
        <Box>{sending ? <Send /> : <MessageHistory />}</Box>
        <>{sending}</>
      </Box>
    </Box>
  )
}

WalletView.propTypes = {
  wallet: WALLET_PROP_TYPE.isRequired
}

export default WalletView
