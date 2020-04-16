import { cleanup, render, act, fireEvent } from '@testing-library/react'
import composeMockAppTree from '../../../test-utils/composeMockAppTree'
import Glyph from '.'
import theme from '../theme'

describe('Glyph', () => {
  afterEach(cleanup)
  test('renders the glyph', () => {
    const { Tree } = composeMockAppTree('preOnboard')
    const { container } = render(
      <Tree>
        <Glyph
          acronym='Sw'
          bg='core.primary'
          borderColor='core.primary'
          color='core.white'
        />
      </Tree>
    )
    expect(container.firstChild).toMatchSnapshot()
  })

  test('renders the glyph with the text', () => {
    const { Tree } = composeMockAppTree('preOnboard')
    const { getByText } = render(
      <Tree>
        <Glyph
          acronym='Sw'
          bg='core.primary'
          borderColor='core.primary'
          color='core.white'
        />
      </Tree>
    )

    expect(getByText('Sw')).toBeTruthy()
  })

  test('renders a Glyph with correct colors', () => {
    const { Tree } = composeMockAppTree('postOnboard')
    const { container } = render(
      <Tree>
        <Glyph acronym='Sw' bg='core.secondary' color='core.white' />
      </Tree>
    )

    const div = container.querySelector('div')
    expect(div).toHaveStyle(
      `color: ${theme.colors.core.white};
      background-color: ${theme.colors.core.secondary};`
    )
  })
})
