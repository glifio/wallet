import convertAddressToF from '.'

describe('convertAddrToF', () => {
  test('it converts a t address to an f address', () => {
    expect(convertAddressToF('t033525')).toBe('f033525')
  })
  test('it keeps an f address to an f address', () => {
    expect(convertAddressToF('f033525')).toBe('f033525')
  })
})
