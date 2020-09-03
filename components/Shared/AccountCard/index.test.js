import { cleanup, render, screen, act, fireEvent } from '@testing-library/react'
import AccountCard from '.'
import composeMockAppTree from '../../../test-utils/composeMockAppTree'
jest.mock('../../../utils/copyToClipboard')
import copyToClipboard from '../../../utils/copyToClipboard'

describe('AccountCard', () => {
  afterEach(cleanup)
  test('renders the card', () => {
    const { Tree } = composeMockAppTree('postOnboard')
    const { container } = render(
      <Tree>
        <AccountCard
          onAccountSwitch={() => {}}
          color='purple'
          address={'t0123456789'}
          walletType={'LEDGER'}
          onShowOnLedger={() => {}}
          ledgerBusy={false}
          mb={2}
        />
      </Tree>
    )

    expect(container.firstChild).toMatchSnapshot()
  })

  test('renders the card CREATE_MNEMONIC', () => {
    const { Tree } = composeMockAppTree('postOnboard')
    const { container } = render(
      <Tree>
        <AccountCard
          onAccountSwitch={() => {}}
          color='purple'
          address={'t0123456789'}
          walletType={'CREATE_MNEMONIC'}
          onShowOnLedger={() => {}}
          ledgerBusy={false}
          mb={2}
        />
      </Tree>
    )

    expect(container.firstChild).toMatchSnapshot()
  })

  test('renders the address', () => {
    const { Tree } = composeMockAppTree('postOnboard')
    render(
      <Tree>
        <AccountCard
          onAccountSwitch={() => {}}
          color='purple'
          address='t0123'
          walletType='LEDGER'
          onShowOnLedger={() => {}}
          ledgerBusy={false}
          mb={2}
        />
      </Tree>
    )

    expect(screen.getByText('t0123', { exact: false })).toBeInTheDocument()
    expect(screen.getByText('Your Address')).toBeInTheDocument()
  })

  test('clicking "Switch" calls onAccountSwitch', () => {
    const { Tree } = composeMockAppTree('postOnboard')
    const mockOnAccountSwitch = jest.fn()
    const { getByText } = render(
      <Tree>
        <AccountCard
          onAccountSwitch={mockOnAccountSwitch}
          color='purple'
          address='t0123'
          walletType='LEDGER'
          onShowOnLedger={() => {}}
          ledgerBusy={false}
          mb={2}
        />
      </Tree>
    )

    act(() => {
      fireEvent.click(getByText('Switch'))
    })

    expect(mockOnAccountSwitch).toHaveBeenCalled()
  })

  test('clicking "Show on Device" calls onShowOnLedger', () => {
    const { Tree } = composeMockAppTree('postOnboard')
    const mockOnShowOnLedger = jest.fn()
    const { getByText } = render(
      <Tree>
        <AccountCard
          onAccountSwitch={() => {}}
          color='purple'
          address='t0123'
          walletType='LEDGER'
          onShowOnLedger={mockOnShowOnLedger}
          ledgerBusy={false}
          mb={2}
        />
      </Tree>
    )

    act(() => {
      fireEvent.click(getByText('Show on Device'))
    })

    expect(mockOnShowOnLedger).toHaveBeenCalled()
  })

  test('clicking "Copy" calls copy', async () => {
    const { Tree } = composeMockAppTree('postOnboard')
    const mockCopyToClipboard = jest.fn(() => Promise.resolve('yo'))
    copyToClipboard.mockImplementationOnce(mockCopyToClipboard)

    const { getByText } = render(
      <Tree>
        <AccountCard
          onAccountSwitch={() => {}}
          color='purple'
          address='t0123'
          walletType='LEDGER'
          onShowOnLedger={() => {}}
          ledgerBusy={false}
          mb={2}
        />
      </Tree>
    )

    act(() => {
      fireEvent.click(getByText('Copy'))
    })

    expect(mockCopyToClipboard).toHaveBeenCalled()
    expect(screen.getByText('Copied')).toBeInTheDocument()
  })
})
