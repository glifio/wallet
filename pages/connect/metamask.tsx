import { useCallback } from 'react'
import {
  OneColumnCentered,
  useDesktopBrowser,
  useWalletProvider,
  ConnectWallet,
  navigate
} from '@glif/react-components'
import { useRouter } from 'next/router'
import WalletPage from '../../components/WalletPage'
import { PAGE } from '../../constants'

export default function ConnectMetaMask() {
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
        <ConnectWallet.MetaMask next={next} back={back} />
      </OneColumnCentered>
    </WalletPage>
  )
}
