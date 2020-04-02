import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import Filecoin from '@openworklabs/filecoin-wallet-provider'

import { useWalletProvider } from '..'
import { createWalletProvider } from '../state'
import { SINGLE_KEY } from '../../constants'
import { walletList } from '../../store/actions'
import toLowerCaseMsgFields from '../../utils/toLowerCaseMsgFields'

export default dynamic({
  ssr: false,
  loader: async () => {
    const rustModule = await import('@zondax/filecoin-signer-wasm')
    const SingleKeyProvider = privateKey => {
      return {
        getAccounts: async (_, __, network = 't') => {
          return [rustModule.key_recover(privateKey).address]
        },
        sign: async (_, filecoinMessage) => {
          const formattedMessage = toLowerCaseMsgFields(
            filecoinMessage.encode()
          )
          const { private_hexstring } = rustModule.key_recover(privateKey)
          const { signature } = rustModule.transaction_sign(
            formattedMessage,
            private_hexstring
          )
          return signature.data
        },
        type: SINGLE_KEY
      }
    }

    const ProviderCreator = ({ privateKey, ready }) => {
      const [createdProvider, setCreatedProvider] = useState(false)
      const { dispatch, fetchDefaultWallet } = useWalletProvider()
      const dispatchRdx = useDispatch()
      const router = useRouter()
      useEffect(() => {
        const instantiateProvider = async () => {
          const provider = new Filecoin(SingleKeyProvider(privateKey), {
            apiAddress: 'https://proxy.openworklabs.com/rpc/v0'
          })
          dispatch(createWalletProvider(provider))
          setCreatedProvider(true)
          const wallet = await fetchDefaultWallet(provider)
          dispatchRdx(walletList([wallet]))
        }

        if (ready && !createdProvider) {
          instantiateProvider()
        }
      }, [
        privateKey,
        createdProvider,
        setCreatedProvider,
        dispatch,
        fetchDefaultWallet,
        router,
        dispatchRdx,
        ready
      ])
      return <></>
    }

    ProviderCreator.propTypes = {
      privateKey: PropTypes.string.isRequired,
      ready: PropTypes.bool
    }

    ProviderCreator.defaultProps = {
      ready: false
    }

    return ProviderCreator
  }
})
