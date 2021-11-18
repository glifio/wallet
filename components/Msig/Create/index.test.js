import { cleanup, render, screen, act, fireEvent } from '@testing-library/react'
import { FilecoinNumber } from '@glif/filecoin-number'
import LotusRPCEngine from '@glif/filecoin-rpc-client'
import { Message } from '@glif/filecoin-message'

import Create from '.'
import composeMockAppTree from '../../../test-utils/composeMockAppTree'
import { flushPromises } from '../../../test-utils'
import { createMultisig } from '../../../test-utils/mocks/mock-filecoin-signer-wasm'

jest.mock('@glif/filecoin-wallet-provider')
jest.mock('@glif/filecoin-rpc-client')
jest.mock('../../../MsigProvider')
jest.mock('../../../WalletProvider')

const CHAIN_HEAD = '1000'
const VEST = 100

const next = async () => {
  await act(async () => {
    fireEvent.click(screen.getByText('Next'))
    await flushPromises()
  })
}

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
      })

      await next()

      await act(async () => {
        await fireEvent.change(screen.getAllByPlaceholderText('0')[0], {
          target: { value: filAmount }
        })
        fireEvent.blur(screen.getAllByPlaceholderText('0')[0])
        jest.runOnlyPendingTimers()
        await flushPromises()
      })

      await next()

      await act(async () => {
        await fireEvent.change(screen.getAllByPlaceholderText('0')[1], {
          target: { value: VEST }
        })
        fireEvent.blur(screen.getAllByPlaceholderText('0')[1])
        await flushPromises()
      })

      await next()

      await act(async () => {
        await fireEvent.change(
          screen.getByPlaceholderText(CHAIN_HEAD.toString()),
          {
            target: { value: 2000 }
          }
        )
        fireEvent.blur(screen.getAllByPlaceholderText('0')[1])
        await flushPromises()
      })

      await next()
      await next()

      expect(walletProvider.getNonce).toHaveBeenCalled()
      expect(walletProvider.wallet.sign).toHaveBeenCalled()
      const message = Message.fromLotusType(
        walletProvider.wallet.sign.mock.calls[0][1]
      ).toZondaxType()
      expect(Number(message.gaspremium) > 0).toBe(true)
      expect(typeof message.gaspremium).toBe('string')
      expect(Number(message.gasfeecap) > 0).toBe(true)
      expect(typeof message.gasfeecap).toBe('string')
      expect(message.gaslimit > 0).toBe(true)
      expect(typeof message.gaslimit).toBe('number')
      expect(!!message.value).toBe(true)
      expect(Number(message.value)).not.toBe('NaN')
      expect(message.to).toBe('f01')

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
      })

      await next()

      await act(async () => {
        await fireEvent.change(screen.getAllByPlaceholderText('0')[0], {
          target: { value: filAmount }
        })
        fireEvent.blur(screen.getAllByPlaceholderText('0')[0])
        jest.runOnlyPendingTimers()
        await flushPromises()
      })

      await next()

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
      })
      await next()

      await act(async () => {
        await fireEvent.change(screen.getAllByPlaceholderText('0')[0], {
          target: { value: filAmount }
        })
        fireEvent.blur(screen.getAllByPlaceholderText('0')[0])
        jest.runOnlyPendingTimers()
        await flushPromises()
      })
      await next()
      await act(async () => {
        await fireEvent.change(screen.getAllByPlaceholderText('0')[1], {
          target: { value: VEST }
        })
        fireEvent.blur(screen.getAllByPlaceholderText('0')[1])
        await flushPromises()
      })
      await next()
      await next()
      await next()

      expect(walletProvider.getNonce).toHaveBeenCalled()
      expect(walletProvider.wallet.sign).toHaveBeenCalled()
      const message = Message.fromLotusType(
        walletProvider.wallet.sign.mock.calls[0][1]
      ).toZondaxType()
      expect(Number(message.gaspremium) > 0).toBe(true)
      expect(typeof message.gaspremium).toBe('string')
      expect(Number(message.gasfeecap) > 0).toBe(true)
      expect(typeof message.gasfeecap).toBe('string')
      expect(message.gaslimit > 0).toBe(true)
      expect(typeof message.gaslimit).toBe('number')
      expect(!!message.value).toBe(true)
      expect(Number(message.value)).not.toBe('NaN')
      expect(message.to).toBe('f01')

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
      })

      await next()

      await act(async () => {
        await fireEvent.change(screen.getAllByPlaceholderText('0')[0], {
          target: { value: filAmount }
        })
        fireEvent.blur(screen.getAllByPlaceholderText('0')[0])
        jest.runOnlyPendingTimers()
        await flushPromises()
      })

      await next()
      await next()
      await next()

      expect(walletProvider.getNonce).toHaveBeenCalled()
      expect(walletProvider.wallet.sign).toHaveBeenCalled()
      const message = Message.fromLotusType(
        walletProvider.wallet.sign.mock.calls[0][1]
      ).toZondaxType()
      expect(Number(message.gaspremium) > 0).toBe(true)
      expect(typeof message.gaspremium).toBe('string')
      expect(Number(message.gasfeecap) > 0).toBe(true)
      expect(typeof message.gasfeecap).toBe('string')
      expect(message.gaslimit > 0).toBe(true)
      expect(typeof message.gaslimit).toBe('number')
      expect(!!message.value).toBe(true)
      expect(Number(message.value)).not.toBe('NaN')
      expect(message.to).toBe('f01')

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
      })

      await next()

      await act(async () => {
        await fireEvent.change(screen.getAllByPlaceholderText('0')[0], {
          target: { value: filAmount }
        })
        fireEvent.blur(screen.getAllByPlaceholderText('0')[0])
        jest.runOnlyPendingTimers()
        await flushPromises()
      })

      await next()
      await act(async () => {
        await fireEvent.change(screen.getAllByPlaceholderText('0')[1], {
          target: { value: VEST }
        })
        fireEvent.blur(screen.getAllByPlaceholderText('0')[1])
        await flushPromises()
      })
      await next()
      await next()
      await next()

      expect(walletProvider.getNonce).toHaveBeenCalled()
      expect(walletProvider.wallet.sign).toHaveBeenCalled()
      const message = Message.fromLotusType(
        walletProvider.wallet.sign.mock.calls[0][1]
      ).toZondaxType()
      expect(Number(message.gaspremium) > 0).toBe(true)
      expect(typeof message.gaspremium).toBe('string')
      expect(Number(message.gasfeecap) > 0).toBe(true)
      expect(typeof message.gasfeecap).toBe('string')
      expect(message.gaslimit > 0).toBe(true)
      expect(typeof message.gaslimit).toBe('number')
      expect(!!message.value).toBe(true)
      expect(Number(message.value)).not.toBe('NaN')
      expect(message.to).toBe('f01')

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

    test('it populates the start epoch with chain head', async () => {
      const START_EPOCH = '100000'
      const { Tree, store, walletProvider } = composeMockAppTree('postOnboard')
      const filAmount = new FilecoinNumber(1, 'fil')
      await act(async () => {
        render(
          <Tree>
            <Create />
          </Tree>
        )
      })

      await next()

      await act(async () => {
        await fireEvent.change(screen.getAllByPlaceholderText('0')[0], {
          target: { value: filAmount }
        })
        fireEvent.blur(screen.getAllByPlaceholderText('0')[0])
        jest.runOnlyPendingTimers()
        await flushPromises()
      })
      await next()

      await act(async () => {
        await fireEvent.change(screen.getAllByPlaceholderText('0')[1], {
          target: { value: VEST }
        })
        fireEvent.blur(screen.getAllByPlaceholderText('0')[1])
      })
      await next()
      await act(async () => {
        await fireEvent.change(screen.getAllByPlaceholderText(CHAIN_HEAD)[0], {
          target: { value: START_EPOCH }
        })
        fireEvent.blur(screen.getByDisplayValue(START_EPOCH))
        await flushPromises()
      })

      await next()
      await next()
      await next()

      expect(walletProvider.getNonce).toHaveBeenCalled()
      expect(walletProvider.wallet.sign).toHaveBeenCalled()
      const message = Message.fromLotusType(
        walletProvider.wallet.sign.mock.calls[0][1]
      ).toZondaxType()
      expect(Number(message.gaspremium) > 0).toBe(true)
      expect(typeof message.gaspremium).toBe('string')
      expect(Number(message.gasfeecap) > 0).toBe(true)
      expect(typeof message.gasfeecap).toBe('string')
      expect(message.gaslimit > 0).toBe(true)
      expect(typeof message.gaslimit).toBe('number')
      expect(!!message.value).toBe(true)
      expect(Number(message.value)).not.toBe('NaN')
      expect(message.to).toBe('f01')

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
        START_EPOCH
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

        expect(screen.getByText(/Balance/)).toBeInTheDocument()
        expect(screen.getByText(/1 FIL/)).toBeInTheDocument()
        expect(screen.getByText(/Signer Address/)).toBeInTheDocument()
        expect(screen.getByText(/Add Another Signer/)).toBeInTheDocument()
        expect(
          screen.getByDisplayValue(/t1z225tguggx4onbauimqvxzutopzdr2m4s6z6wgi/)
        ).toBeInTheDocument()
        expect(screen.getByText(/Step 1/)).toBeInTheDocument()
        expect(res.container).toMatchSnapshot()
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

        expect(screen.getByText(/Step 1/)).toBeInTheDocument()
        expect(screen.getByDisplayValue(secondSigner)).toBeInTheDocument()
        expect(res.container).toMatchSnapshot()
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
        })
        await next()

        expect(screen.getByText(/Step 2/)).toBeInTheDocument()
        expect(
          screen.getByText(
            /Next, please choose how much FIL to send to the multisig./
          )
        ).toBeInTheDocument()
        expect(screen.getByText(/Amount/)).toBeInTheDocument()
        expect(screen.getByPlaceholderText('0')).toBeInTheDocument()

        expect(res.container).toMatchSnapshot()
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
        })

        await next()

        await act(async () => {
          await fireEvent.change(screen.getAllByPlaceholderText('0')[0], {
            target: { value: filAmount }
          })
          fireEvent.blur(screen.getAllByPlaceholderText('0')[0])
          jest.runOnlyPendingTimers()
          await flushPromises()
        })

        await next()

        await act(async () => {
          fireEvent.change(screen.getAllByPlaceholderText('0')[1], {
            target: { value: VEST }
          })
          fireEvent.blur(screen.getAllByPlaceholderText('0')[1])
        })

        expect(screen.getByText(/Step 3/)).toBeInTheDocument()
        expect(screen.getByText('Vest (# blocks)')).toBeInTheDocument()
        expect(res.container).toMatchSnapshot()
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
        })

        await next()

        await act(async () => {
          await fireEvent.change(screen.getAllByPlaceholderText('0')[0], {
            target: { value: filAmount }
          })
          fireEvent.blur(screen.getAllByPlaceholderText('0')[0])
          jest.runOnlyPendingTimers()
          await flushPromises()
        })

        await next()

        await act(async () => {
          fireEvent.change(screen.getAllByPlaceholderText('0')[1], {
            target: { value: VEST }
          })
          fireEvent.blur(screen.getAllByPlaceholderText('0')[1])
        })

        await next()

        expect(screen.getByText(/Step 4/)).toBeInTheDocument()
        expect(screen.getByText(/Start epoch/)).toBeInTheDocument()
        expect(screen.getByDisplayValue('1000')).toBeInTheDocument()

        expect(res.container).toMatchSnapshot()
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
        })

        await next()
        await act(async () => {
          await fireEvent.change(screen.getAllByPlaceholderText('0')[0], {
            target: { value: filAmount }
          })
          fireEvent.blur(screen.getAllByPlaceholderText('0')[0])
          jest.runOnlyPendingTimers()
          await flushPromises()
        })
        await next()
        await act(async () => {
          fireEvent.change(screen.getAllByPlaceholderText('0')[1], {
            target: { value: VEST }
          })
          fireEvent.blur(screen.getAllByPlaceholderText('0')[1])
        })
        await next()

        await act(async () => {
          fireEvent.change(screen.getByPlaceholderText(CHAIN_HEAD.toString()), {
            target: { value: 2000 }
          })
          fireEvent.blur(screen.getAllByPlaceholderText('0')[1])
          await flushPromises()
        })

        await next()
        expect(screen.getByText(/Step 5/)).toBeInTheDocument()
        expect(
          screen.getByText(/Please review the transaction details./)
        ).toBeInTheDocument()

        expect(screen.getByDisplayValue('1000000')).toBeInTheDocument()
        expect(screen.getByText('Transaction fee')).toBeInTheDocument()
        expect(
          screen.getByText(/You will not pay more than/)
        ).toBeInTheDocument()
        expect(res.container).toMatchSnapshot()
      })
    })
  })
})
