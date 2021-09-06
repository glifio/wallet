import { useRouter } from 'next/router'

import Replace from '../components/Wallet/Replace'
import RenderChildrenIfWalletConnected from '../lib/RequireWallet'
import useDesktopBrowser from '../lib/useDesktopBrowser'
import { gotoPageHomeWithKeyParams } from '../utils/urlParams'
import reportError from '../utils/reportError'

export default function SpeedUp() {
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
      <Replace close={close} messageCid={getTransactionCidFromUrl(router)} />
    </RenderChildrenIfWalletConnected>
  )
}
