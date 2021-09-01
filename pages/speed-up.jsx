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

  const getTransactionIdFromUrl = router => {
    const params = new URLSearchParams(router.query)
    const transactionId = params.get('transactionId')

    try {
      if (!transactionId) {
        throw new Error('This page requires a valid transactionId')
      }
    } catch (err) {
      reportError(null, false, err.message, err.stack)

      gotoPageHomeWithKeyParams(router)
    }

    return transactionId
  }

  const transactionId = getTransactionIdFromUrl(router)

  return (
    <RenderChildrenIfWalletConnected>
      <SpeedUp close={() => close()} transactionId={transactionId} />
    </RenderChildrenIfWalletConnected>
  )
}
