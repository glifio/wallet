import useDesktopBrowser from '../../lib/useDesktopBrowser'
import { InvestorOnboard } from '../../components/Investor'

export default () => {
  useDesktopBrowser()
  return <InvestorOnboard />
}
