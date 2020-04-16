import { cleanup, render } from '@testing-library/react'
import Box from '.'

describe('Box', () => {
  afterEach(cleanup)
  test('renders the box', () => {
    const { container } = render(<Box />)
    expect(container.firstChild).toMatchSnapshot()
  })

  test('renders the box with the right attributes', () => {
    const { container } = render(
      <Box
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

    const box = container.querySelector('div')
    expect(box).toHaveStyle('width: auto;')
    expect(box).toHaveStyle('position: flex;')
    expect(box).toHaveStyle('border: 1;')
    expect(box).toHaveStyle('align-items: center;')
    expect(box).toHaveStyle('justify-content: space-between;')
    expect(box).toHaveStyle('background-color: blue;')
    expect(box).toHaveStyle('padding: 32px;')
  })
})
