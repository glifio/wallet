import React, { useState } from 'react'
import styled from 'styled-components'
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
import useUpToDateBalance from '../../lib/update-balance'

const WalletView = ({ wallet }) => {
  useUpToDateBalance()
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

  // Sidebar layout w/ implicit sizing & wrap, courtesy of https://every-layout.dev/layouts/sidebar/

  // Wrapper wraps the content and applies a negative margin onto "Gutter" - thus acting as a defacto gutter between the Sidebar and Content sections.
  const Wrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    flex-grow: 999;

    > * {
      display: flex;
      flex-wrap: wrap;
      flex-grow: 999;
      margin: -0.5rem;
    }

    > * > * {
      /* ↓ applies to both elements */
      margin: 0.5rem;
    }
  }
  `
  // Creates an implicit gutter between Sidebar and Content
  const Gutter = styled.div``

  // Sidebar grows to adopt the width of its children
  const Sidebar = styled.div`
    flex-grow: 1;
  `
  // Content is a flexible container with no explicit width (hence basis=0) but which grows to consume all available space. It then wraps once its min-width is reached.
  const Content = styled.div`
    display: grid;
    grid-template-columns: 1fr minmax(320px, 960px) 1fr;
    flex-basis: 0;
    flex-grow: 999;
    min-width: calc(50% - 1rem);
  `

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
              balance={wallet.balance}
              disableButtons={sending}
              onReceive={() => {}}
              onSend={() => setSending(true)}
            />
          </Sidebar>
          <Content>
            {sending ? <Send setSending={setSending} /> : <MessageHistory />}
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
