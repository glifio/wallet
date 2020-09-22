// import { useRouter } from 'next/router'
import useDesktopBrowser from '../../lib/useDesktopBrowser'
import { MsigOnboard } from '../../components/Msig'

export default () => {
  useDesktopBrowser()
  // const router = useRouter()
  // if (process.env.IS_PROD) {
  //   router.replace('/')
  //   return <></>
  // }
  return <MsigOnboard />
}
