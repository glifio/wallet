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
  Tooltip,
  MessageHistoryTable,
  MessageDetail,
  ButtonClose
} from '@glif/react-components'
import {
  useWalletProvider,
  useWallet,
  hasLedgerError,
  reportLedgerConfigError
} from '@glif/wallet-provider-react'

import reportError from '../../utils/reportError'
import { navigate, resetWallet } from '../../utils/urlParams'
import { PAGE } from '../../constants'

export default function WalletHome() {
  const wallet = useWallet()
  const router = useRouter()
  const { ledger, connectLedger, loginOption } = useWalletProvider()
  const [uncaughtError, setUncaughtError] = useState('')
  const [ledgerBusy, setLedgerBusy] = useState(false)

  const onShowOnLedger = async () => {
    setLedgerBusy(true)
    setUncaughtError('')
    try {
      const provider = await connectLedger()
      if (provider) await provider.wallet.showAddressAndPubKey(wallet.path)
      else setUncaughtError('Error connecting to your Ledger Device')
    } catch (err) {
      reportError(8, false, err.message, err.stack)
      setUncaughtError(err.message)
    }
    setLedgerBusy(false)
  }

  const onSend = useCallback(() => {
    navigate(router, { pageUrl: PAGE.WALLET_SEND })
  }, [router])

  const onAccountSwitch = useCallback(() => {
    navigate(router, { pageUrl: PAGE.WALLET_CHOOSE_ACCOUNTS })
  }, [router])

  return (
    <>
      <PageWrapper>
        <Sidebar height='100vh'>
          {hasLedgerError({ ...ledger, otherError: uncaughtError }) ? (
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
              color='core.primary'
              address={wallet.address}
              walletType={loginOption}
              onShowOnLedger={onShowOnLedger}
              ledgerBusy={ledgerBusy}
              mb={2}
            />
          )}
          <BalanceCard
            balance={wallet.balance}
            onSend={onSend}
            disableButtons={false}
          />
          <ButtonLogout
            variant='secondary'
            width='100%'
            mt={4}
            display='flex'
            alignItems='center'
            justifyContent='space-between'
            css={`
              background-color: ${({ theme }) => theme.colors.core.secondary}00;
              &:hover {
                background-color: ${({ theme }) => theme.colors.core.secondary};
              }
            `}
            onClick={resetWallet}
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
            {router.query.cid ? (
              <Box display='flex' flexDirection='row'>
                <MessageDetail cid={router.query.cid as string} />
                <ButtonClose
                  alignSelf='flex-start'
                  ml={7}
                  pt={4}
                  onClick={router.back}
                />
              </Box>
            ) : (
              <MessageHistoryTable
                address={wallet.address}
                cidHref={(cid: string) => `/home?cid=${cid}`}
              />
            )}
          </Box>
        </Content>
      </PageWrapper>
    </>
  )
}
