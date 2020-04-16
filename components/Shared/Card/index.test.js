import { cleanup, render, act, fireEvent } from '@testing-library/react'
import Card from '.'

describe('Card', () => {
  afterEach(cleanup)
  test('renders the card', () => {
    const { container } = render(<Card />)
    expect(container.firstChild).toMatchSnapshot()
  })

  test('renders the card with the right attributes', () => {
    const { container } = render(
      <Card
        position='flex'
        flexDirection='row'
        border='1'
        width='auto'
        alignItems='center'
        justifyContent='space-between'
        bg='blue'
        p={4}
      />
    )

    const card = container.querySelector('div')
    expect(card).toHaveStyle('width: auto;')
    expect(card).toHaveStyle('position: flex;')
    expect(card).toHaveStyle('align-items: center;')
    expect(card).toHaveStyle('justify-content: space-between;')
    expect(card).toHaveStyle('background-color: blue;')
    expect(card).toHaveStyle('padding: 32px;')
  })

  test('clicking Card calls onClick', () => {
    const mockOnClick = jest.fn()
    const { container } = render(
      <Card
        position='flex'
        onClick={mockOnClick}
        border='1'
        width='auto'
        alignItems='center'
        justifyContent='space-between'
        bg='blue'
        p={4}
      />
    )

    act(() => {
      fireEvent.click(container.querySelector('div'))
    })

    expect(mockOnClick).toHaveBeenCalled()
  })
})
