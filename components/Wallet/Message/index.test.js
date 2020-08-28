import { cleanup, render, screen, act, fireEvent } from '@testing-library/react'

import MessageView from '.'
import composeMockAppTree from '../../../test-utils/composeMockAppTree'
import { filscoutMockData } from '../../../test-utils/mockData'
import { formatFilscoutMessages } from './formatMessages'

const spy = jest.spyOn(require('./useTransactionHistory.js'), 'default')
const mockTxHistory = {
  showMore: jest.fn(),
  pending: [],
  confirmed: formatFilscoutMessages(filscoutMockData).map(msg => ({
    ...msg,
    gas_used: msg.gas_used.toString(),
    status: 'confirmed'
  })),
  refresh: jest.fn(),
  paginating: false,
  loading: false,
  loadedSuccess: true,
  loadedFailure: false,
  total: 47
}

spy.mockReturnValue(mockTxHistory)

describe('MessageHistory View', () => {
  afterEach(cleanup)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('it renders correctly', async () => {
    const { Tree } = composeMockAppTree('postOnboard')
    await act(() => {
      const { container } = render(
        <Tree>
          <MessageView />
        </Tree>
      )

      expect(container.firstChild).toMatchSnapshot()
      expect(screen.getByText('Transaction History')).toBeInTheDocument()
      expect(spy).toHaveBeenCalled()
    })
  })

  test('it renders the message detail view after clicking on a message', async () => {
    const { Tree } = composeMockAppTree('postOnboard')

    let container = {}
    await act(async () => {
      const res = await render(
        <Tree>
          <MessageView />
        </Tree>
      )
      container = res.container
      fireEvent.click(screen.getAllByText('From')[0])
    })

    expect(container.firstChild).toMatchSnapshot()
    expect(screen.getByText('Transaction Details')).toBeInTheDocument()
    expect(spy).toHaveBeenCalled()
  })

  test('it renders the gas fee as loading', async () => {
    const { Tree } = composeMockAppTree('postOnboard')

    await act(async () => {
      await render(
        <Tree>
          <MessageView />
        </Tree>
      )
      fireEvent.click(screen.getAllByText('From')[0])
      expect(screen.queryByDisplayValue('Loading...')).toBeInTheDocument()
    })
  })
})
