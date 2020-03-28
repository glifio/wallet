import { FilecoinNumber } from '@openworklabs/filecoin-number'
import sortAndRemoveWalletDups from '.'
import createPath from '../createPath'
import { SINGLE_KEY } from '../../constants'

describe('sortAndRemoveWalletDups', () => {
  test('it removes duplicate wallets', () => {
    const wallets = [
      {
        address: 't3jdlflg3voaiblrvn2yfivvn5ifucwwv5f26nfza',
        balance: new FilecoinNumber('1', 'fil'),
        path: createPath(1, 3)
      },
      {
        address: 't0jdlflg3voaiblrvn2yfivvn5ifucwwv5f26nfza',
        balance: new FilecoinNumber('1', 'fil'),
        path: createPath(1, 0)
      },
      {
        address: 't2jdlflg3voaiblrvn2yfivvn5ifucwwv5f26nfza',
        balance: new FilecoinNumber('1', 'fil'),
        path: createPath(1, 2)
      },
      {
        address: 't1jdlflg3voaiblrvn2yfivvn5ifucwwv5f26nfza',
        balance: new FilecoinNumber('1', 'fil'),
        path: createPath(1, 1)
      }
    ]

    const duplicateWallets = [
      {
        address: 't3jdlflg3voaiblrvn2yfivvn5ifucwwv5f26nfza',
        balance: new FilecoinNumber('1', 'fil'),
        path: createPath(1, 3)
      },
      {
        address: 't0jdlflg3voaiblrvn2yfivvn5ifucwwv5f26nfza',
        balance: new FilecoinNumber('1', 'fil'),
        path: createPath(1, 0)
      },
      {
        address: 't2jdlflg3voaiblrvn2yfivvn5ifucwwv5f26nfza',
        balance: new FilecoinNumber('1', 'fil'),
        path: createPath(1, 2)
      },
      {
        address: 't1jdlflg3voaiblrvn2yfivvn5ifucwwv5f26nfza',
        balance: new FilecoinNumber('1', 'fil'),
        path: createPath(1, 1)
      }
    ]
    const uniqueWallets = sortAndRemoveWalletDups(wallets, duplicateWallets)
    expect(uniqueWallets).toHaveLength(4)
  })

  test('it sorts wallets based on their paths', () => {
    const unsortedWallets = [
      {
        address: 't3jdlflg3voaiblrvn2yfivvn5ifucwwv5f26nfza',
        balance: new FilecoinNumber('1', 'fil'),
        path: createPath(1, 3)
      },
      {
        address: 't0jdlflg3voaiblrvn2yfivvn5ifucwwv5f26nfza',
        balance: new FilecoinNumber('1', 'fil'),
        path: createPath(1, 0)
      },
      {
        address: 't2jdlflg3voaiblrvn2yfivvn5ifucwwv5f26nfza',
        balance: new FilecoinNumber('1', 'fil'),
        path: createPath(1, 2)
      },
      {
        address: 't1jdlflg3voaiblrvn2yfivvn5ifucwwv5f26nfza',
        balance: new FilecoinNumber('1', 'fil'),
        path: createPath(1, 1)
      }
    ]

    const wallets = sortAndRemoveWalletDups(unsortedWallets, [])

    const sorted = wallets
      .map(w => w.path.split('/')[5])
      .every((val, i, arr) => !i || val >= arr[i - 1])

    expect(sorted).toEqual(true)
  })

  test('it does not break with non-HD wallets', () => {
    const simpleWallet = {
      address: 't3jdlflg3voaiblrvn2yfivvn5ifucwwv5f26nfza',
      balance: new FilecoinNumber('1', 'fil'),
      path: SINGLE_KEY
    }
    const simpleWalletDup = {
      address: 't3jdlflg3voaiblrvn2yfivvn5ifucwwv5f26nfza',
      balance: new FilecoinNumber('1', 'fil'),
      path: SINGLE_KEY
    }

    const simpleWallet2 = {
      address: 't2jdlflg3voaiblrvn2yfivvn5ifucwwv5f26nfza',
      balance: new FilecoinNumber('1', 'fil'),
      path: SINGLE_KEY
    }

    const wallets = sortAndRemoveWalletDups(
      [simpleWallet, simpleWalletDup],
      [simpleWallet2]
    )
    expect(wallets).toHaveLength(2)
  })
})
