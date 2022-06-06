import React, { useCallback } from 'react'
import {
  OneColumnCentered,
  useChromeDesktopBrowser,
  useWalletProvider,
  ConnectWallet
} from '@glif/react-components'
import { useRouter } from 'next/router'
import WalletPage from '../../components/WalletPage'
import { navigate } from '../../utils/urlParams'
import { PAGE } from '../../constants'

export default function ConnectLedger() {
  useChromeDesktopBrowser()
  const router = useRouter()
  const { resetState } = useWalletProvider()
  const back = useCallback(() => {
    router.replace('/')
    resetState()
  }, [router, resetState])

  const next = useCallback(() => {
    navigate(router, { pageUrl: PAGE.WALLET_HOME })
  }, [router])

  return (
    <WalletPage>
      <OneColumnCentered>
        <ConnectWallet.Ledger back={back} next={next} />
      </OneColumnCentered>
    </WalletPage>
  )
}
