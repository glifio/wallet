import removeDupMessages from '.'
import {
  filscoutMockData,
  secondaryFilscoutMockData
} from '../../test-utils/mockData'
import { formatFilscoutMessages } from '../../components/Wallet/Message/formatMessages'

const formattedFilscoutMockData = formatFilscoutMessages(filscoutMockData)
const formattedSecondaryFilscoutMockData = formatFilscoutMessages(
  secondaryFilscoutMockData
)

describe('removeDupMessages', () => {
  test('it will not add two identical messages to the same array', () => {
    const msgArr = removeDupMessages(
      formattedFilscoutMockData,
      formattedFilscoutMockData
    )
    expect(msgArr.length).toBe(formattedFilscoutMockData.length)
  })

  test('it will add unique messages', () => {
    const msgArr = removeDupMessages(
      formattedFilscoutMockData,
      formattedSecondaryFilscoutMockData
    )
    expect(msgArr.length).toBe(
      formattedFilscoutMockData.length +
        formattedSecondaryFilscoutMockData.length
    )
  })

  test('it sorts messages by timestamp', () => {
    const msgArr = removeDupMessages(
      formattedSecondaryFilscoutMockData,
      // make these messages with very new timestamps
      formattedFilscoutMockData.map((msg, i) => ({
        ...msg,
        timestamp: i.toString()
      }))
    )

    // this is just checking to make sure the messages come back in order
    expect(msgArr[0].cid).toBe(formattedSecondaryFilscoutMockData[0].cid)
    expect(msgArr[msgArr.length - 1].cid).toBe(formattedFilscoutMockData[0].cid)
  })
})
