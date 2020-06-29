import { cleanup, render, screen, act, fireEvent } from '@testing-library/react'

import MessageView from '.'
import composeMockAppTree from '../../../test-utils/composeMockAppTree'
import { filscanMockData } from '../../../test-utils/mockData'
import { formatFilscanMessages } from './formatMessages'

const spy = jest.spyOn(require('./useFilscanTransactionHistory.js'), 'default')
const mockTxHistory = {
  showMore: jest.fn(),
  pending: [],
  confirmed: formatFilscanMessages(filscanMockData).map(msg => ({
    ...msg,
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

  test('it renders correctly', () => {
    const { Tree } = composeMockAppTree('postOnboard')
    const { container } = render(
      <Tree>
        <MessageView />
      </Tree>
    )

    expect(container.firstChild).toMatchSnapshot()
    expect(screen.getByText('Transaction History')).toBeInTheDocument()
    expect(spy).toHaveBeenCalled()
  })

  test('it renders the message detail view after clicking on a message', () => {
    const { Tree } = composeMockAppTree('postOnboard')
    const { container } = render(
      <Tree>
        <MessageView />
      </Tree>
    )

    act(() => {
      fireEvent.click(screen.getAllByText('From')[0])
    })

    expect(container.firstChild).toMatchSnapshot()
    expect(screen.getByText('Transaction Details')).toBeInTheDocument()
    expect(spy).toHaveBeenCalled()
  })
})
