import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import Filecoin from '@openworklabs/filecoin-wallet-provider'

import { useWalletProvider } from '../../../../WalletProvider'
import { createWalletProvider } from '../../../../WalletProvider/state'
import { HD_WALLET } from '../../../../constants'
import { walletList } from '../../../../store/actions'

const create = () =>
  'equip will roof matter pink blind book anxiety banner elbow sun young'

export default dynamic({
  ssr: false,
  loader: async () => {
    // Import the wasm module
    const rustModule = await import('fcwebsigner')
    const HDWalletProvider = mnemonic => {
      let privateMnemonic = mnemonic
      if (!privateMnemonic) privateMnemonic = create()
      return {
        getAccounts: async (nStart = 0, nEnd = 5, network = 't') => {
          const accounts = []
          for (let i = nStart; i < nEnd; i += 1) {
            const networkCode = network === 't' ? 1 : 461
            accounts.push(
              rustModule.key_derive(
                mnemonic,
                `m/44'/${networkCode}'/5'/0'/${i}`
              ).address
            )
          }
          return accounts
        },
        sign: async (path, unsignedMessage) => {
          const privateKey = rustModule.key_derive(mnemonic, path).prvkey
          return rustModule
            .sign_transaction(
              JSON.stringify(unsignedMessage),
              privateKey.toString('hex')
            )
            .toString('base64')
        },
        type: HD_WALLET
      }
    }

    const ProviderCreator = ({ mnemonic, network }) => {
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

        if (mnemonic && !createdProvider) {
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
        dispatchRdx
      ])
      return <></>
    }

    ProviderCreator.propTypes = {
      mnemonic: PropTypes.string.isRequired,
      network: PropTypes.oneOf(['t', 'f'])
    }

    return ProviderCreator
  }
})
