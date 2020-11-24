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
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
        fireEvent.change(screen.getByPlaceholderText(CHAIN_HEAD.toString()), {
          target: { value: 2000 }
        })
        fireEvent.blur(screen.getAllByPlaceholderText('0')[1])
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
        '2000'
      )

      expect(store.getState().messages.pending.length).toBe(1)
      expect(screen.getByText('Next')).toBeDisabled()
    })

    test('it does not allow a user to fund the multisig with a balance higher than the wallet balance', async () => {
      const { Tree } = composeMockAppTree('postOnboard')
      const filAmount = new FilecoinNumber(5, 'fil')
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
      })

      expect(
        screen.getByText(
          /The amount must be smaller than this account's balance/
        )
      ).toBeInTheDocument()
      expect(screen.getByText(/Step 2/)).toBeInTheDocument()
    })

    test('it allows a user to add multiple signers to the multisig create', async () => {
      const { Tree, store, walletProvider } = composeMockAppTree('postOnboard')
      const filAmount = new FilecoinNumber(1, 'fil')
      const secondSigner = 'f0100'
      await act(async () => {
        render(
          <Tree>
            <Create />
          </Tree>
        )
        fireEvent.click(screen.getByText(/Add Another Signer/))
        await flushPromises()
        fireEvent.change(screen.getAllByPlaceholderText(/f1.../)[1], {
          target: { value: secondSigner },
          preventDefault: () => {}
        })
        await flushPromises()

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
      // check signers length is 2
      expect(
        multisigCreateCalls[multisigCreateCalls.length - 1][1].length
      ).toBe(2)
      expect(
        multisigCreateCalls[multisigCreateCalls.length - 1][1].includes(
          secondSigner
        )
      ).toBeTruthy()
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

    test('it allows a user to create a multisig with 0 vest duration', async () => {
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
      expect(
        multisigCreateCalls[multisigCreateCalls.length - 1][1].length
      ).toBe(1)
      expect(multisigCreateCalls[multisigCreateCalls.length - 1][2]).toBe(
        filAmount.toAttoFil()
      )
      expect(multisigCreateCalls[multisigCreateCalls.length - 1][3]).toBe(1)
      expect(multisigCreateCalls[multisigCreateCalls.length - 1][5]).toBe('0')
      expect(multisigCreateCalls[multisigCreateCalls.length - 1][6]).toBe('0')

      expect(store.getState().messages.pending.length).toBe(1)
    })

    test('it populates the start epoch with chain head', async () => {
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
      expect(
        multisigCreateCalls[multisigCreateCalls.length - 1][1].length
      ).toBe(1)
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

    describe('snapshots', () => {
      test('it renders step 1 correctly', async () => {
        const { Tree } = composeMockAppTree('postOnboard')
        let res
        await act(async () => {
          res = render(
            <Tree>
              <Create />
            </Tree>
          )
        })

        expect(res.container).toMatchSnapshot()
        expect(screen.getByText(/Step 1/)).toBeInTheDocument()
      })

      test('it renders multiple signers correctly', async () => {
        const { Tree } = composeMockAppTree('postOnboard')
        const secondSigner = 't0100'
        let res
        await act(async () => {
          res = render(
            <Tree>
              <Create />
            </Tree>
          )
          fireEvent.click(screen.getByText(/Add Another Signer/))
          await flushPromises()
          fireEvent.change(screen.getAllByPlaceholderText(/f1.../)[1], {
            target: { value: secondSigner },
            preventDefault: () => {}
          })
          await flushPromises()
        })

        expect(res.container).toMatchSnapshot()
        expect(screen.getByText(/Step 1/)).toBeInTheDocument()
        expect(screen.getByDisplayValue(secondSigner)).toBeInTheDocument()
      })

      test('it renders step 2 correctly', async () => {
        const { Tree } = composeMockAppTree('postOnboard')
        let res
        await act(async () => {
          res = render(
            <Tree>
              <Create />
            </Tree>
          )
          fireEvent.click(screen.getByText('Next'))
          await flushPromises()
        })

        expect(res.container).toMatchSnapshot()
        expect(screen.getByText(/Step 2/)).toBeInTheDocument()
      })

      test('it renders step 3 correctly', async () => {
        const { Tree } = composeMockAppTree('postOnboard')
        const filAmount = new FilecoinNumber(1, 'fil')
        let res
        await act(async () => {
          res = render(
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
        })

        expect(res.container).toMatchSnapshot()
        expect(screen.getByText(/Step 3/)).toBeInTheDocument()
      })

      test('it renders step 4 correctly', async () => {
        const { Tree } = composeMockAppTree('postOnboard')
        const filAmount = new FilecoinNumber(1, 'fil')
        let res
        await act(async () => {
          res = render(
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
          fireEvent.click(screen.getByText('Next'))
          await flushPromises()
        })

        expect(res.container).toMatchSnapshot()
        expect(screen.getByText(/Step 4/)).toBeInTheDocument()
      })

      test('it renders step 5 correctly', async () => {
        const { Tree } = composeMockAppTree('postOnboard')
        const filAmount = new FilecoinNumber(1, 'fil')
        let res
        await act(async () => {
          res = render(
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
          fireEvent.click(screen.getByText('Next'))
          await flushPromises()
          fireEvent.change(screen.getByPlaceholderText(CHAIN_HEAD.toString()), {
            target: { value: 2000 }
          })
          fireEvent.blur(screen.getAllByPlaceholderText('0')[1])
          await flushPromises()
          fireEvent.click(screen.getByText('Next'))
        })

        expect(res.container).toMatchSnapshot()
        expect(screen.getByText(/Step 5/)).toBeInTheDocument()
      })
    })
  })
})
