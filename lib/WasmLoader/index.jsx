import React, { useContext, createContext } from 'react'
import dynamic from 'next/dynamic'
import { node } from 'prop-types'
import prepareSubproviders from '../../WalletProvider/prepareSubproviders'
import reportError from '../../utils/reportError'
import CantLoadWasm from './CantLoadWasm'

export const WasmContext = createContext({ loaded: false })

// Loads the wasm asyncronously and exposes it via a hook
export const WasmLoader = dynamic({
  ssr: false,
  loader: async () => {
    let rustModule = {}
    let loadError = null
    try {
      rustModule = await import('@zondax/filecoin-signing-tools')
    } catch (err) {
      reportError('lib/WasmLoader:1', false)
      loadError = true
    }

    const walletSubproviders = prepareSubproviders(rustModule)
    const WasmProvider = ({ children }) => {
      return (
        <WasmContext.Provider
          value={{ ...rustModule, walletSubproviders, loaded: true }}
        >
          {loadError ? <CantLoadWasm /> : children}
        </WasmContext.Provider>
      )
    }

    WasmProvider.propTypes = {
      children: node
    }

    WasmProvider.defaultProps = {
      children: <></>
    }
    return WasmProvider
  }
})

export const useWasm = () => {
  return useContext(WasmContext)
}
