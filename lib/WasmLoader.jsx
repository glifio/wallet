import React, { useContext, createContext } from 'react'
import dynamic from 'next/dynamic'
import { node } from 'prop-types'
import prepareSubproviders from '../WalletProvider/prepareSubproviders'

export const WasmContext = createContext({ loaded: false })

export const WasmLoader = dynamic({
  ssr: false,
  loader: async () => {
    const rustModule = await import('@zondax/filecoin-signer-wasm')
    const walletSubProviders = prepareSubproviders(rustModule)
    const WasmProvider = ({ children }) => {
      return (
        <WasmContext.Provider
          value={{ ...rustModule, walletSubProviders, loaded: true }}
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
