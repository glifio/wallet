import truncateAddress from '.'

describe('truncateAddress', () => {
  test('it truncates the address to 8 characters', () => {
    const truncated = truncateAddress(
      't1mbk7q6gm4rjlndfqw6f2vkfgqotres3fgicb2uq'
    )
    expect(truncated).toBe('t1mb...b2uq')
    expect(truncated.split('...').join('').length).toBe(8)
  })
})
