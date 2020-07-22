jest.mock('axios')
jest.mock('@openworklabs/lotus-jsonrpc-engine')

import { cleanup, render, act, wait } from '@testing-library/react'
import axios from 'axios'
import LotusRPCEngine from '@openworklabs/lotus-jsonrpc-engine'
import connectionStrength from './connectionStrength'
import NodeConnectedWidget from '.'
import ThemeProvider from '../ThemeProvider'
import { flushPromises } from '../../../test-utils'

describe('nodeConnectedWidget', () => {
  describe('nodeConnectedWidget UI Component', () => {
    afterEach(cleanup)
    beforeEach(() => {
      jest.useFakeTimers()
      jest.clearAllMocks()
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
    })

    test('it renders connecting state', () => {
      const res = render(
        <ThemeProvider>
          <NodeConnectedWidget apiAddress='https://node.glif.io/02/rpc/v0' />
        </ThemeProvider>
      )
      expect(res.container.firstChild).toMatchSnapshot()
    })

    test('it renders connected state', async () => {
      const onChangeSpy = jest.fn()
      let res
      await act(async () => {
        res = render(
          <ThemeProvider>
            <NodeConnectedWidget
              onConnectionStrengthChange={onChangeSpy}
              apiAddress='https://node.glif.io/02/rpc/v0'
            />
          </ThemeProvider>
        )
        await flushPromises()
        jest.runAllTimers()
      })
      expect(res.container.firstChild).toMatchSnapshot()
      expect(onChangeSpy).toHaveBeenCalledWith(2)
    })

    test('it pushes to the error page when node disconnects', async () => {
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

      const onChangeSpy = jest.fn()
      let res
      await act(async () => {
        res = render(
          <ThemeProvider>
            <NodeConnectedWidget
              onConnectionStrengthChange={onChangeSpy}
              apiAddress='https://node.glif.io/02/rpc/v0'
            />
          </ThemeProvider>
        )
        await flushPromises()
        jest.runAllTimers()
      })
      expect(res.container.firstChild).toMatchSnapshot()
      expect(onChangeSpy).toHaveBeenCalledWith(1)
    })
  })

  describe('connectionStrength', () => {
    beforeEach(jest.clearAllMocks)

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
})
