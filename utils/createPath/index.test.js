import createPath from '.'

describe('createPath', () => {
  test('it creates a path based on an index and networkID', () => {
    expect(createPath(1, 1)).toBe("m/44'/1'/0/0/1")
    expect(createPath(461, 2)).toBe("m/44'/461'/0/0/2")
  })

  test('it hardens the first two path values', () => {
    const path = createPath(1, 1).split('/')
    expect(path[1][path[1].length - 1]).toBe("'")
    expect(path[2][path[2].length - 1]).toBe("'")
  })

  test('it throws an error when a bad network code is passed', () => {
    expect(() => createPath(0, 1)).toThrow()
    expect(() => createPath(461, 2)).not.toThrow()
  })
})
