import { cleanup, render, screen, act, fireEvent } from '@testing-library/react'

import UseDesktopBrowser from '../../pages/error/use-desktop-browser.jsx'
import composeMockAppTree from '../../test-utils/composeMockAppTree'
import { flushPromises } from '../../test-utils/index.js'

jest.mock('@glif/filecoin-wallet-provider')

describe('UseDesktopBrowser', () => {
  afterEach(cleanup)
  test('it renders the error page', () => {
    const { Tree } = composeMockAppTree('postOnboard')
    const { container } = render(
      <Tree>
        <UseDesktopBrowser />
      </Tree>
    )

    expect(container.firstChild).toMatchSnapshot()
  })

  test('it renders the message about getting Chrome', () => {
    const { Tree } = composeMockAppTree('postOnboard')

    render(
      <Tree>
        <UseDesktopBrowser />
      </Tree>
    )

    expect(
      screen.getByText('Glif Wallet isn’t ready for your phone or tablet.')
    ).toBeInTheDocument()
  })

  test.skip('it sends the user to glif home page after clicking Home', async () => {
    const { Tree } = composeMockAppTree('preOnboard')
    delete window.location

    window.location = {
      href: ''
    }

    let res
    await act(async () => {
      res = render(
        <Tree>
          <UseDesktopBrowser />
        </Tree>
      )
      fireEvent.click(screen.getByText('Home'))
      await flushPromises()
    })

    expect(window.location.href).toBe('https://www.glif.io')
  })
})
