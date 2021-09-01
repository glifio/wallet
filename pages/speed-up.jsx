import { useRouter } from 'next/router'

import SpeedUp from '../components/Wallet/SpeedUp'
import RenderChildrenIfWalletConnected from '../lib/RequireWallet'
import useDesktopBrowser from '../lib/useDesktopBrowser'
import { gotoPageHomeWithKeyParams } from '../utils/urlParams'

export default () => {
  useDesktopBrowser()
  const router = useRouter()
  const close = () => {
    gotoPageHomeWithKeyParams(router)
  }
  return (
    <RenderChildrenIfWalletConnected>
      <SpeedUp close={() => close()} />
    </RenderChildrenIfWalletConnected>
  )
}
