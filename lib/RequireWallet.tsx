import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/router'
import { node } from 'prop-types'
import { useWallet } from '@glif/wallet-provider-react'

import { PAGE } from '../constants'
import { navigate } from '../utils/urlParams'

export default function RequireWallet({ children }: { children: ReactNode }) {
  const router = useRouter()
  const wallet = useWallet()
  useEffect(() => {
    if (!wallet.address) {
      navigate(router, { pageUrl: PAGE.LANDING })
    }
  }, [wallet.address, router])
  return <>{wallet.address && children}</>
}

RequireWallet.propTypes = {
  children: node.isRequired
}
