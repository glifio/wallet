import React from 'react'
import { NetworkChecker } from './check-network'
import { cleanup, render } from '@testing-library/react'
import Router from 'next/router'
import { FilecoinNumber } from '@openworklabs/filecoin-number'

import { WalletProviderContext } from '../WalletProvider'
import { SINGLE_KEY } from '../constants'

jest.mock('next/router')
Router.replace.mockImplementation(() => {})

describe('NetworkChecker', () => {
  afterEach(cleanup)

  test('it does not render any children', () => {
    const mockDispatch = jest.fn((...args) => args)
    const query = {}
    const pathname = '/'
    const network = 't'
    const wallets = []

    const { container } = render(
      <NetworkChecker
        pathname={pathname}
        query={query}
        networkFromRdx={network}
        wallets={wallets}
        switchNetwork={mockDispatch}
      />
    )

    expect(container.firstChild).toBeNull()
  })

  test('it dispatches an action and replaces the URL when the network in the URL bar mismatches what is in redux', () => {
    const mockDispatch = jest.fn((...args) => args)
    const query = { network: 'f' } // user started on mainnet
    const pathname = '/onboard'
    const networkInRedux = 't' // network in redux is testnet
    const wallets = []
    Router.replace.mockImplementationOnce(uri => {
      expect(uri).toBe('/onboard?network=f')
    })

    render(
      <NetworkChecker
        pathname={pathname}
        query={query}
        networkFromRdx={networkInRedux}
        wallets={wallets}
        switchNetwork={mockDispatch}
      />
    )

    expect(mockDispatch).toHaveBeenCalledWith('f')
  })

  test('it dispatches an action and replaces the URL when no network is passed in the URL bar', () => {
    const mockDispatch = jest.fn((...args) => args)
    const query = {} // no network
    const pathname = '/onboard'
    const networkInRedux = 't' // network in redux is testnet
    const wallets = []
    Router.replace.mockImplementationOnce(uri => {
      expect(uri).toBe('/onboard?network=t')
    })

    render(
      <NetworkChecker
        pathname={pathname}
        query={query}
        networkFromRdx={networkInRedux}
        wallets={wallets}
        switchNetwork={mockDispatch}
      />
    )

    expect(mockDispatch).toHaveBeenCalledWith('t')
  })

  test('it does not fire an action or replace uri when the network in the url bar matches redux', () => {
    const mockDispatch = jest.fn((...args) => args)
    const query = { network: 't' }
    const pathname = '/'
    const networkInRedux = 't'
    const wallets = []

    const mockRouterReplace = jest.fn(() => {})
    Router.replace.mockImplementationOnce(mockRouterReplace)

    render(
      <NetworkChecker
        pathname={pathname}
        query={query}
        networkFromRdx={networkInRedux}
        wallets={wallets}
        switchNetwork={mockDispatch}
      />
    )

    expect(mockDispatch).not.toHaveBeenCalled()
    expect(mockRouterReplace).not.toHaveBeenCalled()
  })

  test('it replaces the uri and dispatches an action when the network changes after the component has already mounted', () => {
    const mockDispatch = jest.fn((...args) => args)
    const query = { network: 't' }
    const pathname = '/'
    const networkInRedux = 't'
    const wallets = []

    const { rerender } = render(
      <NetworkChecker
        pathname={pathname}
        query={query}
        networkFromRdx={networkInRedux}
        wallets={wallets}
        switchNetwork={mockDispatch}
      />
    )

    expect(mockDispatch).not.toHaveBeenCalled()

    rerender(
      <NetworkChecker
        pathname={pathname}
        query={{ network: 'f' }}
        networkFromRdx={networkInRedux}
        wallets={wallets}
        switchNetwork={mockDispatch}
      />
    )

    expect(mockDispatch).toHaveBeenCalled()
  })

  test('it updates the wallets in redux with the proper network protocol prefix after network switch', done => {
    const mockDispatch = jest.fn((...args) => args)
    const query = { network: 't' }
    const pathname = '/'
    const networkInRedux = 't' // network in redux is testnet
    const wallets = [
      {
        address: 't1jdlfl73voaiblrvn2yfivvn5ifucwwv5f26nfza',
        balance: new FilecoinNumber('1', 'fil'),
        path: SINGLE_KEY
      },
      {
        address: 't1jdlfl73voaiblrvn2yfivvn5ifucwwv5f26nfza',
        balance: new FilecoinNumber('1', 'fil'),
        path: SINGLE_KEY
      }
    ]

    const walletProvider = {
      getBalance: jest.fn(() => Promise.resolve(new FilecoinNumber('1', 'fil')))
    }

    const { rerender } = render(
      <WalletProviderContext.Provider value={{ state: { walletProvider } }}>
        <NetworkChecker
          pathname={pathname}
          query={query}
          networkFromRdx={networkInRedux}
          wallets={wallets}
          switchNetwork={mockDispatch}
        />
      </WalletProviderContext.Provider>
    )

    expect(mockDispatch).not.toHaveBeenCalled()

    rerender(
      <WalletProviderContext.Provider value={{ state: { walletProvider } }}>
        <NetworkChecker
          pathname={pathname}
          query={{ network: 'f' }}
          networkFromRdx={networkInRedux}
          wallets={wallets}
          switchNetwork={mockDispatch}
        />
      </WalletProviderContext.Provider>
    )

    setTimeout(() => {
      const adjustedWallets = wallets.map(w => ({
        ...w,
        address: w.address.replace('t', 'f'),
        balance: w.balance
      }))
      expect(JSON.stringify(mockDispatch.mock.results[0].value[1])).toEqual(
        JSON.stringify(adjustedWallets)
      )
      expect(mockDispatch.mock.results[0].value[0]).toBe('f')
      expect(mockDispatch).toHaveBeenCalled()
      done()
    })
  })
})
