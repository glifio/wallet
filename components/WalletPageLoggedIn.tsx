import { useCallback } from 'react'
import PropTypes from 'prop-types'
import {
  LoginOption,
  NetworkConnection,
  useWallet,
  useWalletProvider
} from '@glif/react-components'
import { useRouter } from 'next/router'

import { resetWallet, navigate } from '../utils/urlParams'
import { GLIF_DISCORD, PAGE } from '../constants'
import WalletPage from './WalletPage'

export default function WalletPageLoggedIn({
  children
}: WalletPageLoggedInProps) {
  const router = useRouter()
  const wallet = useWallet()
  const { loginOption } = useWalletProvider()
  const onNodeDisconnect = useCallback(() => {
    navigate(router, { pageUrl: PAGE.NODE_DISCONNECTED })
  }, [router])

  const appHeaderLinks =
    loginOption === LoginOption.IMPORT_SINGLE_KEY
      ? [
          {
            title: 'Account Home',
            url: PAGE.WALLET_HOME
          },
          {
            title: 'Send FIL',
            url: PAGE.WALLET_SEND
          },
          {
            title: 'Discord',
            url: GLIF_DISCORD
          }
        ]
      : [
          {
            title: 'Account Home',
            url: PAGE.WALLET_HOME
          },
          {
            title: 'Switch Account',
            url: PAGE.WALLET_CHOOSE_ACCOUNTS
          },
          {
            title: 'Send FIL',
            url: PAGE.WALLET_SEND
          },
          {
            title: 'Discord',
            url: GLIF_DISCORD
          }
        ]

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
          disableLink: false,
          stopPropagation: true,
          hideCopy: false,
          hideCopyText: true
        }
      ]}
      appHeaderLinks={appHeaderLinks}
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
