import { AccountSelector } from '../../components'
import RenderChildrenIfWalletConnected from '../../lib/RequireWallet'
import useDesktopBrowser from '../../lib/useDesktopBrowser'

const Accounts = () => {
  useDesktopBrowser()
  return (
    <RenderChildrenIfWalletConnected>
      <AccountSelector msig />
    </RenderChildrenIfWalletConnected>
  )
}

export default Accounts
