import { cleanup, render, screen, act, fireEvent } from '@testing-library/react'

import WalletDown from '../../pages/error/wallet-down.jsx'
import composeMockAppTree from '../../test-utils/composeMockAppTree'

jest.mock('@openworklabs/filecoin-wallet-provider')

describe('WalletDown', () => {
  afterEach(cleanup)
  test('it renders the error page', () => {
    const { Tree } = composeMockAppTree('postOnboard')
    const { container } = render(
      <Tree>
        <WalletDown />
      </Tree>
    )

    expect(container.firstChild).toMatchSnapshot()
  })

  test('it renders the message about getting Chrome', () => {
    const { Tree } = composeMockAppTree('postOnboard')

    render(
      <Tree>
        <WalletDown />
      </Tree>
    )

    expect(
      screen.getByText("We've been notified of the problem.")
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
          <WalletDown />
        </Tree>
      )
      fireEvent.click(screen.getByText('Back'))
    })

    expect(mockRouterReplace).toHaveBeenCalled()
    expect(mockRouterReplace).toHaveBeenCalledWith('/')
  })
})
