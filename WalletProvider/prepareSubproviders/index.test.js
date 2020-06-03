import prepareSubproviders from '.'

describe('prepareSubproviders', () => {
  test('it returns the 3 subprovider classes', () => {
    const mockRustModule = {}
    const subproviders = prepareSubproviders(mockRustModule)
    expect(Object.keys(subproviders).length).toBe(3)
    expect(!!subproviders.HDWalletProvider).toBe(true)
    expect(!!subproviders.LedgerProvider).toBe(true)
    expect(!!subproviders.SingleKeyProvider).toBe(true)
  })
})
