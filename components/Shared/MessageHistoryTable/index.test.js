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
  })
})
