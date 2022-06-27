import { render, screen } from '@testing-library/react'

import UseDesktopBrowser from '../../pages/error/use-desktop-browser'
import composeMockAppTree from '../../test-utils/composeMockAppTree'

jest.mock('@glif/filecoin-wallet-provider')

describe('UseDesktopBrowser', () => {
  test('it renders the error page', () => {
    const { Tree } = composeMockAppTree('postOnboard')
    const { container } = render(
      <Tree>
        <UseDesktopBrowser />
      </Tree>
    )
    
    expect(
      screen.getByText('Glif Wallet isn’t ready for your phone or tablet.')
    ).toBeInTheDocument()

    expect(
      screen.getByText('Home')
    ).toHaveAttribute('href', 'https://glif.io')

    expect(container.firstChild).toMatchSnapshot()
  })
})
