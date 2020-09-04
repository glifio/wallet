import React from 'react'
import { NetworkCheck as NetworkChecker } from './check-network'
import { cleanup, render } from '@testing-library/react'
import Router from 'next/router'
import { FilecoinNumber } from '@openworklabs/filecoin-number'

import { WalletProviderContext } from '../WalletProvider'
import { SINGLE_KEY, MAINNET, TESTNET } from '../constants'

jest.mock('next/router')

const wallet = {
  balance: new FilecoinNumber('1', 'attofil'),
  address: 't1wiomfs6nimyfztx6kyaxrry5yiewrjraqyou7oq',
  path: SINGLE_KEY
}

describe('NetworkChecker', () => {
  beforeEach(() => {
    cleanup()
    jest.clearAllMocks()
  })

  test('it does not render any children', () => {
    const mockDispatch = jest.fn((...args) => args)
    const query = {}
    const pathname = '/'
    const network = TESTNET
    const wallets = [wallet]

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
    const query = { network: MAINNET } // user started on mainnet
    const pathname = '/'
    const networkInRedux = TESTNET // network in redux is testnet
    const wallets = [wallet]
    Router.replace.mockImplementationOnce(uri => {
      expect(uri).toBe('/?network=f')
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

    expect(mockDispatch).toHaveBeenCalledWith(MAINNET)
  })

  test('it dispatches an action and replaces the URL when no network is passed in the URL bar', () => {
    const mockDispatch = jest.fn((...args) => args)
    const query = {} // no network
    const pathname = '/'
    const networkInRedux = TESTNET // network in redux is testnet
    const wallets = [wallet]
    Router.replace.mockImplementationOnce(uri => {
      expect(uri).toBe('/?network=t')
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

    expect(mockDispatch).toHaveBeenCalledWith(TESTNET)
  })

  test('it does not fire an action or replace uri when the network in the url bar matches redux', () => {
    const mockDispatch = jest.fn((...args) => args)
    const query = { network: TESTNET }
    const pathname = '/'
    const networkInRedux = TESTNET
    const wallets = [wallet]

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
    const query = { network: TESTNET }
    const pathname = '/home'
    const networkInRedux = TESTNET
    const wallets = [wallet]

    const getBalanceMock = jest.fn(async () => new FilecoinNumber('1', 'fil'))
    const getAccountsMock = jest.fn(async () => [
      'f1jdlfl73voaiblrvn2yfivvn5ifucwwv5f26nfza',
      'f1wiomfs6nimyfztx6kyaxrry5yiewrjraqyou7oq'
    ])

    const walletProvider = {
      getBalance: getBalanceMock,
      wallet: {
        type: SINGLE_KEY,
        getAccounts: getAccountsMock
      }
    }

    const { rerender } = render(
      <WalletProviderContext.Provider value={{ state: walletProvider }}>
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
      <NetworkChecker
        pathname={pathname}
        query={{ network: MAINNET }}
        networkFromRdx={networkInRedux}
        wallets={wallets}
        switchNetwork={mockDispatch}
      />
    )

    expect(mockDispatch).toHaveBeenCalled()
  })

  test('it does not update the uri and dispatch an action when the network changes to an invalid value after the component has already mounted', () => {
    const mockDispatch = jest.fn((...args) => args)
    const query = { network: TESTNET }
    const pathname = '/home'
    const networkInRedux = TESTNET
    const wallets = [wallet]

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
        query={{ network: 'c' }}
        networkFromRdx={networkInRedux}
        wallets={wallets}
        switchNetwork={mockDispatch}
      />
    )

    expect(mockDispatch).not.toHaveBeenCalled()
  })

  test('it does not attach query params on error pages', () => {
    const mockDispatch = jest.fn((...args) => args)
    const query = {} // no network
    const pathname = '/error' // home
    const networkInRedux = TESTNET // network in redux is testnet
    const wallets = [wallet]
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

  test('it defaults to mainnet on the investor page', () => {
    const mockDispatch = jest.fn((...args) => args)
    const query = { network: TESTNET } // no network
    const pathname = '/vault'
    const networkInRedux = TESTNET // network in redux is testnet
    const wallets = [wallet]
    Router.replace.mockImplementationOnce(uri => {
      expect(uri).toBe('/?network=f')
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

    expect(mockDispatch).toHaveBeenCalledWith(MAINNET)
  })

  test('it resets the wallets in redux with the proper network protocol prefix after network switch', done => {
    const mockDispatch = jest.fn((...args) => args)
    const query = { network: TESTNET }
    const pathname = '/'
    const networkInRedux = TESTNET // network in redux is testnet
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

    const getBalanceMock = jest.fn(async () => new FilecoinNumber('1', 'fil'))
    const getAccountsMock = jest.fn(async () => [
      'f1jdlfl73voaiblrvn2yfivvn5ifucwwv5f26nfza',
      'f1wiomfs6nimyfztx6kyaxrry5yiewrjraqyou7oq'
    ])

    const walletProvider = {
      getBalance: getBalanceMock,
      wallet: {
        type: SINGLE_KEY,
        getAccounts: getAccountsMock
      }
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
          query={{ network: MAINNET }}
          networkFromRdx={networkInRedux}
          wallets={wallets}
          switchNetwork={mockDispatch}
        />
      </WalletProviderContext.Provider>
    )

    setTimeout(() => {
      expect(mockDispatch.mock.results[0].value[1].length).toBe(1)
      expect(mockDispatch.mock.results[0].value[1][0].address).toBe(
        'f1jdlfl73voaiblrvn2yfivvn5ifucwwv5f26nfza'
      )
      expect(mockDispatch.mock.results[0].value[1][0].path).toBe(SINGLE_KEY)
      expect(mockDispatch.mock.results[0].value[1][0].balance.toFil()).toBe('1')
      expect(getBalanceMock).toHaveBeenCalled()
      expect(getAccountsMock).toHaveBeenCalled()
      done()
    })
  })
})
