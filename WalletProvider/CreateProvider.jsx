import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import Filecoin from '@openworklabs/filecoin-wallet-provider'

import { useWalletProvider } from '.'
import { createWalletProvider } from './state'
import { HD_WALLET } from '../constants'
import { walletList } from '../store/actions'
import createPath from '../utils/createPath'
import { MNEMONIC_PROPTYPE } from '../customPropTypes'

export default dynamic({
  ssr: false,
  loader: async () => {
    const rustModule = await import('fcwebsigner')
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
        sign: async (path, unsignedMessage) => {
          const privateKey = rustModule.key_derive(mnemonic, path).prvkey
          return Buffer.from(
            rustModule.sign_transaction(
              JSON.stringify(unsignedMessage),
              privateKey.toString('hex')
            ),
            'hex'
          ).toString('base64')
        },
        type: HD_WALLET
      }
    }

    const ProviderCreator = ({ mnemonic, network, ready }) => {
      const [createdProvider, setCreatedProvider] = useState(false)
      const { dispatch, fetchDefaultWallet } = useWalletProvider()
      const dispatchRdx = useDispatch()
      const router = useRouter()
      useEffect(() => {
        const instantiateProvider = async () => {
          const provider = new Filecoin(HDWalletProvider(mnemonic), {
            apiAddress: 'https://proxy.openworklabs.com/rpc/v0',
            network
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
        network,
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
      network: PropTypes.oneOf(['t', 'f']).isRequired,
      ready: PropTypes.bool
    }

    ProviderCreator.defaultProps = {
      ready: false
    }

    return ProviderCreator
  }
})
