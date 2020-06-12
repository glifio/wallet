import { cleanup, render, screen, act, fireEvent } from '@testing-library/react'
import composeMockAppTree from '../../../../test-utils/composeMockAppTree'
import { mockRouterPush } from '../../../../test-utils/mocks/mock-routing'
import { flushPromises } from '../../../../test-utils'

import Create from '.'

describe('Create seed phrase configuration', () => {
  beforeAll(() => {
    global.URL.createObjectURL = jest.fn()
  })
  afterEach(() => {
    jest.clearAllMocks()
    cleanup()
  })
  test('it renders correctly', () => {
    const { Tree } = composeMockAppTree('postOnboard')

    const { container } = render(
      <Tree>
        <Create initialWalkthroughStep={3} />
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
        <Create initialWalkthroughStep={3} />
      </Tree>
    )

    await act(async () => {
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
