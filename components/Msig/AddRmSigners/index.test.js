import { cleanup, render, screen, act, fireEvent } from '@testing-library/react'
import { Message } from '@glif/filecoin-message'

import { AddSigner, RemoveSigner } from '.'
import composeMockAppTree from '../../../test-utils/composeMockAppTree'
import { flushPromises, MULTISIG_ACTOR_ADDRESS } from '../../../test-utils'

jest.mock('../../../MsigProvider')
jest.mock('../../../WalletProvider')

describe('Multisig add & remove  flow', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
  })

  describe('Adding a signer', () => {
    afterEach(() => {
      jest.clearAllTimers()
      cleanup()
    })

    test('it allows a user to add a signer', async () => {
      const { Tree, store, walletProvider } = composeMockAppTree('postOnboard')
      const toAddr = 't0100'

      await act(async () => {
        render(
          <Tree>
            <AddSigner />
          </Tree>
        )
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
        fireEvent.change(screen.getByPlaceholderText(/f1.../), {
          target: { value: toAddr },
          preventDefault: () => {}
        })
        await flushPromises()
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
      })

      expect(walletProvider.getNonce).toHaveBeenCalled()
      expect(walletProvider.wallet.sign).toHaveBeenCalled()
      expect(walletProvider.simulateMessage).toHaveBeenCalled()
      const message = Message.fromLotusType(
        walletProvider.wallet.sign.mock.calls[0][1]
      ).toZondaxType()
      expect(!!message.gaspremium).toBe(true)
      expect(typeof message.gaspremium).toBe('string')
      expect(!!message.gasfeecap).toBe(true)
      expect(typeof message.gasfeecap).toBe('string')
      expect(!!message.gaslimit).toBe(true)
      expect(typeof message.gaslimit).toBe('number')
      expect(!!message.value).toBe(true)
      expect(Number(message.value)).not.toBe('NaN')
      expect(message.to).toBe(MULTISIG_ACTOR_ADDRESS)

      expect(store.getState().messages.pending.length).toBe(1)
    })

    test('it does not allow a user to add signer if address is poorly formed', async () => {
      const { Tree, store, walletProvider } = composeMockAppTree('postOnboard')

      await act(async () => {
        render(
          <Tree>
            <AddSigner />
          </Tree>
        )
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
        fireEvent.change(screen.getByPlaceholderText(/f1.../), {
          target: { value: 't51235jds' },
          preventDefault: () => {}
        })
        await flushPromises()
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
      })
      expect(screen.getByText(/Invalid address/)).toBeInTheDocument()
      expect(walletProvider.getNonce).not.toHaveBeenCalled()
      expect(walletProvider.wallet.sign).not.toHaveBeenCalled()
      expect(store.getState().messages.pending.length).toBe(0)
    })

    test('it allows the user to see the max transaction fee', async () => {
      const { Tree } = composeMockAppTree('postOnboard')

      const toAddr = 't0100'
      await act(async () => {
        render(
          <Tree>
            <AddSigner />
          </Tree>
        )
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
        fireEvent.change(screen.getByPlaceholderText(/f1.../), {
          target: { value: toAddr },
          preventDefault: () => {}
        })
        await flushPromises()
        fireEvent.click(screen.getByText('Next'))
      })
      expect(screen.getByText(/Transaction fee/)).toBeInTheDocument()
    })

    test('it allows the user to set the max transaction fee', async () => {
      const { Tree } = composeMockAppTree('postOnboard')

      const toAddr = 't0100'
      await act(async () => {
        render(
          <Tree>
            <AddSigner />
          </Tree>
        )
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
        fireEvent.change(screen.getByPlaceholderText(/f1.../), {
          target: { value: toAddr },
          preventDefault: () => {}
        })
        await flushPromises()
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
        fireEvent.change(screen.getByDisplayValue('1000000'), {
          target: { value: '2000000' }
        })
        await flushPromises()
      })
      expect(screen.getByText(/Transaction fee/)).toBeInTheDocument()
      expect(screen.getByText(/Save/)).toBeInTheDocument()
      expect(screen.getByText(/Cancel/)).toBeInTheDocument()
    })

    test('it allows the user to save the max transaction fee', async () => {
      const { Tree } = composeMockAppTree('postOnboard')

      const toAddr = 't0100'
      await act(async () => {
        render(
          <Tree>
            <AddSigner />
          </Tree>
        )
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
        fireEvent.change(screen.getByPlaceholderText(/f1.../), {
          target: { value: toAddr },
          preventDefault: () => {}
        })
        await flushPromises()
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
        fireEvent.change(screen.getByDisplayValue('1000000'), {
          target: { value: '2000000' }
        })
        await flushPromises()
        fireEvent.click(screen.getByText('Save'))
        await flushPromises()
      })
      expect(screen.getByText(/Transaction fee/)).toBeInTheDocument()
      expect(screen.getByText(/0.000000000002/)).toBeInTheDocument()
    })

    describe('snapshots', () => {
      afterEach(cleanup)

      test('it renders preface correctly', async () => {
        const { Tree } = composeMockAppTree('postOnboard')

        let res
        await act(async () => {
          res = render(
            <Tree>
              <AddSigner />
            </Tree>
          )
        })
        expect(res.container).toMatchSnapshot()
        expect(screen.getByText(/Warning/)).toBeInTheDocument()
      })

      test('it renders step 2 correctly', async () => {
        const { Tree } = composeMockAppTree('postOnboard')

        let res
        await act(async () => {
          res = render(
            <Tree>
              <AddSigner />
            </Tree>
          )
          fireEvent.click(screen.getByText('Next'))
          await flushPromises()
        })
        expect(res.container).toMatchSnapshot()
        expect(
          screen.getByText(
            /Please enter a Filecoin address to add as a signer and click Next./
          )
        ).toBeInTheDocument()
      })

      test('it renders step 3 correctly', async () => {
        const { Tree } = composeMockAppTree('postOnboard')
        const toAddr = 't0100'

        let res
        await act(async () => {
          res = render(
            <Tree>
              <AddSigner />
            </Tree>
          )
          fireEvent.click(screen.getByText('Next'))
          await flushPromises()
          fireEvent.change(screen.getByPlaceholderText(/f1.../), {
            target: { value: toAddr },
            preventDefault: () => {}
          })
          await flushPromises()
          fireEvent.click(screen.getByText('Next'))
        })
        expect(res.container).toMatchSnapshot()
        expect(
          screen.getByText(/review the transaction fee details/)
        ).toBeInTheDocument()
      })
    })
  })

  describe('Removing a signer', () => {
    afterEach(() => {
      jest.clearAllTimers()
      cleanup()
    })

    test('it allows a user to remove a signer', async () => {
      const { Tree, store, walletProvider } = composeMockAppTree('postOnboard')
      const { selectedWalletIdx, wallets } = store.getState()
      await act(async () => {
        render(
          <Tree>
            <RemoveSigner signerAddress={wallets[selectedWalletIdx].address} />
          </Tree>
        )
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
      })

      expect(walletProvider.getNonce).toHaveBeenCalled()
      expect(walletProvider.wallet.sign).toHaveBeenCalled()
      const message = Message.fromLotusType(
        walletProvider.wallet.sign.mock.calls[0][1]
      ).toZondaxType()
      expect(!!message.gaspremium).toBe(true)
      expect(typeof message.gaspremium).toBe('string')
      expect(!!message.gasfeecap).toBe(true)
      expect(typeof message.gasfeecap).toBe('string')
      expect(!!message.gaslimit).toBe(true)
      expect(typeof message.gaslimit).toBe('number')
      expect(!!message.value).toBe(true)
      expect(Number(message.value)).not.toBe('NaN')
      expect(message.to).toBe(MULTISIG_ACTOR_ADDRESS)

      expect(store.getState().messages.pending.length).toBe(1)
    })

    test('it allows the user to see the max transaction fee', async () => {
      const { Tree, store } = composeMockAppTree('postOnboard')
      const { selectedWalletIdx, wallets } = store.getState()

      await act(async () => {
        render(
          <Tree>
            <RemoveSigner signerAddress={wallets[selectedWalletIdx].address} />
          </Tree>
        )
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
      })
      expect(screen.getByText(/Transaction fee/)).toBeInTheDocument()
    })

    test('it allows the user to set the max transaction fee', async () => {
      const { Tree, store } = composeMockAppTree('postOnboard')
      const { selectedWalletIdx, wallets } = store.getState()

      await act(async () => {
        render(
          <Tree>
            <RemoveSigner signerAddress={wallets[selectedWalletIdx].address} />
          </Tree>
        )
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
        fireEvent.change(screen.getByDisplayValue('1000000'), {
          target: { value: '2000000' }
        })
        await flushPromises()
      })
      expect(screen.getByText(/Transaction fee/)).toBeInTheDocument()
      expect(screen.getByText(/Save/)).toBeInTheDocument()
      expect(screen.getByText(/Cancel/)).toBeInTheDocument()
    })

    test('it allows the user to save the max transaction fee', async () => {
      const { Tree, store } = composeMockAppTree('postOnboard')
      const { selectedWalletIdx, wallets } = store.getState()

      await act(async () => {
        render(
          <Tree>
            <RemoveSigner signerAddress={wallets[selectedWalletIdx].address} />
          </Tree>
        )
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
        fireEvent.change(screen.getByDisplayValue('1000000'), {
          target: { value: '2000000' }
        })
        await flushPromises()
        fireEvent.click(screen.getByText('Save'))
        await flushPromises()
      })
      expect(screen.getByText(/Transaction fee/)).toBeInTheDocument()
      expect(screen.getByText(/0.000000000002/)).toBeInTheDocument()
    })

    describe('snapshots', () => {
      afterEach(cleanup)

      test('it renders preface correctly', async () => {
        const { Tree, store } = composeMockAppTree('postOnboard')
        const { selectedWalletIdx, wallets } = store.getState()
        let res

        await act(async () => {
          res = render(
            <Tree>
              <RemoveSigner
                signerAddress={wallets[selectedWalletIdx].address}
              />
            </Tree>
          )
          expect(res.container).toMatchSnapshot()
          expect(screen.getByText(/Warning/)).toBeInTheDocument()
        })
      })

      test('it renders step 2 correctly', async () => {
        const { Tree, store } = composeMockAppTree('postOnboard')
        const { selectedWalletIdx, wallets } = store.getState()
        let res

        await act(async () => {
          res = render(
            <Tree>
              <RemoveSigner
                signerAddress={wallets[selectedWalletIdx].address}
              />
            </Tree>
          )
          fireEvent.click(screen.getByText('Next'))
          await flushPromises()
        })
        expect(res.container).toMatchSnapshot()
        expect(
          screen.getByText(
            /lease review the transaction fee details and click Next to continue./
          )
        ).toBeInTheDocument()
      })
    })
  })
})
