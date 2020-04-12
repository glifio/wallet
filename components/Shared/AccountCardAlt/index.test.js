import { cleanup, render, screen, act, fireEvent } from '@testing-library/react'
import AccountCardAlt from '.'
import composeMockAppTree from '../../../test-utils/composeMockAppTree'

describe('AccountCardAlt', () => {
  afterEach(cleanup)
  test('renders the card', () => {
    const { Tree } = composeMockAppTree('postOnboard')
    const { container } = render(
      <Tree>
        <AccountCardAlt
          index={1}
          address={'t0123456789'}
          balance={'100'}
          onClick={() => {}}
          selected={true}
        />
      </Tree>
    )

    expect(container.firstChild).toMatchSnapshot()
  })

  test('renders address preview and balance', () => {
    const { Tree } = composeMockAppTree('postOnboard')
    render(
      <Tree>
        <AccountCardAlt
          index={1}
          address={'t0123456789'}
          balance={'100'}
          onClick={() => {}}
          selected={true}
        />
      </Tree>
    )

    expect(screen.getByText('t0123', { exact: false })).toBeInTheDocument()
    expect(screen.getByText('Balance')).toBeInTheDocument()
    expect(screen.getByText('100', { exact: false })).toBeInTheDocument()
  })

  test('clicking the card calls mockOnAccountSwitch', () => {
    const { Tree } = composeMockAppTree('postOnboard')
    const mockOnAccountSwitch = jest.fn()
    const { getByText } = render(
      <Tree>
        <AccountCardAlt
          index={1}
          address={'t0123456789'}
          balance={'100'}
          onClick={mockOnAccountSwitch}
          selected={true}
        />
      </Tree>
    )

    act(() => {
      fireEvent.click(getByText('Address'))
    })

    expect(mockOnAccountSwitch).toHaveBeenCalled()
  })
})
