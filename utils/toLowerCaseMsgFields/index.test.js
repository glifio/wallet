import toLowerCaseMsgFields from '.'
import Message from '@openworklabs/filecoin-message'
import { BigNumber } from '@openworklabs/filecoin-number'

const keysAreLowercase = obj => {
  let lowercase = true
  Object.keys(obj).forEach(key => {
    if (key !== key.toLowerCase()) lowercase = false
  })
  return lowercase
}

describe('toLowerCaseMsgFields', () => {
  test('it lowercases PascalCase from message.encode', () => {
    const message = new Message({
      to: 't03832874859695014541',
      from: 't1pyfq7dg6sq65acyomqvzvbgwni4zllglqffw5dy',
      nonce: 10,
      value: new BigNumber('11416382733294334924'),
      gasPrice: new BigNumber('52109833521870826202'),
      gasLimit: 100,
      method: 102,
      params: '+'
    })

    expect(keysAreLowercase(toLowerCaseMsgFields(message.encode()))).toEqual(
      true
    )
  })

  test('it lowercases camelCase', () => {
    expect(
      keysAreLowercase(
        toLowerCaseMsgFields({
          to: 't03832874859695014541',
          from: 't1pyfq7dg6sq65acyomqvzvbgwni4zllglqffw5dy',
          nonce: 10,
          value: new BigNumber('11416382733294334924'),
          gasPrice: new BigNumber('52109833521870826202'),
          gasLimit: 100,
          method: 102
        })
      )
    ).toEqual(true)
  })

  test('it lowercases all uppercase', () => {
    expect(
      keysAreLowercase(
        toLowerCaseMsgFields({
          TO: 't03832874859695014541',
          FROM: 't1pyfq7dg6sq65acyomqvzvbgwni4zllglqffw5dy',
          NONCE: 10,
          VALUE: new BigNumber('11416382733294334924'),
          GASPRICE: new BigNumber('52109833521870826202'),
          GASLIMIT: 100,
          METHOD: 102
        })
      )
    ).toEqual(true)
  })
})
