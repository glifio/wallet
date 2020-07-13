import React, { useContext, createContext } from 'react'
import dynamic from 'next/dynamic'
import { node } from 'prop-types'
import prepareSubproviders from '../WalletProvider/prepareSubproviders'

export const WasmContext = createContext({ loaded: false })

// Loads the wasm asyncronously and exposes it via a hook
export const WasmLoader = dynamic({
  ssr: false,
  loader: async () => {
    const rustModule = await import('@zondax/filecoin-signing-tools')
    const walletSubproviders = prepareSubproviders(rustModule)
    const WasmProvider = ({ children }) => {
      return (
        <WasmContext.Provider
          value={{ ...rustModule, walletSubproviders, loaded: true }}
        >
          {children}
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
