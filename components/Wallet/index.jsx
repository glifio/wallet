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
import MsgConfirmer from '../../lib/confirm-message'

const WalletView = ({ wallet }) => {
  const [sending, setSending] = useState(false)
  const { ledger, walletType, connectLedger } = useWalletProvider()
  const [uncaughtError, setUncaughtError] = useState(null)
  const [showLedgerError, setShowLedgerError] = useState(false)
  const [ledgerBusy, setLedgerBusy] = useState(false)
  const onShowOnLedger = async () => {
    setLedgerBusy(true)
    try {
      setUncaughtError(null)
      setShowLedgerError(false)
      const provider = await connectLedger()
      if (provider) await provider.wallet.showAddressAndPubKey(wallet.path)
      else setShowLedgerError(true)
    } catch (err) {
      setUncaughtError(err)
    }
    setLedgerBusy(false)
  }
  return (
    <>
      <MsgConfirmer />
      <Box
        display='flex'
        flexDirection='row'
        flexWrap='wrap'
        justifyContent='space-between'
      >
        <Box
          display='flex'
          flexDirection='column'
          flexWrap='wrap'
          ml={2}
          mt={1}
        >
          {hasLedgerError(
            ledger.connectedFailure,
            ledger.locked,
            ledger.filecoinAppNotOpen,
            ledger.replug,
            ledger.busy,
            uncaughtError
          ) && showLedgerError ? (
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
              ledgerBusy={ledgerBusy}
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
        <Box
          display='flex'
          flexWrap='wrap'
          flexGrow='1'
          justifyContent='center'
        >
          <Box>{sending ? <Send /> : <MessageHistory />}</Box>
        </Box>
      </Box>
    </>
  )
}

WalletView.propTypes = {
  wallet: WALLET_PROP_TYPE.isRequired
}

export default WalletView
