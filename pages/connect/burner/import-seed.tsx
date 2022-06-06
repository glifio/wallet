import React, { useCallback } from 'react'
import {
  ConnectWallet,
  OneColumnCentered,
  useDesktopBrowser,
  useWalletProvider,
  navigate
} from '@glif/react-components'
import { useRouter } from 'next/router'
import WalletPage from '../../../components/WalletPage'
import { PAGE } from '../../../constants'

export default function ImportSeed() {
  useDesktopBrowser()
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
        <ConnectWallet.Burner.ImportSeed back={back} next={next} />
      </OneColumnCentered>
    </WalletPage>
  )
}
