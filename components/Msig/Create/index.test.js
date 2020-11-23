import { cleanup, render, screen, act, fireEvent } from '@testing-library/react'
import { FilecoinNumber } from '@glif/filecoin-number'
import LotusRPCEngine from '@glif/filecoin-rpc-client'

import Create from '.'
import composeMockAppTree from '../../../test-utils/composeMockAppTree'
import { flushPromises } from '../../../test-utils'
import { createMultisig } from '../../../test-utils/mocks/mock-filecoin-signer-wasm'

jest.mock('@glif/filecoin-wallet-provider')
jest.mock('@glif/filecoin-rpc-client')

const CHAIN_HEAD = '1000'
const VEST = 100

describe('Create msig flow', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
    LotusRPCEngine.mockImplementation(() => {
      return {
        request: jest.fn(() => ({ Height: CHAIN_HEAD }))
      }
    })
  })

  describe('Creating multisig', () => {
    afterEach(() => {
      jest.clearAllTimers()
      cleanup()
    })

    test('it allows a user to create a multisig', async () => {
      const { Tree, store, walletProvider } = composeMockAppTree('postOnboard')
      const filAmount = new FilecoinNumber(1, 'fil')
      await act(async () => {
        render(
          <Tree>
            <Create />
          </Tree>
        )
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
        fireEvent.change(screen.getAllByPlaceholderText('0')[0], {
          target: { value: filAmount }
        })
        fireEvent.blur(screen.getAllByPlaceholderText('0')[0])
        jest.runOnlyPendingTimers()
        await flushPromises()
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
        fireEvent.change(screen.getAllByPlaceholderText('0')[1], {
          target: { value: VEST }
        })
        fireEvent.blur(screen.getAllByPlaceholderText('0')[1])
        await flushPromises()
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
        fireEvent.click(screen.getByText('Next'))
      })

      expect(walletProvider.getNonce).toHaveBeenCalled()
      expect(walletProvider.wallet.sign).toHaveBeenCalled()
      const message = walletProvider.wallet.sign.mock.calls[0][0]
      expect(!!message.gaspremium).toBe(true)
      expect(typeof message.gaspremium).toBe('string')
      expect(!!message.gasfeecap).toBe(true)
      expect(typeof message.gasfeecap).toBe('string')
      expect(!!message.gaslimit).toBe(true)
      expect(typeof message.gaslimit).toBe('number')
      expect(!!message.value).toBe(true)
      expect(Number(message.value)).not.toBe('NaN')
      expect(message.to).toBe('t01')

      const multisigCreateCalls = createMultisig.mock.calls
      expect(multisigCreateCalls[multisigCreateCalls.length - 1][2]).toBe(
        filAmount.toAttoFil()
      )
      expect(multisigCreateCalls[multisigCreateCalls.length - 1][3]).toBe(1)
      expect(multisigCreateCalls[multisigCreateCalls.length - 1][5]).toBe(
        VEST.toString()
      )
      expect(multisigCreateCalls[multisigCreateCalls.length - 1][6]).toBe(
        CHAIN_HEAD
      )

      expect(store.getState().messages.pending.length).toBe(1)
    })
  })
})
