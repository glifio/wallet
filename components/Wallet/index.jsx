import React, { useState } from 'react'
import { useRouter } from 'next/router'
import {
  AccountCard,
  AccountError,
  BalanceCard,
  NetworkSwitcherGlyph,
  Wrapper,
  Gutter,
  Sidebar,
  Content
} from '../Shared'
import { WALLET_PROP_TYPE } from '../../customPropTypes'
import Send from './Send.js'
import MessageView from './Message'
import { useWalletProvider } from '../../WalletProvider'
import {
  LEDGER,
  CREATE_MNEMONIC,
  IMPORT_MNEMONIC,
  ACCOUNT_BATCH_SIZE
} from '../../constants'
import {
  hasLedgerError,
  reportLedgerConfigError
} from '../../utils/ledger/reportLedgerConfigError'
import MsgConfirmer from '../../lib/confirm-message'
import useUpToDateBalance from '../../lib/update-balance'

const WalletView = ({ wallet }) => {
  useUpToDateBalance()
  const [sending, setSending] = useState(false)
  const { ledger, walletType, connectLedger } = useWalletProvider()
  const [uncaughtError, setUncaughtError] = useState(null)
  const [showLedgerError, setShowLedgerError] = useState(false)
  const [ledgerBusy, setLedgerBusy] = useState(false)

  const router = useRouter()
  const onAccountSwitch = () => {
    const params = new URLSearchParams(router.query)
    let page = 0
    if (
      (wallet && walletType === LEDGER) ||
      walletType === CREATE_MNEMONIC ||
      walletType === IMPORT_MNEMONIC
    ) {
      page = Math.floor(wallet.path[4] / ACCOUNT_BATCH_SIZE)
    }
    params.set('page', page)
    router.push(`/wallet/accounts?${params.toString()}`)
  }

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
      <Wrapper>
        <Gutter>
          <Sidebar>
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
                onAccountSwitch={onAccountSwitch}
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
              balance={wallet.balance}
              disableButtons={sending}
              onReceive={() => {}}
              onSend={() => setSending(true)}
            />
          </Sidebar>
          <Content>
            {sending ? <Send setSending={setSending} /> : <MessageView />}
            <NetworkSwitcherGlyph />
          </Content>
        </Gutter>
      </Wrapper>
    </>
  )
}

WalletView.propTypes = {
  wallet: WALLET_PROP_TYPE.isRequired
}

export default WalletView
