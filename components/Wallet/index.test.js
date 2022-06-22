import { render, screen, act, fireEvent } from '@testing-library/react'

import WalletView from '.'
import composeMockAppTree from '../../test-utils/composeMockAppTree'

import { PAGE } from '../../constants'

jest.mock('@glif/filecoin-wallet-provider')

const useRouter = jest.spyOn(require('next/router'), 'useRouter')

describe('WalletView', () => {
  test.skip('it renders correctly', () => {
    useRouter.mockImplementation(() => ({
      pathname: 'home'
    }))

    const { Tree } = composeMockAppTree('postOnboard')
    const { container } = render(
      <Tree>
        <WalletView />
      </Tree>
    )
    expect(screen.getByText(/Transaction History/)).toBeInTheDocument()
    expect(screen.getByText(/Your Address/)).toBeInTheDocument()
    expect(screen.getByText(/Balance/)).toBeInTheDocument()
    expect(screen.getByText(/Send/)).toBeInTheDocument()
    expect(screen.getByText(/Logout/)).toBeInTheDocument()
    expect(container.firstChild).toMatchSnapshot()
  })

  test.skip('it renders the message history view when the pathname is home', () => {
    useRouter.mockImplementation(() => ({
      pathname: 'home'
    }))
    const { Tree } = composeMockAppTree('postOnboard')
    render(
      <Tree>
        <WalletView />
      </Tree>
    )

    expect(screen.getByText('Transaction History')).toBeInTheDocument()
  })

  test.skip('it renders the message detail view when there is a cid query param', () => {
    useRouter.mockImplementation(() => ({
      pathname: 'home'
    }))
    const { Tree } = composeMockAppTree('postOnboard')
    render(
      <Tree>
        <WalletView />
      </Tree>
    )

    expect(screen.getByText('Transaction History')).toBeInTheDocument()
  })

  test('it sends the user to the send page when the user clicks send', async () => {
    const mockRouterPush = jest.fn()
    useRouter.mockImplementation(() => ({
      push: mockRouterPush,
      query: '',
      pathname: 'home'
    }))
    const { Tree } = composeMockAppTree('postOnboard')

    // this isn't necessary, per se, but it silences the warnings
    await act(async () => {
      render(
        <Tree>
          <WalletView />
        </Tree>
      )
      fireEvent.click(screen.getByText('Send'))
      jest.clearAllTimers()
    })
    expect(mockRouterPush).toHaveBeenCalledWith(PAGE.WALLET_SEND)
  })
})
