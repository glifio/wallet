import { cleanup, render, screen, act, fireEvent } from '@testing-library/react'
import composeMockAppTree from '../../../../test-utils/composeMockAppTree'
import { mockRouterPush } from '../../../../test-utils/mocks/mock-routing'
import { flushPromises } from '../../../../test-utils'

import ImportPrivateKey from '.'

describe('Import private key configuration', () => {
  afterEach(() => {
    jest.clearAllMocks()
    cleanup()
  })
  test('it renders correctly', () => {
    const { Tree } = composeMockAppTree('postOnboard')

    const { container } = render(
      <Tree>
        <ImportPrivateKey />
      </Tree>
    )
    expect(container.firstChild).toMatchSnapshot()
  })

  test('it sends the user to wallet view, with a wallet in state upon successful config', async () => {
    const mockWalletProviderDispatch = jest.fn()
    const { Tree, store } = composeMockAppTree('preOnboard', {
      walletProviderDispatch: mockWalletProviderDispatch
    })

    const { container } = render(
      <Tree>
        <ImportPrivateKey />
      </Tree>
    )

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Your private key'), {
        target: { value: 'private key string' }
      })
      await flushPromises()

      fireEvent.click(screen.getByText('Next'))
      await flushPromises()
    })
    expect(container.firstChild).toMatchSnapshot()
    expect(mockRouterPush).toHaveBeenCalledWith('/home?network=t')
    expect(mockWalletProviderDispatch.mock.calls[0][0].type).toBe(
      'CREATE_WALLET_PROVIDER'
    )
    expect(store.getState().wallets.length).toBe(1)
  })
})
