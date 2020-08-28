import { cleanup, render, screen } from '@testing-library/react'
import composeMockAppTree from '../../../test-utils/composeMockAppTree'
import HeaderGlyph from './HeaderGlyph'

describe('HeaderGlyph', () => {
  afterEach(cleanup)
  test('renders the HeaderGlyph', () => {
    const { Tree } = composeMockAppTree('preOnboard')
    const { container } = render(
      <Tree>
        <HeaderGlyph
          alt='Source: https://www.nontemporary.com/post/190437968500'
          text='Wallet'
          imageUrl='/imgwallet.png'
          color='black'
        />
      </Tree>
    )
    expect(container.firstChild).toMatchSnapshot()
    expect(screen.getByText('Wallet')).toBeInTheDocument()
  })
})
