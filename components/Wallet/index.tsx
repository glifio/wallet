import { useCallback, useState } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import {
  getQueryParam,
  AccountCard,
  AccountError,
  BalanceCard,
  OneColumn,
  MessageHistoryTable,
  MessageDetail,
  useWalletProvider,
  useWallet,
  hasLedgerError,
  reportLedgerConfigError,
  appendQueryParams,
  navigate,
  useLogger
} from '@glif/react-components'

import { PAGE } from '../../constants'

const Cards = styled.div`
  display: flex;
  gap: var(--space-l)};
`

export default function WalletHome() {
  const wallet = useWallet()
  const router = useRouter()
  const cid = getQueryParam.string(router, 'cid')
  const { ledger, connectLedger, loginOption } = useWalletProvider()
  const [uncaughtError, setUncaughtError] = useState('')
  const [ledgerBusy, setLedgerBusy] = useState(false)
  const logger = useLogger()

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
        {cid ? (
          <MessageDetail
            cid={cid}
            speedUpHref={PAGE.SPEED_UP}
            cancelHref={PAGE.CANCEL}
          />
        ) : (
          <MessageHistoryTable
            address={wallet.address}
            cidHref={(cid: string) =>
              appendQueryParams(PAGE.WALLET_HOME, { cid })
            }
            warnMissingData
          />
        )}
      </OneColumn>
    </>
  )
}
