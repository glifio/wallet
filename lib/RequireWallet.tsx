import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/router'
import { node } from 'prop-types'

import { PAGE } from '../constants'
import { navigate } from '../utils/urlParams'
import useWallet from '../WalletProvider/useWallet'
import { Wallet } from '../WalletProvider/types'

export function RequireWallet({ children }: { children: ReactNode }) {
  const router = useRouter()
  const wallet = useWallet() as Wallet
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
