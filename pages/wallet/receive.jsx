import RenderChildrenIfWalletConnected from '../../lib/RequireWallet'
import { Receive } from '../../components'

export default () => {
  return (
    <RenderChildrenIfWalletConnected>
      <Receive />
    </RenderChildrenIfWalletConnected>
  )
}
