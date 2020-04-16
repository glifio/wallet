import { cleanup, render, screen, act, fireEvent } from '@testing-library/react'
import Button from '.'
import composeMockAppTree from '../../../test-utils/composeMockAppTree'
import theme from '../theme'

describe('Button', () => {
  afterEach(cleanup)
  test('renders the Button', () => {
    const { Tree } = composeMockAppTree('postOnboard')
    const { container } = render(
      <Tree>
        <Button title='Next' onClick={() => {}} />
      </Tree>
    )
    expect(container.firstChild).toMatchSnapshot()
  })

  test('renders the button with the right attributes', () => {
    const { Tree } = composeMockAppTree('postOnboard')
    const { container } = render(
      <Tree>
        <Button
          title='Next'
          disabled={false}
          onClick={() => {}}
          variant='primary'
          ml={2}
          p={2}
          height='max-content'
          border='3px solid blue'
        />
      </Tree>
    )

    const button = container.querySelector('button')
    expect(button).toHaveStyle(
      'margin-left: 8px;',
      'padding: 16px;',
      'height: max-content;',
      'border: 3px solid blue;'
    )
  })

  test('clicking "Next" calls onClick', () => {
    const { Tree } = composeMockAppTree('postOnboard')
    const mockOnClick = jest.fn()
    const { getByText } = render(
      <Tree>
        <Button title='Next' disabled={false} onClick={mockOnClick} />
      </Tree>
    )

    act(() => {
      fireEvent.click(getByText('Next'))
    })

    expect(mockOnClick).toHaveBeenCalled()
  })

  test('renders a disabled button with disabled color', () => {
    const { Tree } = composeMockAppTree('postOnboard')
    const { container } = render(
      <Tree>
        <Button
          title='Next'
          disabled={true}
          onClick={() => {}}
          variant='primary'
          ml={2}
          p={2}
          height='max-content'
          border='3px solid blue'
        />
      </Tree>
    )

    const button = container.querySelector('button')
    expect(button).toHaveStyle(
      `background-color: ${theme.colors.status.inactive};`
    )
    expect(button.disabled).toBe(true)
  })

  test("renders a button that's not disabled", () => {
    const { Tree } = composeMockAppTree('postOnboard')
    const { container } = render(
      <Tree>
        <Button
          title='Next'
          disabled={false}
          onClick={() => {}}
          variant='primary'
          ml={2}
          p={2}
          height='max-content'
          border='3px solid blue'
        />
      </Tree>
    )

    const button = container.querySelector('button')
    expect(button.disabled).toBe(false)
    expect(button).toHaveStyle(
      `color: ${theme.colors.buttons.primary.color};
      background-color: ${theme.colors.buttons.primary.background};`
    )
  })

  test('applies the secondary variant', () => {
    const { Tree } = composeMockAppTree('postOnboard')
    const { container } = render(
      <Tree>
        <Button title='Next' variant='secondary' />
      </Tree>
    )

    const button = container.querySelector('button')
    expect(button).toHaveStyle(
      `color: ${theme.colors.buttons.secondary.color};
      background-color: ${theme.colors.buttons.secondary.background};`
    )
  })
})
