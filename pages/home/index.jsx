import { WalletView } from '../../components'

import RenderChildrenIfWalletConnected from '../../lib/RequireWallet'
import useDesktopBrowser from '../../lib/useDesktopBrowser'

const Home = () => {
  useDesktopBrowser()
  return (
    <RenderChildrenIfWalletConnected>
      <WalletView />
    </RenderChildrenIfWalletConnected>
  )
}

export default Home
