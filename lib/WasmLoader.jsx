import React, { useContext, createContext } from 'react'
import Router from 'next/router'
import dynamic from 'next/dynamic'
import { node } from 'prop-types'
import prepareSubproviders from '../WalletProvider/prepareSubproviders'
import reportError from '../utils/reportError'

export const WasmContext = createContext({ loaded: false })

// Loads the wasm asyncronously and exposes it via a hook
export const WasmLoader = dynamic({
  ssr: false,
  loader: async () => {
    let rustModule = {}
    try {
      rustModule = await import('@zondax/filecoin-signing-tools')
    } catch (err) {
      reportError('lib/WasmLoader:1', false)
      Router.push('/error/use-desktop-browser')
    }
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
