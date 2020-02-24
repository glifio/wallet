import React, { useState } from 'react'
import {
  AccountCard,
  BalanceCard,
  Box,
  Glyph
} from '@openworklabs/filecoin-wallet-styleguide'

import { WALLET_PROP_TYPE } from '../../customPropTypes'
import Send from './Send.js'
import MessageHistory from './MessageHistory'

const WalletView = ({ wallet }) => {
  const [sending, setSending] = useState(true)
  return (
    <Box display='flex' flexDirection='row' justifyContent='space-between'>
      <Box ml={2} mt={1}>
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
      <Box>{sending ? <Send /> : <MessageHistory />}</Box>
      <>
        {sending && (
          <Glyph
            css={`
              cursor: pointer;
            `}
            role='button'
            cursor='pointer'
            onClick={() => setSending(false)}
            acronym='X'
            color='black'
          />
        )}
      </>
    </Box>
  )
}

WalletView.propTypes = {
  wallet: WALLET_PROP_TYPE.isRequired
}

export default WalletView
