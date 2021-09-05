import { AccountSelector } from '../../components'
import RenderChildrenIfWalletConnected from '../../lib/RequireWallet'
import useDesktopBrowser from '../../lib/useDesktopBrowser'

const Accounts = () => {
  useDesktopBrowser()
  return (
    <RenderChildrenIfWalletConnected>
      <AccountSelector />
    </RenderChildrenIfWalletConnected>
  )
};

export default Accounts;
