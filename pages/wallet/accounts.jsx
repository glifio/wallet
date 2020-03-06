import { AccountSelector } from '../../components'
import RenderChildrenIfWalletConnected from '../../lib/RequireWallet'

export default () => {
  return (
    <RenderChildrenIfWalletConnected>
      <AccountSelector />
    </RenderChildrenIfWalletConnected>
  )
}
