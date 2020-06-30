import { useRouter } from 'next/router'
import useDesktopBrowser from '../../lib/useDesktopBrowser'
import { InvestorOnboard } from '../../components/Investor'

export default () => {
  useDesktopBrowser()
  const router = useRouter()
  if (!process.env.IS_DEV) {
    router.replace('/')
    return <></>
  }
  return <InvestorOnboard />
}
