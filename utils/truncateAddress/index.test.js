import truncateAddress from '.'

describe('truncateAddress', () => {
  test('it truncates the address to 8 characters', () => {
    const truncated = truncateAddress(
      't1mbk7q6gm4rjlndfqw6f2vkfgqotres3fgicb2uq'
    )
    expect(truncated).toBe('t1mbk ... b2uq')
    expect(truncated.split('...').join('').length).toBe(11)
  })

  test('it returns entire address is 9 characters or shorter', () => {
    const truncated = truncateAddress('t12345678')
    expect(truncated).toBe('t12345678')
  })
})
