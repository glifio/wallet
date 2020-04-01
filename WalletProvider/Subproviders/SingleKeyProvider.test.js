import { act, cleanup, render } from '@testing-library/react'
import { Provider } from 'react-redux'
import SingleKeyProvider from './SingleKeyProvider'
import mockRustModule from '@zondax/filecoin-signer-wasm'

import WalletProviderContextWrapper from '../'
import { flushPromises, initializeStore } from '../../test-utils'
import { initialState } from '../../store/states'

jest.mock('@zondax/filecoin-signer-wasm')

const renderSingleKeyProvider = state => {
  const store = initializeStore(state ? state : Object.freeze(initialState))

  return {
    ...render(
      <Provider store={store}>
        {
          <WalletProviderContextWrapper network='t'>
            <SingleKeyProvider network='t' privateKey='xxxyyyzzz' />
          </WalletProviderContextWrapper>
        }
      </Provider>
    ),
    store
  }
}

describe('SingleKey', () => {
  afterEach(cleanup)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('it does not render anything', async () => {
    await act(async () => {
      const { container } = renderSingleKeyProvider()
      expect(container.firstChild).toBeNull()
    })
  })
})
