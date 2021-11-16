import { cleanup, render, screen, act, fireEvent } from '@testing-library/react'
import composeMockAppTree from '../../../../test-utils/composeMockAppTree'
import { mockRouterPush } from '../../../../test-utils/mocks/mock-routing'
import { flushPromises } from '../../../../test-utils'

import ImportMnemonic from '.'
import { PAGE, TESTNET_PATH_CODE } from '../../../../constants'
import {
  mockFetchDefaultWallet,
  mockWalletList
} from '../../../../test-utils/composeMockAppTree/createWalletProviderContextFuncs'
import createPath from '../../../../utils/createPath'

jest.mock('../../../../WalletProvider')

describe('Import seed phrase configuration', () => {
  afterEach(() => {
    jest.clearAllMocks()
    cleanup()
  })
  test('it renders correctly', () => {
    const { Tree } = composeMockAppTree('postOnboard')

    const { container } = render(
      <Tree>
        <ImportMnemonic />
      </Tree>
    )
    expect(screen.getByText(/Input, Import & Proceed/)).toBeInTheDocument()
    expect(
      screen.getByText(/Please input your seed phrase below to continue/)
    ).toBeInTheDocument()
    expect(screen.getByText(/Show/)).toBeInTheDocument()
    expect(container.firstChild).toMatchSnapshot()
  })

  test('it sends the user to wallet view, with a wallet in state upon successful config', async () => {
    const mockWalletProviderDispatch = jest.fn()
    const { Tree } = composeMockAppTree('preOnboard', {
      walletProviderDispatch: mockWalletProviderDispatch
    })

    const { container } = render(
      <Tree>
        <ImportMnemonic />
      </Tree>
    )

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Your seed phrase'), {
        target: {
          value:
            'slender spread awkward chicken noise useful thank dentist tip bronze ritual explain version spot collect whisper glow peanut bus local country album punch frown'
        }
      })
      await flushPromises()

      fireEvent.click(screen.getByText('Next'))
      await flushPromises()
    })
    expect(container.firstChild).toMatchSnapshot()
    expect(mockRouterPush).toHaveBeenCalledWith(PAGE.WALLET_HOME)
    expect(mockWalletProviderDispatch.mock.calls[0][0].type).toBe(
      'CREATE_WALLET_PROVIDER'
    )
    expect(mockFetchDefaultWallet).toHaveBeenCalled()
    const [wallet] = mockWalletList.mock.calls[0][0]
    expect(wallet.address).toBeTruthy()
    expect(wallet.path).toBe(createPath(TESTNET_PATH_CODE, 0))
  })
})
