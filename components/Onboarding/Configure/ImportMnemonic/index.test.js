import { cleanup, render, screen, act, fireEvent } from '@testing-library/react'
import composeMockAppTree from '../../../../test-utils/composeMockAppTree'
import { mockRouterPush } from '../../../../test-utils/mocks/mock-routing'
import { flushPromises } from '../../../../test-utils'

import ImportMnemonic from '.'
import { PAGE, TESTNET_PATH_CODE } from '../../../../constants'
import { mockFetchDefaultWallet } from '../../../../test-utils/composeMockAppTree/createWalletProviderContextFuncs'
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

  test.only('it sends the user to wallet view, with a wallet in state upon successful config', async () => {
    const { Tree, getWalletProviderState } = composeMockAppTree('preOnboard')

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
    expect(mockRouterPush).toHaveBeenCalledWith(PAGE.WALLET_HOME)
    expect(mockFetchDefaultWallet).toHaveBeenCalled()
    const wallet = getWalletProviderState().wallets[0]
    expect(wallet.address).toBeTruthy()
    expect(wallet.path).toBe(createPath(TESTNET_PATH_CODE, 0))
    expect(container.firstChild).toMatchSnapshot()
  })
})
