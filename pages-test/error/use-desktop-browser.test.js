import { cleanup, render, screen, act, fireEvent } from '@testing-library/react'

import UseDesktopBrowser from '../../pages/error/use-desktop-browser.jsx'
import composeMockAppTree from '../../test-utils/composeMockAppTree'

jest.mock('@openworklabs/filecoin-wallet-provider')

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

  test('it renders the home page after clicking back', async () => {
    const { Tree } = composeMockAppTree('preOnboard')
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    const mockRouterReplace = jest.fn(() => {})
    useRouter.mockImplementationOnce(() => ({
      query: 'network=t',
      push: mockRouterReplace
    }))

    let res
    await act(async () => {
      res = render(
        <Tree>
          <UseDesktopBrowser />
        </Tree>
      )
      fireEvent.click(screen.getByText('Home'))
    })

    expect(mockRouterReplace).toHaveBeenCalled()
    expect(mockRouterReplace).toHaveBeenCalledWith('/')
  })
})
