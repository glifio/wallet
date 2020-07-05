import { BigNumber } from '@openworklabs/filecoin-number'
import makeFriendlyBalance from '.'

describe('makeFriendlyBalance', () => {
  test('it throws an error if no number is passed', () => {
    expect(() => makeFriendlyBalance()).toThrow()
  })

  test('it returns the number with no manipulation if the number is not a BigNumber', () => {
    expect(makeFriendlyBalance(1000)).toEqual(1000)
  })

  test('it throws an error if it does not receive a number', () => {
    expect(() => makeFriendlyBalance(new BigNumber('hi'))).toThrow()
  })

  test('it throws an error for negative numbers', () => {
    expect(() => makeFriendlyBalance(new BigNumber('-2'))).toThrow()
  })

  test('it returns the number with no manipulation if the pretty argument is passed as false', () => {
    expect(makeFriendlyBalance(new BigNumber(0.000043245235), 5, false)).toBe(
      '0.000043245235'
    )
    expect(makeFriendlyBalance(new BigNumber('134'), 5, false)).toBe('134')
    expect(makeFriendlyBalance(new BigNumber(532416423), 5, false)).toBe(
      '532416423'
    )
    // javascripts biggest number, after this, things get tricky
    expect(makeFriendlyBalance(new BigNumber(9007199254740991), 5, false)).toBe(
      '9007199254740991'
    )
  })

  test('it returns "< number" when the decimal is smaller than the num of dps passed', () => {
    expect(makeFriendlyBalance(new BigNumber('0000.00001'), 2)).toEqual(
      '< 0.01'
    )

    expect(
      makeFriendlyBalance(new BigNumber('0.01104953007959368107188269908'), 2)
    ).toEqual('0.01')

    expect(
      makeFriendlyBalance(new BigNumber('.0000000001230500054'), 6)
    ).toEqual('< 0.000001')

    expect(makeFriendlyBalance(new BigNumber('0000.00001'), 5)).toEqual(
      '0.00001'
    )

    expect(
      makeFriendlyBalance(new BigNumber('.0000000001230500054'), 16)
    ).toEqual('0.00000000012305')
  })

  test('it prettifies numbers between 1-1000', () => {
    expect(makeFriendlyBalance(new BigNumber('1'), 3)).toEqual('1')
    expect(makeFriendlyBalance(new BigNumber('1.2'), 3)).toEqual('1.2')
    expect(makeFriendlyBalance(new BigNumber('1.23'), 3)).toEqual('1.23')
    expect(makeFriendlyBalance(new BigNumber('10'), 3)).toEqual('10')
    expect(makeFriendlyBalance(new BigNumber('10.2'), 3)).toEqual('10.2')
    expect(makeFriendlyBalance(new BigNumber('10.234'), 3)).toEqual('10.234')
    expect(makeFriendlyBalance(new BigNumber('100'), 16)).toEqual('100')
    expect(makeFriendlyBalance(new BigNumber('100.000124'), 4)).toEqual(
      '100.0001'
    )
    expect(makeFriendlyBalance(new BigNumber('100.000124'), 5)).toEqual(
      '100.00012'
    )
    expect(makeFriendlyBalance(new BigNumber('100.000124'), 7)).toEqual(
      '100.000124'
    )

    expect(makeFriendlyBalance(new BigNumber('1000'), 7)).toEqual('1000')
    expect(makeFriendlyBalance(new BigNumber('1000.23'), 3)).toEqual('1.0K')
  })

  test('it adds 1 approximation point and "K" to the end of numbers between 1000 and 999999.9999.....', () => {
    expect(makeFriendlyBalance(new BigNumber('100002'), 7)).toEqual('100.0K')
    expect(makeFriendlyBalance(new BigNumber('100202.02343267'), 7)).toEqual(
      '100.2K'
    )
    expect(makeFriendlyBalance(new BigNumber('10002.02343267'), 7)).toEqual(
      '10.0K'
    )
    expect(makeFriendlyBalance(new BigNumber('100102.23'), 7)).toEqual('100.1K')
    expect(makeFriendlyBalance(new BigNumber('100999.3'), 7)).toEqual('100.9K')
    expect(makeFriendlyBalance(new BigNumber('100999.3'), 7)).toEqual('100.9K')
    expect(makeFriendlyBalance(new BigNumber('1002.02343267'), 7)).toEqual(
      '1.0K'
    )
  })

  test('it adds 1 approximation point and "M" to the end of numbers between 1000000 and 999999999.9999.....', () => {
    expect(makeFriendlyBalance(new BigNumber('1202000'), 7)).toEqual('1.2M')
    expect(makeFriendlyBalance(new BigNumber('12020002.2345'), 7)).toEqual(
      '12.0M'
    )
    expect(makeFriendlyBalance(new BigNumber('100002000'), 7)).toEqual('100.0M')
    expect(makeFriendlyBalance(new BigNumber('100002000.02343267'), 7)).toEqual(
      '100.0M'
    )
    expect(makeFriendlyBalance(new BigNumber('100102000'), 7)).toEqual('100.1M')
    expect(makeFriendlyBalance(new BigNumber('100999000'), 7)).toEqual('100.9M')
  })

  test('it adds 1 approximation point and "B" to the end of numbers between 1000000000 and 999999999999.9999.....', () => {
    expect(makeFriendlyBalance(new BigNumber('100002000234'), 7)).toEqual(
      '100.0B'
    )
    expect(
      makeFriendlyBalance(new BigNumber('100002001230.02343267'), 7)
    ).toEqual('100.0B')
    expect(makeFriendlyBalance(new BigNumber('100102000432'), 7)).toEqual(
      '100.1B'
    )
  })

  test('it returns > 999.9B for numbers in the trillions', () => {
    expect(makeFriendlyBalance(new BigNumber('100932423412399000'), 7)).toEqual(
      '> 999.9B'
    )
  })
})
