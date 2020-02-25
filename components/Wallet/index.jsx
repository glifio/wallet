import React, { useState } from 'react'
import { AccountCard, AccountError, BalanceCard, Box } from '../Shared'

import { WALLET_PROP_TYPE } from '../../customPropTypes'
import Send from './Send.js'
import MessageHistory from './MessageHistory'
import { useWalletProvider } from '../../WalletProvider'
import { LEDGER } from '../../constants'
import {
  hasLedgerError,
  reportLedgerConfigError
} from '../../utils/ledger/reportLedgerConfigError'

const WalletView = ({ wallet }) => {
  const [sending, setSending] = useState(true)
  const { ledger, walletType, connectLedger } = useWalletProvider()
  const [uncaughtError, setUncaughtError] = useState(null)
  const onShowOnLedger = async () => {
    try {
      setUncaughtError(null)
      const provider = await connectLedger()
      if (provider) await provider.wallet.showAddressAndPubKey(wallet.path)
    } catch (err) {
      setUncaughtError(err)
    }
  }
  return (
    <Box
      display='flex'
      flexDirection='row'
      flexWrap='wrap'
      justifyContent='space-between'
    >
      <Box display='flex' flexDirection='column' flexWrap='wrap' ml={2} mt={1}>
        {hasLedgerError(
          ledger.connectedFailure,
          ledger.locked,
          ledger.filecoinAppNotOpen,
          ledger.replug,
          ledger.busy,
          uncaughtError
        ) ? (
          <AccountError
            onTryAgain={onShowOnLedger}
            errorMsg={reportLedgerConfigError(
              ledger.connectedFailure,
              ledger.locked,
              ledger.filecoinAppNotOpen,
              ledger.replug,
              ledger.busy,
              uncaughtError
            )}
          />
        ) : (
          <AccountCard
            onAccountSwitch={() => {}}
            color='purple'
            alias='Prime'
            address={wallet.address}
            isLedgerWallet={walletType === LEDGER}
            onShowOnLedger={onShowOnLedger}
            mb={2}
          />
        )}

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
