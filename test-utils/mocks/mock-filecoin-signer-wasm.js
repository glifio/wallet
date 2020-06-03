const mnemonicGenerate = jest
  .fn()
  .mockImplementation(
    () =>
      'slender spread awkward chicken noise useful thank dentist tip bronze ritual explain version spot collect whisper glow peanut bus local country album punch frown'
  )

const keyDerive = jest.fn().mockImplementation(() => ({
  private_hexstring: 'hihi',
  address: 't1hvuzpfdycc6z6mjgbiyaiojikd6wk2vwy7muuei'
}))

const keyRecover = jest.fn().mockImplementation(() => ({
  private_hexstring: 'hihi',
  address: 't1hvuzpfdycc6z6mjgbiyaiojikd6wk2vwy7muuei'
}))

const transactionSign = jest
  .fn()
  .mockImplementation(() => ({ signature: { data: 'xxxyyyyzzzz' } }))

module.exports = { keyRecover, keyDerive, mnemonicGenerate, transactionSign }
