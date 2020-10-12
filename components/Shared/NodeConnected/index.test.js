jest.mock('@glif/filecoin-rpc-client')

import { cleanup, render, act } from '@testing-library/react'
import LotusRPCEngine from '@glif/filecoin-rpc-client'
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

    test('it renders the disconnected state', async () => {
      LotusRPCEngine.mockImplementation(() => {
        return { request: jest.fn(() => ({})) }
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
      expect(onChangeSpy).toHaveBeenCalledWith(0)
    })
  })

  describe('connectionStrength', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      jest.clearAllTimers()
    })

    test('it returns 2 when the Chain is synced ', async () => {
      LotusRPCEngine.mockImplementation(() => {
        return {
          request: jest.fn(() => ({ Height: 1000 }))
        }
      })
      const nodeURL = 'https://proxy.openworklabs.com/rpc/v0'
      const strength = await connectionStrength(nodeURL)
      expect(strength).toBe(2)
    })

    test.skip('it will return a score of 1 if the node is not connected to the right network', async () => {
      // request should stay the same for the first 5 nodes, then once for our actual call
      LotusRPCEngine.mockImplementation(() => {
        return { request: jest.fn(() => ({ Height: 1000 })) }
      }).mockImplementationOnce(() => {
        return { request: jest.fn(() => ({ Height: 100 })) }
      })

      const nodeURL = 'https://proxy.openworklabs.com/rpc/v0'
      const strength = await connectionStrength(nodeURL)
      expect(strength).toBe(1)
    })
  })
})
