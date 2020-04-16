import { render } from '@testing-library/react'
import Container from './Container'

describe('Container', () => {
  test('renders the Container', () => {
    const { container } = render(<Container />)
    expect(container.firstChild).toMatchSnapshot()
  })

  test('renders the Container with the right attributes', () => {
    const { container } = render(<Container border='1' width='auto' mt={4} />)

    const containerEl = container.querySelector('div')
    expect(containerEl).toHaveStyle('border: 1;')
    expect(containerEl).toHaveStyle('width: auto;')
    expect(containerEl).toHaveStyle('margin-top: 32px;')
  })
})
