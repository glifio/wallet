import React, { useCallback, useState } from 'react'
import { useRouter } from 'next/router'
import {
  AccountCard,
  AccountError,
  BalanceCard,
  PageWrapper,
  Sidebar,
  Content,
  BaseButton as ButtonLogout,
  Box,
  Tooltip
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
import reportError from '../../utils/reportError'

export default () => {
  const wallet = useWallet()
  const router = useRouter()
  const { ledger, connectLedger } = useWalletProvider()
  const [uncaughtError, setUncaughtError] = useState('')
  const [showLedgerError, setShowLedgerError] = useState(false)
  const [ledgerBusy, setLedgerBusy] = useState(false)

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

  // todo: refactor to move this logic to urls set from the other views
  const gotoSendTempFunc = () => {
    const params = new URLSearchParams(router.query)
    router.push(`/send?${params.toString()}`)
  }

  // todo: refactor to move this logic to urls set from the other views
  const gotoHomeTempFunc = () => {
    const params = new URLSearchParams(router.query)
    router.push(`/home/accounts?${params.toString()}`)
  }

  return (
    <>
      <MsgConfirmer />
      <PageWrapper>
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
              onAccountSwitch={gotoHomeTempFunc}
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
            onSend={() => gotoSendTempFunc()}
          />
          <ButtonLogout
            variant='secondary'
            width='100%'
            mt={4}
            display='flex'
            alignItems='center'
            justifyContent='space-between'
            css={`
              background-color: ${({ theme }) =>
                theme.colors.core.secondary}00;
              &:hover {
                background-color: ${({ theme }) =>
                  theme.colors.core.secondary};
              }
            `}
            onClick={() => window.location.reload()}
          >
            Logout
            <Tooltip content='Logging out clears all your sensitive information from the browser and sends you back to the home page' />
          </ButtonLogout>
        </Sidebar>
        <Content>
          <Box
            display='flex'
            justifyContent='center'
            maxWidth={16}
            width='100%'
          >
            <MessageView />
          </Box>
        </Content>
      </PageWrapper>
    </>
  )
}
