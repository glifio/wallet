import React, { useCallback, useState } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import {
  AccountCard,
  AccountError,
  BalanceCard,
  OneColumn,
  MessageHistoryTable,
  MessageDetail,
  space,
  useWalletProvider,
  useWallet,
  hasLedgerError,
  reportLedgerConfigError,
  generateRouteWithRequiredUrlParams,
  navigate
} from '@glif/react-components'

import { logger } from '../../logger'
import { PAGE } from '../../constants'

const Cards = styled.div`
  display: flex;
  gap: ${space('large')};
`

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
      logger.error(
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
      <OneColumn>
        <Cards>
          {hasLedgerError({ ...ledger, otherError: uncaughtError }) ? (
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
              color='core.primary'
              address={wallet.address}
              walletType={loginOption}
              onShowOnLedger={onShowOnLedger}
              ledgerBusy={ledgerBusy}
            />
          )}
          <BalanceCard
            balance={wallet.balance}
            onSend={onSend}
            disableButtons={false}
          />
        </Cards>
      </OneColumn>
      <OneColumn>
        {router.query.cid ? (
          <MessageDetail
            cid={router.query.cid as string}
            height={Number(router.query?.height) || null}
            confirmations={50}
            speedUpHref={generateRouteWithRequiredUrlParams({
              pageUrl: PAGE.SPEED_UP,
              existingQParams: router.query
            })}
            cancelHref={generateRouteWithRequiredUrlParams({
              pageUrl: PAGE.CANCEL,
              existingQParams: router.query
            })}
          />
        ) : (
          <MessageHistoryTable
            address={wallet.address}
            cidHref={(cid: string, height?: string) =>
              generateRouteWithRequiredUrlParams({
                pageUrl: PAGE.WALLET_HOME,
                newQueryParams: { height, cid },
                existingQParams: router.query
              })
            }
          />
        )}
      </OneColumn>
    </>
  )
}
