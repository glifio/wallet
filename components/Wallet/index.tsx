import React, { useCallback, useState } from 'react'
import { useRouter } from 'next/router'
import {
  AccountCard,
  AccountError,
  BalanceCard,
  Wrapper,
  Sidebar,
  Content,
  Box,
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

import { errorLogger } from '../../logger'
import {
  generateRouteWithRequiredUrlParams,
  navigate
} from '../../utils/urlParams'
import { PAGE } from '../../constants'

const EXPLORER_URL = process.env.NEXT_PUBLIC_EXPLORER_URL! as string

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
      errorLogger.error(
        err instanceof Error ? err.message : JSON.stringify(err),
        'onShowLedger'
      )
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
      <Wrapper>
        <Sidebar>
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
        </Sidebar>
        <Content>
          <Box display='flex' justifyContent='center'>
            {router.query.cid ? (
              <Box display='flex' flexDirection='row'>
                <MessageDetail
                  cid={router.query.cid as string}
                  height={Number(router.query?.height) || null}
                  addressHref={(address) =>
                    `${EXPLORER_URL}/actor/?address=${address}`
                  }
                  confirmations={50}
                />
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
                cidHref={(cid: string, height?: string) =>
                  generateRouteWithRequiredUrlParams({
                    pageUrl: PAGE.WALLET_HOME,
                    newQueryParams: { height, cid },
                    existingQParams: { ...router.query } as Record<
                      string,
                      string
                    >
                  })
                }
                addressHref={(address) =>
                  `${EXPLORER_URL}/actor/?address=${address}`
                }
              />
            )}
          </Box>
        </Content>
      </Wrapper>
    </>
  )
}
