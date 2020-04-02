import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import Filecoin from '@openworklabs/filecoin-wallet-provider'

import { useWalletProvider } from '..'
import { createWalletProvider } from '../state'
import { HD_WALLET } from '../../constants'
import { walletList } from '../../store/actions'
import createPath from '../../utils/createPath'
import toLowerCaseMsgFields from '../../utils/toLowerCaseMsgFields'
import { MNEMONIC_PROPTYPE } from '../../customPropTypes'

export default dynamic({
  ssr: false,
  loader: async () => {
    const rustModule = await import('@zondax/filecoin-signer-wasm')
    const HDWalletProvider = mnemonic => {
      return {
        getAccounts: async (nStart = 0, nEnd = 5, network = 't') => {
          const accounts = []
          for (let i = nStart; i < nEnd; i += 1) {
            const networkCode = network === 't' ? 1 : 461
            accounts.push(
              rustModule.key_derive(mnemonic, createPath(networkCode, i))
                .address
            )
          }
          return accounts
        },
        sign: async (path, filecoinMessage) => {
          const formattedMessage = toLowerCaseMsgFields(
            filecoinMessage.encode()
          )
          const { private_hexstring } = rustModule.key_derive(mnemonic, path)
          const { signature } = rustModule.transaction_sign(
            formattedMessage,
            private_hexstring
          )
          return signature.data
        },
        type: HD_WALLET
      }
    }

    const ProviderCreator = ({ mnemonic, ready }) => {
      const [createdProvider, setCreatedProvider] = useState(false)
      const { dispatch, fetchDefaultWallet } = useWalletProvider()
      const dispatchRdx = useDispatch()
      const router = useRouter()
      useEffect(() => {
        const instantiateProvider = async () => {
          const provider = new Filecoin(HDWalletProvider(mnemonic), {
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
        mnemonic,
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
      mnemonic: MNEMONIC_PROPTYPE,
      ready: PropTypes.bool
    }

    ProviderCreator.defaultProps = {
      ready: false
    }

    return ProviderCreator
  }
})
