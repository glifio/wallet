import { cleanup, render, act, fireEvent } from '@testing-library/react'
import { ButtonClose, ButtonCopyAccountAddress } from '.'
import composeMockAppTree from '../../../test-utils/composeMockAppTree'

describe('ButtonClose', () => {
  afterEach(cleanup)
  test('renders the ButtonClose', () => {
    const { Tree } = composeMockAppTree('postOnboard')
    const { container } = render(
      <Tree>
        <ButtonClose onClick={() => {}} />
      </Tree>
    )
    expect(container.firstChild).toMatchSnapshot()
  })

  test('clicking ButtonClose calls onClick', () => {
    const { Tree } = composeMockAppTree('postOnboard')
    const mockOnClick = jest.fn()
    const { getByTitle } = render(
      <Tree>
        <ButtonClose title='Close' disabled={false} onClick={mockOnClick} />
      </Tree>
    )

    act(() => {
      fireEvent.click(getByTitle('Close'))
    })

    expect(mockOnClick).toHaveBeenCalled()
  })
})

describe('ButtonCopyAccountAddress', () => {
  afterEach(cleanup)
  test('renders the ButtonCopyAccountAddress', () => {
    const { Tree } = composeMockAppTree('postOnboard')
    const { container } = render(
      <Tree>
        <ButtonCopyAccountAddress onClick={() => {}} />
      </Tree>
    )
    expect(container.firstChild).toMatchSnapshot()
  })

  test('clicking ButtonCopyAccountAddress calls onClick', () => {
    const { Tree } = composeMockAppTree('postOnboard')
    const mockOnClick = jest.fn()
    const { getByTitle } = render(
      <Tree>
        <ButtonCopyAccountAddress title='Copy' onClick={mockOnClick} />
      </Tree>
    )

    act(() => {
      fireEvent.click(getByTitle('Copy'))
    })

    expect(mockOnClick).toHaveBeenCalled()
  })
})
