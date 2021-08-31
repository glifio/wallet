import { useRouter } from 'next/router'

import SendView from '../components/Wallet/Send'
import RenderChildrenIfWalletConnected from '../lib/RequireWallet'
import useDesktopBrowser from '../lib/useDesktopBrowser'

export default () => {
  useDesktopBrowser()
  const router = useRouter()
  const close = () => {
    const params = new URLSearchParams(router.query)
    router.push(`/home?${params.toString()}`)
  }
  return (
    <RenderChildrenIfWalletConnected>
      <SendView close={() => close()} />
    </RenderChildrenIfWalletConnected>
  )
}
