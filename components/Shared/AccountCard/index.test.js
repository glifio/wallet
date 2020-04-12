import { cleanup, render, screen, act, fireEvent } from '@testing-library/react'
import AccountCard from '.'
import composeMockAppTree from '../../../test-utils/composeMockAppTree'
// import copyToClipboard from '../../../utils/copyToClipboard'
// jest.mock('../../../utils/copyToClipboard')

describe('AccountCard', () => {
  afterEach(cleanup)
  test('renders the card', () => {
    const { Tree } = composeMockAppTree('postOnboard')
    const { container } = render(
      <Tree>
        <AccountCard
          onAccountSwitch={() => {}}
          color='purple'
          alias='Prime'
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

  test('renders alias and address', () => {
    const { Tree } = composeMockAppTree('postOnboard')
    render(
      <Tree>
        <AccountCard
          onAccountSwitch={() => {}}
          color='purple'
          alias='Prime'
          address='t0123'
          walletType='LEDGER'
          onShowOnLedger={() => {}}
          ledgerBusy={false}
          mb={2}
        />
      </Tree>
    )

    expect(screen.getByText('t0123', { exact: false })).toBeInTheDocument()
    expect(screen.getByText('Prime')).toBeInTheDocument()
  })

  test('clicking "Switch" calls onAccountSwitch', () => {
    const { Tree } = composeMockAppTree('postOnboard')
    const mockOnAccountSwitch = jest.fn()
    const { getByText } = render(
      <Tree>
        <AccountCard
          onAccountSwitch={mockOnAccountSwitch}
          color='purple'
          alias='Prime'
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
          alias='Prime'
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

  // TODO fix this test
  // test('clicking "Copy" calls copy', () => {
  //   const { Tree } = composeMockAppTree('postOnboard')
  //   const mockCopyToClipboard = jest.fn(() => Promise.resolve())

  //   console.log('copyToClipboard', copyToClipboard)
  //   copyToClipboard.mockImplementationOnce(mockCopyToClipboard)
  //   const { getByText } = render(
  //     <Tree>
  //       <AccountCard
  //         onAccountSwitch={() => {}}
  //         color='purple'
  //         alias='Prime'
  //         address='t0123'
  //         walletType='LEDGER'
  //         onShowOnLedger={() => {}}
  //         ledgerBusy={false}
  //         mb={2}
  //       />
  //     </Tree>
  //   )

  //   act(() => {
  //     fireEvent.click(getByText('Copy'))
  //   })

  //   expect(mockCopyToClipboard).toHaveBeenCalled()
  // })
})
