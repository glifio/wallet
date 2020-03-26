import * as states from './states'

describe('state manipulators', () => {
  let state
  beforeEach(() => {
    state = states.initialState
  })
  test('walletList', () => {
    initialState.network = 't'
    const wallets = [
      {
        address: 't1jdlfl73voaiblrvn2yfivvn5ifucwwv5f26nfza',
        balance: new FilecoinNumber('1', 'fil'),
        path: ''
      },
      {
        address: 't1jdlfl73voaiblrvn2yfivvn5ifucwwv5f26nfza',
        balance: new FilecoinNumber('1', 'fil'),
        path: ''
      }
    ]

    test(states.walletList(state, { wallets })).toEqual()
  })
})
