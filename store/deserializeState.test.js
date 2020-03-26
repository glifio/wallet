import { FilecoinNumber } from '@openworklabs/filecoin-number'
import { initialState } from './states'
import deserializeState from './deserializeState'

describe('deserializeState', () => {
  test('it should always return filecoin numbers for wallet balance', () => {
    const wallets = [
      {
        address: 't1jdlfl73voaiblrvn2yfivvn5ifucwwv5f26nfza',
        balance: new FilecoinNumber('1', 'fil'),
        path: ''
      },
      {
        address: 't1jdlfl73voaiblrvn2yfivvn5ifucwwv5f26nfza',
        balance: '0',
        path: ''
      }
    ]

    const state = { ...initialState, wallets }

    const deserializedState = {
      ...initialState,
      wallets: wallets.map(w => ({
        ...w,
        balance: new FilecoinNumber(w.balance, 'fil')
      }))
    }

    expect(JSON.stringify(deserializeState(state))).toEqual(
      JSON.stringify(deserializedState)
    )
  })
})
