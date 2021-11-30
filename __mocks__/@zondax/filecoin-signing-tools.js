import createHash from '../../utils/createHash'

const generateMnemonic = jest
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

const transactionSerialize = jest.fn().mockImplementation(() => {
  return Buffer.from('MOCK SIGNATURE DATA')
})

const serializeParams = jest
  .fn()
  .mockImplementation((params, version, method) => {
    // just create a random string
    return createHash([JSON.stringify(params), version, method].join(''))
  })

const createMultisig = jest.fn().mockImplementation(
  //eslint-disable-next-line no-unused-vars
  (walletAddress, signerAddresses, value, numSigners, nonce, vest, epoch) => {
    // normally this returns the whole message but we just use the params
    return {
      from: walletAddress,
      to: 't01',
      params: 'xxyyzzz'
    }
  }
)

module.exports = {
  createMultisig,
  keyRecover,
  keyDerive,
  generateMnemonic,
  transactionSign,
  transactionSerialize,
  serializeParams
}
