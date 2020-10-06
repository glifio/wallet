import { FilecoinNumber } from '@glif/filecoin-number'
import stateDiff from './stateDiff'

describe('stateDiff', () => {
  test('it returns true when msig states match', () => {
    const actorState = {
      Address: 't01',
      Balance: new FilecoinNumber('1', 'fil'),
      AvailableBalance: new FilecoinNumber('1', 'fil'),
      Signers: ['t0123', 't012345']
    }

    expect(stateDiff(actorState, actorState)).toBe(false)
  })

  test('it returns false when Balance changes', () => {
    const actorState = {
      Address: 't01',
      Balance: new FilecoinNumber('1', 'fil'),
      AvailableBalance: new FilecoinNumber('1', 'fil'),
      Signers: ['t0123']
    }

    const actorState2 = {
      Address: 't01',
      Balance: new FilecoinNumber('2', 'fil'),
      AvailableBalance: new FilecoinNumber('1', 'fil'),
      Signers: ['t0123']
    }

    expect(stateDiff(actorState, actorState2)).toBe(true)
  })

  test('it returns false when AvailableBalance changes', () => {
    const actorState = {
      Address: 't01',
      Balance: new FilecoinNumber('1', 'fil'),
      AvailableBalance: new FilecoinNumber('2', 'fil'),
      Signers: ['t0123']
    }

    const actorState2 = {
      Address: 't01',
      Balance: new FilecoinNumber('1', 'fil'),
      AvailableBalance: new FilecoinNumber('1', 'fil'),
      Signers: ['t0123']
    }

    expect(stateDiff(actorState, actorState2)).toBe(true)
  })

  test('it returns false when Signers change', () => {
    const actorState = {
      Address: 't01',
      Balance: new FilecoinNumber('1', 'fil'),
      AvailableBalance: new FilecoinNumber('2', 'fil'),
      Signers: ['t0123']
    }

    const actorState2 = {
      Address: 't01',
      Balance: new FilecoinNumber('1', 'fil'),
      AvailableBalance: new FilecoinNumber('1', 'fil'),
      Signers: ['t0124']
    }

    expect(stateDiff(actorState, actorState2)).toBe(true)

    const actorState3 = {
      Address: 't01',
      Balance: new FilecoinNumber('1', 'fil'),
      AvailableBalance: new FilecoinNumber('2', 'fil'),
      Signers: ['t0123', 't012345']
    }

    const actorState4 = {
      Address: 't01',
      Balance: new FilecoinNumber('1', 'fil'),
      AvailableBalance: new FilecoinNumber('1', 'fil'),
      Signers: ['t0124', 't012345', 't012342']
    }

    expect(stateDiff(actorState3, actorState4)).toBe(true)
  })
})
