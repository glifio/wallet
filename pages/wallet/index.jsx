import { WalletView } from '../../components'

import RenderChildrenIfWalletConnected from '../../lib/RequireWallet'

export default () => {
  return (
    <RenderChildrenIfWalletConnected>
      <WalletView />
    </RenderChildrenIfWalletConnected>
  )
}
