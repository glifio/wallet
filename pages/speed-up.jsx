import { useRouter } from 'next/router'

import SpeedUp from '../components/Wallet/SpeedUp'
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
      <SpeedUp close={() => close()} />
    </RenderChildrenIfWalletConnected>
  )
}
