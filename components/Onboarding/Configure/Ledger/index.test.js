import { cleanup, render, screen, act, fireEvent } from '@testing-library/react'
import composeMockAppTree from '../../../../test-utils/composeMockAppTree'
import { initialState as wpInitialState } from '../../../../WalletProvider/state'
import ConnectLedger from './ConnectLedger'
import { initialLedgerState } from '../../../../utils/ledger/ledgerStateManagement'
import { mockRouterPush } from '../../../../test-utils/mocks/mock-routing'
import { flushPromises } from '../../../../test-utils'
import { PAGE, TESTNET_PATH_CODE } from '../../../../constants'
import { mockFetchDefaultWallet } from '../../../../test-utils/composeMockAppTree/createWalletProviderContextFuncs'
import createPath from '../../../../utils/createPath'

jest.mock('../../../../WalletProvider')

describe('Ledger configuration', () => {
  afterEach(() => {
    jest.clearAllMocks()
    cleanup()
  })

  test('it renders correctly', () => {
    const { Tree } = composeMockAppTree('preOnboard')
    const { container } = render(
      <Tree>
        <ConnectLedger msig={true} />
      </Tree>
    )
    expect(screen.getByText(/Unlock & Open/)).toBeInTheDocument()
    expect(
      screen.getByText(
        /Please unlock your Ledger device and open the Filecoin App/
      )
    ).toBeInTheDocument()

    expect(container.firstChild).toMatchSnapshot()
  })

  test('it renders inUseByAnotherApp ledger error correctly', () => {
    const mockWPState = {
      ...wpInitialState,
      ledger: {
        ...initialLedgerState,
        inUseByAnotherApp: true
      }
    }

    const { Tree } = composeMockAppTree('preOnboard', {
      walletProviderInitialState: mockWPState
    })
    const { container } = render(
      <Tree>
        <ConnectLedger msig={false} />
      </Tree>
    )
    expect(
      screen.getByText(/(Most of the time, this is Ledger Live!)/)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Please quit any other App using your Ledger device./)
    ).toBeInTheDocument()

    expect(container.firstChild).toMatchSnapshot()
  })

  test('it renders connectedFailure ledger error in the UI correctly', () => {
    const mockWPState = {
      ...wpInitialState,

      ledger: {
        ...initialLedgerState,
        connectedFailure: true
      }
    }

    const { Tree } = composeMockAppTree('preOnboard', {
      walletProviderInitialState: mockWPState
    })
    const { container } = render(
      <Tree>
        <ConnectLedger msig={false} />
      </Tree>
    )
    expect(
      screen.getByText('Is your Ledger device plugged in?')
    ).toBeInTheDocument()

    expect(container.firstChild).toMatchSnapshot()
  })

  test('it renders locked ledger error correctly', () => {
    const mockWPState = {
      ...wpInitialState,
      ledger: {
        ...initialLedgerState,
        locked: true
      }
    }

    const { Tree } = composeMockAppTree('preOnboard', {
      walletProviderInitialState: mockWPState
    })
    const { container } = render(
      <Tree>
        <ConnectLedger msig={false} />
      </Tree>
    )
    expect(
      screen.getByText('Is your Ledger device unlocked?')
    ).toBeInTheDocument()

    expect(container.firstChild).toMatchSnapshot()
  })

  test('it renders filecoinAppNotOpen error in the UI correctly', () => {
    const mockWPState = {
      ...wpInitialState,
      ledger: {
        ...initialLedgerState,
        filecoinAppNotOpen: true
      }
    }

    const { Tree } = composeMockAppTree('preOnboard', {
      walletProviderInitialState: mockWPState
    })
    const { container } = render(
      <Tree>
        <ConnectLedger msig={false} />
      </Tree>
    )
    expect(
      screen.getByText('Is the Filecoin App open on your Ledger device?')
    ).toBeInTheDocument()

    expect(container.firstChild).toMatchSnapshot()
  })

  test('it renders replug error correctly', () => {
    const mockWPState = {
      ...wpInitialState,
      ledger: {
        ...initialLedgerState,
        replug: true
      }
    }

    const { Tree } = composeMockAppTree('preOnboard', {
      walletProviderInitialState: mockWPState
    })
    const { container } = render(
      <Tree>
        <ConnectLedger msig={false} />
      </Tree>
    )
    expect(
      screen.getByText(
        'Please quit the Filecoin app, and unplug/replug your Ledger device, and try again.'
      )
    ).toBeInTheDocument()

    expect(container.firstChild).toMatchSnapshot()
  })

  test('it renders busy error in the UI correctly', () => {
    const mockWPState = {
      ...wpInitialState,
      ledger: {
        ...initialLedgerState,
        busy: true
      }
    }

    const { Tree } = composeMockAppTree('preOnboard', {
      walletProviderInitialState: mockWPState
    })
    const { container } = render(
      <Tree>
        <ConnectLedger msig={false} />
      </Tree>
    )
    expect(
      screen.getByText('Is your Ledger device locked or busy?')
    ).toBeInTheDocument()

    expect(container.firstChild).toMatchSnapshot()
  })

  test('it fetches the default wallet and adds it to the wallet provider state', async () => {
    const { Tree, getWalletProviderState } = composeMockAppTree('preOnboard')
    const {
      /* container */
    } = render(
      <Tree>
        <ConnectLedger msig={false} />
      </Tree>
    )

    await act(async () => {
      fireEvent.click(
        screen.getByText('My Ledger device is unlocked & Filecoin app open')
      )
      await flushPromises()
    })

    expect(mockFetchDefaultWallet).toHaveBeenCalled()
    const wallet = getWalletProviderState().wallets[0]
    expect(wallet.address).toBeTruthy()
    expect(wallet.path).toBe(createPath(TESTNET_PATH_CODE, 0))
  })

  test('it pushes to the right url', async () => {
    const { Tree } = composeMockAppTree('preOnboard')
    const {
      /* container */
    } = render(
      <Tree>
        <ConnectLedger msig={false} />
      </Tree>
    )

    await act(async () => {
      fireEvent.click(
        screen.getByText('My Ledger device is unlocked & Filecoin app open')
      )
      await flushPromises()
    })
    expect(mockRouterPush).toHaveBeenCalledWith(PAGE.WALLET_HOME)
  })

  test('it pushes to the right url for msig', async () => {
    const { Tree } = composeMockAppTree('preOnboard')
    const {
      /*container*/
    } = render(
      <Tree>
        <ConnectLedger msig={true} />
      </Tree>
    )

    await act(async () => {
      fireEvent.click(
        screen.getByText('My Ledger device is unlocked & Filecoin app open')
      )
      await flushPromises()
    })
    expect(mockRouterPush).toHaveBeenCalledWith(PAGE.MSIG_CHOOSE_ACCOUNTS)
  })
})
