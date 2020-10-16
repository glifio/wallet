import useDesktopBrowser from '../lib/useDesktopBrowser'
import { MsigOnboard } from '../components/Msig'

export default () => {
  useDesktopBrowser()
  return <MsigOnboard />
}
