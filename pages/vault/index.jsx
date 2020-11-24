import useDesktopBrowser from '../../lib/useDesktopBrowser'
import { MsigOnboard } from '../../components/Msig'

const Vault = () => {
  useDesktopBrowser()
  return <MsigOnboard />
}

export default Vault
