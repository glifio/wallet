import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import Filecoin from '@openworklabs/filecoin-wallet-provider'

import { useWalletProvider } from '../../../../WalletProvider'
import { createWalletProvider } from '../../../../WalletProvider/state'
import { MNEMONIC } from '../../../../constants'
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
          const answer = rustModule.key_derive(
            'equip will roof matter pink blind book anxiety banner elbow sun young',
            "m/44'/461'/5'/0'/0"
          )
          return [answer.address]
        },
        sign: async (path, unsignedMessage) => {},
        type: MNEMONIC
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

    // Return a React component that calls the add_one method on the wasm module
    return ProviderCreator
  }
})
