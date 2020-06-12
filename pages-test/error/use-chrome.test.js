import { cleanup, render, screen, act, fireEvent } from '@testing-library/react'

import UseChrome from '../../pages/error/use-chrome.jsx'
import composeMockAppTree from '../../test-utils/composeMockAppTree'

jest.mock('@openworklabs/filecoin-wallet-provider')

describe('UseChrome', () => {
  afterEach(cleanup)
  test('it renders the error page', () => {
    const { Tree } = composeMockAppTree('postOnboard')
    const { container } = render(
      <Tree>
        <UseChrome />
      </Tree>
    )

    expect(container.firstChild).toMatchSnapshot()
  })

  test('it renders the message about getting Chrome', () => {
    const { Tree } = composeMockAppTree('postOnboard')

    render(
      <Tree>
        <UseChrome />
      </Tree>
    )

    expect(
      screen.getByText(
        'Please install Google Chrome to continue using your Ledger device, or choose an alternative setup option'
      )
    ).toBeInTheDocument()
  })

  test('it renders the home page after clicking back', async () => {
    const { Tree } = composeMockAppTree('preOnboard')
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    const mockRouterReplace = jest.fn(() => {})
    useRouter.mockImplementationOnce(() => ({
      query: 'network=t',
      replace: mockRouterReplace
    }))

    let res
    await act(async () => {
      res = render(
        <Tree>
          <UseChrome />
        </Tree>
      )
      fireEvent.click(screen.getByText('Back'))
    })

    expect(mockRouterReplace).toHaveBeenCalled()
    expect(mockRouterReplace).toHaveBeenCalledWith('/')
  })
})
