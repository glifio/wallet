import React, { useState } from 'react'
import { useRouter } from 'next/router'
import {
  AccountCard,
  AccountError,
  BalanceCard,
  NetworkSwitcherGlyph,
  Wrapper,
  Sidebar,
  Content
} from '../Shared'
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
import useWallet from '../../WalletProvider/useWallet'
import Receive from '../Receive'
import { MESSAGE_HISTORY, SEND, RECEIVE } from './views'

const WalletView = () => {
  useUpToDateBalance()
  const wallet = useWallet()
  const [childView, setChildView] = useState(MESSAGE_HISTORY)
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
      page = Math.floor(wallet.path.split('/')[5] / ACCOUNT_BATCH_SIZE)
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

  const onViewChange = view => childView !== view && setChildView(view)

  return (
    <>
      <MsgConfirmer />
      <Wrapper>
        <Sidebar>
          <NetworkSwitcherGlyph />

          {hasLedgerError({ ...ledger, otherError: uncaughtError }) &&
          showLedgerError ? (
            <AccountError
              onTryAgain={onShowOnLedger}
              errorMsg={reportLedgerConfigError({
                ...ledger,
                otherError: uncaughtError
              })}
            />
          ) : (
            <AccountCard
              onAccountSwitch={onAccountSwitch}
              color='purple'
              alias='Prime'
              address={wallet.address}
              walletType={wallet.type}
              onShowOnLedger={onShowOnLedger}
              ledgerBusy={ledgerBusy}
              mb={2}
            />
          )}
          <BalanceCard
            balance={wallet.balance}
            onReceive={() => onViewChange(RECEIVE)}
            onSend={() => onViewChange(SEND)}
          />
        </Sidebar>
        <Content>
          {childView === MESSAGE_HISTORY && <MessageView />}
          {childView === SEND && (
            <Send
              close={() => setChildView(MESSAGE_HISTORY)}
              setSending={() => setChildView(SEND)}
            />
          )}
          {childView === RECEIVE && (
            <Receive
              close={() => setChildView(MESSAGE_HISTORY)}
              address={wallet.address}
            />
          )}
        </Content>
      </Wrapper>
    </>
  )
}

export default WalletView
