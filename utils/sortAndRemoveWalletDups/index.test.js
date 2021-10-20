import { FilecoinNumber } from '@glif/filecoin-number'
import sortAndRemoveWalletDups from '.'
import createPath from '../createPath'
import {
  MAINNET_PATH_CODE,
  SINGLE_KEY,
  TESTNET_PATH_CODE
} from '../../constants'

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
      .map((w) => w.path.split('/')[5])
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

  test('it correctly orders testnet and mainnet addresses', () => {
    const mainnetWallets = [
      {
        address: 'f013241',
        balance: new FilecoinNumber('1', 'fil'),
        path: createPath(461, 0)
      },
      {
        address: 'f0423563',
        balance: new FilecoinNumber('1', 'fil'),
        path: createPath(461, 1)
      }
    ]
    const testnetWallets = [
      {
        address: 'f045654',
        balance: new FilecoinNumber('1', 'fil'),
        path: createPath(1, 0)
      },
      {
        address: 'f04565909',
        balance: new FilecoinNumber('1', 'fil'),
        path: createPath(1, 1)
      }
    ]

    const wallets = sortAndRemoveWalletDups(mainnetWallets, testnetWallets)
    expect(wallets[0].path.split('/')[2].includes(MAINNET_PATH_CODE)).toBe(true)
    expect(wallets[1].path.split('/')[2].includes(MAINNET_PATH_CODE)).toBe(true)
    expect(wallets[2].path.split('/')[2].includes(TESTNET_PATH_CODE)).toBe(true)
    expect(wallets[3].path.split('/')[2].includes(TESTNET_PATH_CODE)).toBe(true)

    expect(
      Number(wallets[0].path.split('/')[5]) < wallets[1].path.split('/')[5]
    ).toBe(true)

    expect(
      Number(wallets[2].path.split('/')[5]) < wallets[3].path.split('/')[5]
    ).toBe(true)
  })
})
