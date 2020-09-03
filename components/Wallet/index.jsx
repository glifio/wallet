import React, { useState } from 'react'
import { useRouter } from 'next/router'
import {
  AccountCard,
  AccountError,
  BalanceCard,
  NetworkSwitcherGlyph,
  Wrapper,
  Sidebar,
  Content,
  BaseButton as ButtonLogout
} from '../Shared'
import Send from './Send.js'
import MessageView from './Message'
import { useWalletProvider } from '../../WalletProvider'
import {
  hasLedgerError,
  reportLedgerConfigError
} from '../../utils/ledger/reportLedgerConfigError'
import MsgConfirmer from '../../lib/confirm-message'
import useWallet from '../../WalletProvider/useWallet'
import { MESSAGE_HISTORY, SEND, RECEIVE } from './views'
import reportError from '../../utils/reportError'

export default () => {
  const wallet = useWallet()
  const [childView, setChildView] = useState(MESSAGE_HISTORY)
  const { ledger, connectLedger } = useWalletProvider()
  const [uncaughtError, setUncaughtError] = useState('')
  const [showLedgerError, setShowLedgerError] = useState(false)
  const [ledgerBusy, setLedgerBusy] = useState(false)

  const router = useRouter()
  const onAccountSwitch = () => {
    const params = new URLSearchParams(router.query)
    router.push(`/home/accounts?${params.toString()}`)
  }

  const onShowOnLedger = async () => {
    setLedgerBusy(true)
    try {
      setUncaughtError('')
      setShowLedgerError(false)
      const provider = await connectLedger()
      if (provider) await provider.wallet.showAddressAndPubKey(wallet.path)
      else setShowLedgerError(true)
    } catch (err) {
      reportError(8, false, err.message, err.stack)
      setUncaughtError(err.message)
    }
    setLedgerBusy(false)
  }

  const onViewChange = view => childView !== view && setChildView(view)

  return (
    <>
      <MsgConfirmer />
      <Wrapper
        css={`
          /* Temp implementation to simplistically handle large scale displays. This should be removed and a more dynamic solution introduced e.g https://css-tricks.com/optimizing-large-scale-displays/  */
          max-width: 1440px;
          margin: 0 auto;
        `}
      >
        <NetworkSwitcherGlyph />

        <Sidebar height='100vh'>
          {hasLedgerError({ ...ledger, otherError: uncaughtError }) &&
          showLedgerError ? (
            <AccountError
              onTryAgain={onShowOnLedger}
              errorMsg={reportLedgerConfigError({
                ...ledger,
                otherError: uncaughtError
              })}
              mb={2}
            />
          ) : (
            <AccountCard
              onAccountSwitch={onAccountSwitch}
              color='purple'
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
            disableButtons={childView === SEND}
          />
          <ButtonLogout
            variant='secondary'
            width='100%'
            mt={4}
            display='flex'
            alignItems='center'
            css={`
              background-color: ${({ theme }) => theme.colors.core.secondary}00;
              &:hover {
                background-color: ${({ theme }) => theme.colors.core.secondary};
              }
            `}
            onClick={() => window.location.reload()}
          >
            Logout
          </ButtonLogout>
        </Sidebar>
        <Content>
          {childView === MESSAGE_HISTORY && <MessageView />}
          {childView === SEND && (
            <Send
              close={() => setChildView(MESSAGE_HISTORY)}
              setSending={() => setChildView(SEND)}
            />
          )}
        </Content>
      </Wrapper>
    </>
  )
}
