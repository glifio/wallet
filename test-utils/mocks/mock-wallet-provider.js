import { FilecoinNumber } from '@openworklabs/filecoin-number'

const mockGetAccounts = jest
  .fn()
  .mockImplementation(() =>
    Promise.resolve(['t1mbk7q6gm4rjlndfqw6f2vkfgqotres3fgicb2uq'])
  )

const mockGetBalance = jest
  .fn()
  .mockImplementation(() => Promise.resolve(new FilecoinNumber('1', 'fil')))

class MockWalletProvider {
  wallet = {
    getAccounts: mockGetAccounts,
    sign: jest.fn().mockImplementation(() => 'xxxyyyyzzzz')
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
