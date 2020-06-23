import removeDupMessages from '.'
import {
  filscoutMockData,
  secondaryFilscoutMockData
} from '../../test-utils/mockData'

describe('removeDupMessages', () => {
  test('it will not add two identical messages to the same array', () => {
    const msgArr = removeDupMessages(filscoutMockData, filscoutMockData)
    expect(msgArr.length).toBe(filscoutMockData.length)
  })

  test.only('it will add unique messages', () => {
    const msgArr = removeDupMessages(
      filscoutMockData,
      secondaryFilscoutMockData
    )
    expect(msgArr.length).toBe(
      filscoutMockData.length + secondaryFilscoutMockData.length
    )
  })
})
