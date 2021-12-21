import useDesktopBrowser from '../lib/useDesktopBrowser'
import { MsigOnboard } from '../components/Msig'

const Msig = () => {
  useDesktopBrowser()
  return <MsigOnboard />
}

export default Msig
