import connectionStrength from './connectionStrength'
import axios from 'axios'
import LotusRPCEngine from '@openworklabs/lotus-jsonrpc-engine'
jest.mock('axios')
jest.mock('@openworklabs/lotus-jsonrpc-engine')

describe('connectionStrength', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('it returns 2 when the Chain is synced ', async () => {
    LotusRPCEngine.mockImplementation(() => {
      return {
        request: jest.fn(() => ({ Height: 1000 }))
      }
    })
    // filscan gets called first, so we mock its return val first
    axios.get.mockResolvedValueOnce({
      data: {
        res: {
          code: 3
        },
        data: { tipset_height: 1000 }
      }
    })

    // then filscout
    axios.get.mockResolvedValueOnce({
      data: {
        code: 200,
        data: {
          statistic: {
            tipset_height: 1000
          }
        }
      }
    })

    const nodeURL = 'https://proxy.openworklabs.com/rpc/v0'
    const strength = await connectionStrength(nodeURL)
    expect(strength).toBe(2)
  })

  test('it will return a score of 1 if the node is not connected to the right network', async () => {
    // request should stay the same for the first 5 nodes, then once for our actual call
    LotusRPCEngine.mockImplementation(() => {
      return { request: jest.fn(() => ({ Height: 1000 })) }
    }).mockImplementationOnce(() => {
      return { request: jest.fn(() => ({ Height: 100 })) }
    })
    // filscan gets called first, so we mock its return val first
    axios.get.mockResolvedValueOnce({
      data: {
        res: {
          code: 3
        },
        data: { tipset_height: 1000 }
      }
    })

    // then filscout
    axios.get.mockResolvedValueOnce({
      data: {
        code: 200,
        data: {
          statistic: {
            tipset_height: 1000
          }
        }
      }
    })

    const nodeURL = 'https://proxy.openworklabs.com/rpc/v0'
    const strength = await connectionStrength(nodeURL)
    expect(strength).toBe(1)
  })
})
