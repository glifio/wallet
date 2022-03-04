import { useCallback } from 'react'
import PropTypes from 'prop-types'
import { NetworkConnection } from '@glif/react-components'
import { useWallet } from '@glif/wallet-provider-react'
import { useRouter } from 'next/router'

import { resetWallet, navigate } from '../utils/urlParams'
import { PAGE } from '../constants'
import WalletPage from './WalletPage'

export default function WalletPageLoggedIn({
  children
}: WalletPageLoggedInProps) {
  const router = useRouter()
  const wallet = useWallet()
  const onNodeDisconnect = useCallback(() => {
    navigate(router, { pageUrl: PAGE.NODE_DISCONNECTED })
  }, [router])

  return (
    <WalletPage
      logout={resetWallet}
      connection={
        <NetworkConnection
          lotusApiAddr={process.env.NEXT_PUBLIC_LOTUS_NODE_JSONRPC}
          apiKey={process.env.NEXT_PUBLIC_NODE_STATUS_API_KEY}
          statusApiAddr={process.env.NEXT_PUBLIC_NODE_STATUS_API_ADDRESS}
          errorCallback={onNodeDisconnect}
        />
      }
      addressLinks={[
        {
          label: 'Wallet Address',
          address: wallet.address,
          urlPrefix: `${process.env.NEXT_PUBLIC_EXPLORER_URL}/address/`
        }
      ]}
    >
      {children}
    </WalletPage>
  )
}

type WalletPageLoggedInProps = {
  children?: JSX.Element | Array<JSX.Element>
}

WalletPageLoggedIn.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
}
