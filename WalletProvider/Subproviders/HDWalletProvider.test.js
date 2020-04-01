import { act, cleanup, render } from '@testing-library/react'
import { Provider } from 'react-redux'
import HDWalletProvider from './HDWalletProvider'
import mockRustModule from '@zondax/filecoin-signer-wasm'

import WalletProviderContextWrapper from '../'
import { initializeStore } from '../../test-utils'
import { initialState } from '../../store/states'

jest.mock('@zondax/filecoin-signer-wasm')

const renderHDWalletProvider = state => {
  const store = initializeStore(state ? state : Object.freeze(initialState))

  return {
    ...render(
      <Provider store={store}>
        {
          <WalletProviderContextWrapper network='t'>
            <HDWalletProvider
              network='t'
              mnemonic='cave income cousin wood glare have forest alcohol social thing fame tissue essay surface coral flock brick destroy remind depart hover rose skin alarm'
            />
          </WalletProviderContextWrapper>
        }
      </Provider>
    ),
    store
  }
}

describe('HDWallet', () => {
  afterEach(cleanup)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('it does not render anything', async () => {
    await act(async () => {
      const { container } = renderHDWalletProvider()
      expect(container.firstChild).toBeNull()
    })
  })
})
