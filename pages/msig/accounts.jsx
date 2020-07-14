import { useRouter } from 'next/router'
import { AccountSelector } from '../../components'
import RenderChildrenIfWalletConnected from '../../lib/RequireWallet'
import useDesktopBrowser from '../../lib/useDesktopBrowser'

export default () => {
  useDesktopBrowser()
  const router = useRouter()
  if (!process.env.IS_DEV) {
    router.replace('/')
    return <></>
  }
  return (
    <RenderChildrenIfWalletConnected>
      <AccountSelector msig />
    </RenderChildrenIfWalletConnected>
  )
}
