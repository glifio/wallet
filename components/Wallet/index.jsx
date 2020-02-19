import React from 'react'
import {
  AccountCard,
  BalanceCard,
  Box
} from '@openworklabs/filecoin-wallet-styleguide'

import { WALLET_PROP_TYPE } from '../../customPropTypes'

const WalletView = ({ wallet }) => {
  return (
    <Box display='flex' flexDirection='row'>
      <Box ml={2} mt={1} flexGrow='1'>
        <AccountCard
          onAccountSwitch={() => {}}
          color='purple'
          alias='Prime'
          address={wallet.address}
          mb={2}
        />
        <BalanceCard
          balance={wallet.balance.toFil()}
          disableButtons={false}
          onReceive={() => {}}
          onSend={() => {}}
        />
      </Box>
      <Box flexGrow='2'>Transaction Table here</Box>
    </Box>
  )
}

WalletView.propTypes = {
  wallet: WALLET_PROP_TYPE.isRequired
}

export default WalletView
