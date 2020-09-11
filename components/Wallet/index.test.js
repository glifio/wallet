import { cleanup, render, screen, act, fireEvent } from '@testing-library/react'

import WalletView from '.'
import composeMockAppTree from '../../test-utils/composeMockAppTree'

import { filscoutMockData } from '../../test-utils/mockData'
import { formatFilscoutMessages } from './Message/formatMessages'
import { flushPromises } from '../../test-utils'

jest.mock('@openworklabs/filecoin-wallet-provider')
const spy = jest.spyOn(require('./Message/useTransactionHistory.js'), 'default')

const mockTxHistory = {
  showMore: jest.fn(),
  pending: [],
  confirmed: formatFilscoutMessages(filscoutMockData).map(msg => ({
    ...msg,
    status: 'confirmed'
  })),
  paginating: false,
  loading: false,
  loadedSuccess: true,
  loadedFailure: false,
  total: 47
}

spy.mockReturnValue(mockTxHistory)

const useRouter = jest.spyOn(require('next/router'), 'useRouter')

describe('WalletView', () => {
  afterEach(cleanup)
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('it renders correctly', () => {
    useRouter.mockImplementation(() => ({
      pathname: 'home'
    }))

    const { Tree } = composeMockAppTree('postOnboard')
    const { container } = render(
      <Tree>
        <WalletView />
      </Tree>
    )

    expect(container.firstChild).toMatchSnapshot()
    expect(spy).toHaveBeenCalled()
  })

  test('it renders the message history view when the pathname is home', () => {
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
      query: 'network=t',
      pathname: 'home'
    }))
    const { Tree } = composeMockAppTree('postOnboard')

    let res
    // this isn't necessary, per se, but it silences the warnings
    await act(async () => {
      res = render(
        <Tree>
          <WalletView />
        </Tree>
      )
      fireEvent.click(screen.getByText('Send'))
      await flushPromises()
    })
    expect(mockRouterPush).toHaveBeenCalledWith('/send?network=t')
  })

  test('it renders the send page when the user goes to the send screen', async () => {
    const mockRouterPush = jest.fn()
    useRouter.mockImplementation(() => ({
      push: mockRouterPush,
      query: 'network=t',
      pathname: 'send'
    }))
    const { Tree } = composeMockAppTree('postOnboard')
    const { container } = render(
      <Tree>
        <WalletView />
      </Tree>
    )
    expect(container.firstChild).toMatchSnapshot()
  })
})
