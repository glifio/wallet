import { FilecoinNumber } from '@openworklabs/filecoin-number'
import { TESTNET } from '../../constants'

const mockGetAccounts = jest
  .fn()
  .mockImplementation((network = TESTNET, start = 0, end = 1) => {
    const accounts = []
    for (let i = start; i < end; i++) {
      accounts.push(`t1mbk7q6gm4rjlndfqw6f2vkfgqotres3fgicb${i}uq`)
    }

    return Promise.resolve(accounts)
  })

const mockGetBalance = jest
  .fn()
  .mockImplementation(() => Promise.resolve(new FilecoinNumber('1', 'fil')))

const mockSuprovider = {
  type: 'MOCK',
  getAccounts: mockGetAccounts,
  sign: jest.fn().mockImplementation(() => 'xxxyyyyzzzz')
}

class MockWalletProvider {
  constructor(subprovider = mockSuprovider) {
    this.wallet = subprovider
  }

  getBalance = mockGetBalance
  getNonce = jest.fn().mockImplementation(() => 0)
  estimateGas = jest
    .fn()
    .mockImplementation(() => new FilecoinNumber('122', 'attofil'))
  sendMessage = jest.fn().mockImplementation(() => 'QmZCid!')
}

export const mockWalletProviderInstance = new MockWalletProvider()

export default MockWalletProvider
