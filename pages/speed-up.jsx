import { useRouter } from 'next/router'

import SpeedUp from '../components/Wallet/SpeedUp'
import RenderChildrenIfWalletConnected from '../lib/RequireWallet'
import useDesktopBrowser from '../lib/useDesktopBrowser'
import { gotoPageHomeWithKeyParams } from '../utils/urlParams'
import reportError from '../utils/reportError'

export default () => {
  useDesktopBrowser()
  const router = useRouter()

  const close = () => {
    gotoPageHomeWithKeyParams(router)
  }

  const getTransactionCidFromUrl = router => {
    const params = new URLSearchParams(router.query)
    const transactionCid = params.get('transactionCid')

    try {
      if (!transactionCid) {
        throw new Error('This page requires a valid transactionCid')
      }
    } catch (err) {
      reportError(null, false, err.message, err.stack)

      gotoPageHomeWithKeyParams(router)
    }

    return transactionCid
  }

  return (
    <RenderChildrenIfWalletConnected>
      <SpeedUp
        close={close}
        transactionCid={getTransactionCidFromUrl(router)}
      />
    </RenderChildrenIfWalletConnected>
  )
}
