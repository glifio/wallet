import toLowerCaseMsgFields from '.'
import { Message } from '@openworklabs/filecoin-message'
import { BigNumber } from '@openworklabs/filecoin-number'

const keysAreLowercase = obj => {
  let lowercase = true
  Object.keys(obj).forEach(key => {
    if (key[0] !== key[0].toLowerCase()) lowercase = false
  })
  return lowercase
}

describe('toLowerCaseMsgFields', () => {
  test('it lowercases the first letter of each message key', () => {
    const message = new Message({
      to: 't03832874859695014541',
      from: 't1pyfq7dg6sq65acyomqvzvbgwni4zllglqffw5dy',
      nonce: 10,
      value: new BigNumber('11416382733294334924'),
      method: 102,
      params: '+'
    })

    expect(
      keysAreLowercase(toLowerCaseMsgFields(message.toLotusType()))
    ).toEqual(true)
  })

  test('it lowercases camelCase', () => {
    expect(
      keysAreLowercase(
        toLowerCaseMsgFields({
          to: 't03832874859695014541',
          from: 't1pyfq7dg6sq65acyomqvzvbgwni4zllglqffw5dy',
          nonce: 10,
          value: new BigNumber('11416382733294334924'),
          method: 102
        })
      )
    ).toEqual(true)
  })
})
