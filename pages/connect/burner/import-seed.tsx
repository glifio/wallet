import React, { useCallback } from 'react'
import {
  ConnectWallet,
  OneColumnCentered,
  useDesktopBrowser
} from '@glif/react-components'
import { useRouter } from 'next/router'
import WalletPage from '../../../components/WalletPage'
import useReset from '../../../utils/useReset'
import { navigate } from '../../../utils/urlParams'
import { PAGE } from '../../../constants'

export default function ImportSeed() {
  useDesktopBrowser()
  const router = useRouter()
  const resetState = useReset()
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
