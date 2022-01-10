import createHash from '.'

describe('createHash', () => {
  test('it hashes properly according to predefined values', () => {
    const val = 'Qmcv45ZPc3oEwsbcHMRcs3AG59Rp8EUFr6Dm512KUswpRA'

    expect(createHash(val)).toBe(
      'fb97c41fb9a1e8fce8ed5386b2201abecbf5d90c6fa5b1a9f246034f9ba4c9a1'
    )
  })
})
