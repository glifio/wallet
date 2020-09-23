import removeDupMessages from '.'
import {
  filfoxMockData,
  secondaryFilfoxMockData
} from '../../test-utils/mockData'
import { formatFilfoxMessages } from '../../components/Wallet/Message/formatMessages'

const formattedFilfoxData = formatFilfoxMessages(filfoxMockData)
const formattedSecondaryFilfoxData = formatFilfoxMessages(
  secondaryFilfoxMockData
)

describe('removeDupMessages', () => {
  test('it will not add two identical messages to the same array', () => {
    const msgArr = removeDupMessages(formattedFilfoxData, formattedFilfoxData)
    expect(msgArr.length).toBe(formattedFilfoxData.length)
  })

  test('it will add unique messages', () => {
    const msgArr = removeDupMessages(
      formattedFilfoxData,
      formattedSecondaryFilfoxData
    )
    expect(msgArr.length).toBe(
      formattedFilfoxData.length + formattedSecondaryFilfoxData.length
    )
  })

  test('it sorts messages by timestamp', () => {
    const msgArr = removeDupMessages(
      formattedSecondaryFilfoxData,
      // make these messages with very new timestamps
      formattedFilfoxData.map((msg, i) => ({
        ...msg,
        timestamp: i.toString()
      }))
    )

    // this is just checking to make sure the messages come back in order
    expect(msgArr[0].cid).toBe(formattedSecondaryFilfoxData[0].cid)
    expect(msgArr[msgArr.length - 1].cid).toBe(formattedFilfoxData[0].cid)
  })
})
