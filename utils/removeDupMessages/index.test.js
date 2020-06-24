import removeDupMessages from '.'
import {
  filscanMockData,
  secondaryFilscanMockData
} from '../../test-utils/mockData'
import { formatFilscanMessages } from '../../components/Wallet/Message/formatMessages'

const formattedFilscanMockData = formatFilscanMessages(filscanMockData)
const formattedSecondaryFilscanMockData = formatFilscanMessages(
  secondaryFilscanMockData
)

describe('removeDupMessages', () => {
  test('it will not add two identical messages to the same array', () => {
    const msgArr = removeDupMessages(
      formattedFilscanMockData,
      formattedFilscanMockData
    )
    expect(msgArr.length).toBe(formattedFilscanMockData.length)
  })

  test('it will add unique messages', () => {
    const msgArr = removeDupMessages(
      formattedFilscanMockData,
      formattedSecondaryFilscanMockData
    )
    expect(msgArr.length).toBe(
      formattedFilscanMockData.length + formattedSecondaryFilscanMockData.length
    )
  })

  test('it sorts messages by timestamp', () => {
    const msgArr = removeDupMessages(
      formattedSecondaryFilscanMockData,
      // make these messages with very new timestamps
      formattedFilscanMockData.map((msg, i) => ({
        ...msg,
        timestamp: i.toString()
      }))
    )

    // this is just checking to make sure the messages come back in order
    expect(msgArr[0].cid).toBe(formattedSecondaryFilscanMockData[0].cid)
    expect(msgArr[msgArr.length - 1].cid).toBe(formattedFilscanMockData[0].cid)
  })
})
