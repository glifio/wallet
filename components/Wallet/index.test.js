import { cleanup, render, screen, act, fireEvent } from '@testing-library/react'

import WalletView from '.'
import composeMockAppTree from '../../test-utils/composeMockAppTree'

import { filscoutMockData } from '../../test-utils/mockData'
import { formatFilscoutMessages } from './Message/formatMessages'

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

describe('WalletView', () => {
  afterEach(cleanup)
  beforeEach(() => {
    jest.clearAllMocks()
  })
  test('it renders correctly', () => {
    const { Tree } = composeMockAppTree('postOnboard')
    const { container } = render(
      <Tree>
        <WalletView />
      </Tree>
    )

    expect(container.firstChild).toMatchSnapshot()
    expect(spy).toHaveBeenCalled()
  })

  test('it renders the message history view by default', () => {
    const { Tree } = composeMockAppTree('postOnboard')
    render(
      <Tree>
        <WalletView />
      </Tree>
    )

    expect(screen.getByText('Transaction History')).toBeInTheDocument()
  })

  test('it renders the send flow when a user clicks send', async () => {
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
    })

    expect(screen.getByText('Sending Filecoin')).toBeInTheDocument()
    expect(res.container.firstChild).toMatchSnapshot()
  })
})
