import { cleanup, render, screen, act, fireEvent } from '@testing-library/react'
import MessageHistoryTable from './index'
import composeMockAppTree from '../../../test-utils/composeMockAppTree'
import { filscoutMockData } from '../../../test-utils/mockData'
import { formatFilscoutMessages } from '../../Wallet/Message/formatMessages'

describe('MessageHistoryTable', () => {
  afterEach(cleanup)
  let setSelectedMessageCid = jest.fn()
  let showMore = jest.fn()
  beforeEach(() => {
    jest.clearAllMocks()
    setSelectedMessageCid = jest.fn()
    showMore = jest.fn()
  })

  test('renders the MessageHistoryTable', () => {
    const { Tree } = composeMockAppTree('postOnboard')
    const { container } = render(
      <Tree>
        <MessageHistoryTable
          address='t01'
          messages={formatFilscoutMessages(filscoutMockData).map(msg => ({
            ...msg,
            status: 'confirmed'
          }))}
          loading={false}
          selectMessage={setSelectedMessageCid}
          paginating={false}
          showMore={showMore}
          total={filscoutMockData.length}
        />
      </Tree>
    )
    expect(container.firstChild).toMatchSnapshot()
    expect(screen.getByText('Transaction History')).toBeInTheDocument()
  })

  test('renders the loading screen when loading is true', () => {
    const { Tree } = composeMockAppTree('postOnboard')
    render(
      <Tree>
        <MessageHistoryTable
          address='t01'
          messages={formatFilscoutMessages(filscoutMockData).map(msg => ({
            ...msg,
            status: 'confirmed'
          }))}
          loading={true}
          selectMessage={setSelectedMessageCid}
          paginating={false}
          showMore={showMore}
          total={16}
        />
      </Tree>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  test('renders the empty history component when messages are empty', () => {
    const { Tree } = composeMockAppTree('postOnboard')
    render(
      <Tree>
        <MessageHistoryTable
          address='t01'
          messages={[]}
          loading={false}
          selectMessage={setSelectedMessageCid}
          paginating={false}
          showMore={showMore}
          total={0}
        />
      </Tree>
    )

    expect(
      screen.getByText('How do I see my transaction history?')
    ).toBeInTheDocument()
  })

  test('renders the show more button when the total is larger than # of messages in the table', () => {
    const { Tree } = composeMockAppTree('postOnboard')
    render(
      <Tree>
        <MessageHistoryTable
          address='t01'
          messages={formatFilscoutMessages(filscoutMockData).map(msg => ({
            ...msg,
            status: 'confirmed'
          }))}
          loading={false}
          selectMessage={setSelectedMessageCid}
          paginating={false}
          showMore={showMore}
          total={16}
        />
      </Tree>
    )

    expect(screen.getByText('View More')).toBeInTheDocument()
  })

  test("doesn't render the show more button when the total is larger than # of messages in the table", () => {
    const { Tree } = composeMockAppTree('postOnboard')
    render(
      <Tree>
        <MessageHistoryTable
          address='t01'
          messages={formatFilscoutMessages(filscoutMockData).map(msg => ({
            ...msg,
            status: 'confirmed'
          }))}
          loading={false}
          selectMessage={setSelectedMessageCid}
          paginating={false}
          showMore={showMore}
          total={filscoutMockData.length}
        />
      </Tree>
    )

    let error
    try {
      screen.getByText('View More')
    } catch (e) {
      error = e
    }

    expect(error).toBeTruthy()
  })

  test('renders value of first message', () => {
    const { Tree } = composeMockAppTree('postOnboard')
    render(
      <Tree>
        <MessageHistoryTable
          address='t01'
          messages={formatFilscoutMessages(filscoutMockData).map(msg => ({
            ...msg,
            status: 'confirmed'
          }))}
          loading={false}
          selectMessage={setSelectedMessageCid}
          paginating={false}
          showMore={showMore}
          total={filscoutMockData.length}
        />
      </Tree>
    )

    expect(screen.getAllByText(filscoutMockData[0].value)).toBeTruthy()
  })
})
