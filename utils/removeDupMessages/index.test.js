import { pluckConfirmed, uniqueifyMsgs } from '.'
import {
  filfoxMockData,
  secondaryFilfoxMockData
} from '../../test-utils/mockData'
import { formatFilfoxMessages } from '../../lib/useTransactionHistory/formatMessages'

const formattedFilfoxData = formatFilfoxMessages(filfoxMockData)
const formattedSecondaryFilfoxData = formatFilfoxMessages(
  secondaryFilfoxMockData
)

describe('uniqueifyMsgs', () => {
  test('it will not add two identical messages to the same array', () => {
    const msgArr = uniqueifyMsgs(formattedFilfoxData, formattedFilfoxData)
    expect(msgArr.length).toBe(formattedFilfoxData.length)
  })

  test('it will add unique messages', () => {
    const msgArr = uniqueifyMsgs(
      formattedFilfoxData,
      formattedSecondaryFilfoxData
    )
    expect(msgArr.length).toBe(
      formattedFilfoxData.length + formattedSecondaryFilfoxData.length
    )
  })

  test('it will add unique messages with arrays of different sizes', () => {
    const oldMessages = [{ cid: '2' }, { cid: '3' }]
    const newMessages = [{ cid: '1' }, { cid: '2' }, { cid: '3' }]
    const msgArr = uniqueifyMsgs(oldMessages, newMessages)
    expect(msgArr.length).toBe(3)
  })

  test('it sorts messages by timestamp', () => {
    const msgArr = uniqueifyMsgs(
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

describe('pluckConfirmed', () => {
  test('it will return an array with only pending messages', () => {
    const msgArr = pluckConfirmed(formattedFilfoxData, formattedFilfoxData)
    expect(msgArr.length).toBe(0)
  })
})
