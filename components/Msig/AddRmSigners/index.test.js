import { cleanup, render, screen, act, fireEvent } from '@testing-library/react'
import { FilecoinNumber } from '@glif/filecoin-number'

import { AddSigner, RemoveSigner } from '.'
import composeMockAppTree from '../../../test-utils/composeMockAppTree'
import { flushPromises } from '../../../test-utils'

jest.mock('@glif/filecoin-wallet-provider')

describe('Multisig add & remove  flow', () => {
  let close = () => {}
  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
    close = jest.fn()
  })

  describe('Adding a signer', () => {
    afterEach(() => {
      jest.clearAllTimers()
      cleanup()
    })

    test('it allows a user to add a signer', async () => {
      const { Tree, store, walletProvider } = composeMockAppTree('postOnboard')
      const msigAddress = 't034066'
      const msigBalance = new FilecoinNumber('1', 'fil')

      const toAddr = 't0100'

      await act(async () => {
        render(
          <Tree>
            <AddSigner
              address={msigAddress}
              balance={msigBalance}
              close={close}
            />
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
      const message = walletProvider.wallet.sign.mock.calls[0][0]
      expect(!!message.gaspremium).toBe(true)
      expect(typeof message.gaspremium).toBe('string')
      expect(!!message.gasfeecap).toBe(true)
      expect(typeof message.gasfeecap).toBe('string')
      expect(!!message.gaslimit).toBe(true)
      expect(typeof message.gaslimit).toBe('number')
      expect(!!message.value).toBe(true)
      expect(Number(message.value)).not.toBe('NaN')
      expect(message.to).toBe(msigAddress)

      expect(store.getState().messages.pending.length).toBe(1)
    })

    test('it does not allow a user to add signer if address is poorly formed', async () => {
      const { Tree, store, walletProvider } = composeMockAppTree('postOnboard')
      const msigAddress = 't034066'
      const msigBalance = new FilecoinNumber('1', 'fil')

      await act(async () => {
        render(
          <Tree>
            <AddSigner
              address={msigAddress}
              balance={msigBalance}
              close={close}
            />
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
      const msigAddress = 't034066'
      const msigBalance = new FilecoinNumber('1', 'fil')

      const toAddr = 't0100'
      await act(async () => {
        render(
          <Tree>
            <AddSigner
              address={msigAddress}
              balance={msigBalance}
              close={close}
            />
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
      const msigAddress = 't034066'
      const msigBalance = new FilecoinNumber('1', 'fil')

      const toAddr = 't0100'
      await act(async () => {
        render(
          <Tree>
            <AddSigner
              address={msigAddress}
              balance={msigBalance}
              close={close}
            />
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
      const msigAddress = 't034066'
      const msigBalance = new FilecoinNumber('1', 'fil')

      const toAddr = 't0100'
      await act(async () => {
        render(
          <Tree>
            <AddSigner
              address={msigAddress}
              balance={msigBalance}
              close={close}
            />
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
        const msigAddress = 't034066'
        const msigBalance = new FilecoinNumber('1', 'fil')

        let res
        await act(async () => {
          res = render(
            <Tree>
              <AddSigner
                address={msigAddress}
                balance={msigBalance}
                close={close}
              />
            </Tree>
          )
        })
        expect(res.container).toMatchSnapshot()
        expect(screen.getByText(/Warning/)).toBeInTheDocument()
      })

      test('it renders step 2 correctly', async () => {
        const { Tree } = composeMockAppTree('postOnboard')
        const msigAddress = 't034066'
        const msigBalance = new FilecoinNumber('1', 'fil')

        let res
        await act(async () => {
          res = render(
            <Tree>
              <AddSigner
                address={msigAddress}
                balance={msigBalance}
                close={close}
              />
            </Tree>
          )
          fireEvent.click(screen.getByText('Next'))
          await flushPromises()
        })
        expect(res.container).toMatchSnapshot()
        expect(
          screen.getByText(
            /Please enter the Filecoin address of the new signer/
          )
        ).toBeInTheDocument()
      })

      test('it renders step 3 correctly', async () => {
        const { Tree } = composeMockAppTree('postOnboard')
        const msigAddress = 't034066'
        const msigBalance = new FilecoinNumber('1', 'fil')
        const toAddr = 't0100'

        let res
        await act(async () => {
          res = render(
            <Tree>
              <AddSigner
                address={msigAddress}
                balance={msigBalance}
                close={close}
              />
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
      const msigAddress = 't034066'
      const msigBalance = new FilecoinNumber('1', 'fil')

      const toAddrId = 't0100'
      const toAddrAccount = 'f1gdiug3uoxk6pwh75fqaygnxc4pmfca464zuh4hi'
      const { selectedWalletIdx, wallets } = store.getState()

      const signers = [
        { account: wallets[selectedWalletIdx].address, id: 't0101' },
        { account: toAddrAccount, id: toAddrId }
      ]

      await act(async () => {
        render(
          <Tree>
            <RemoveSigner
              address={msigAddress}
              balance={msigBalance}
              signers={signers}
              close={close}
            />
          </Tree>
        )
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
        fireEvent.click(screen.getByText(/t0100/))
        await flushPromises()
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
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
      expect(message.to).toBe(msigAddress)

      expect(store.getState().messages.pending.length).toBe(1)
    })

    test('it allows the user to see the max transaction fee', async () => {
      const { Tree, store } = composeMockAppTree('postOnboard')
      const msigAddress = 't034066'
      const msigBalance = new FilecoinNumber('1', 'fil')

      const toAddrId = 't0100'
      const toAddrAccount = 'f1gdiug3uoxk6pwh75fqaygnxc4pmfca464zuh4hi'
      const { selectedWalletIdx, wallets } = store.getState()

      const signers = [
        { account: wallets[selectedWalletIdx].address, id: 't0101' },
        { account: toAddrAccount, id: toAddrId }
      ]

      await act(async () => {
        render(
          <Tree>
            <RemoveSigner
              address={msigAddress}
              balance={msigBalance}
              signers={signers}
              close={close}
            />
          </Tree>
        )
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
        fireEvent.click(screen.getByText(/t0100/))
        await flushPromises()
        fireEvent.click(screen.getByText('Next'))
      })
      expect(screen.getByText(/Transaction fee/)).toBeInTheDocument()
    })

    test('it allows the user to set the max transaction fee', async () => {
      const { Tree, store } = composeMockAppTree('postOnboard')
      const msigAddress = 't034066'
      const msigBalance = new FilecoinNumber('1', 'fil')

      const toAddrId = 't0100'
      const toAddrAccount = 'f1gdiug3uoxk6pwh75fqaygnxc4pmfca464zuh4hi'
      const { selectedWalletIdx, wallets } = store.getState()

      const signers = [
        { account: wallets[selectedWalletIdx].address, id: 't0101' },
        { account: toAddrAccount, id: toAddrId }
      ]

      await act(async () => {
        render(
          <Tree>
            <RemoveSigner
              address={msigAddress}
              balance={msigBalance}
              signers={signers}
              close={close}
            />
          </Tree>
        )
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
        fireEvent.click(screen.getByText(/t0100/))
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
      const msigAddress = 't034066'
      const msigBalance = new FilecoinNumber('1', 'fil')

      const toAddrId = 't0100'
      const toAddrAccount = 'f1gdiug3uoxk6pwh75fqaygnxc4pmfca464zuh4hi'
      const { selectedWalletIdx, wallets } = store.getState()

      const signers = [
        { account: wallets[selectedWalletIdx].address, id: 't0101' },
        { account: toAddrAccount, id: toAddrId }
      ]

      await act(async () => {
        render(
          <Tree>
            <RemoveSigner
              address={msigAddress}
              balance={msigBalance}
              signers={signers}
              close={close}
            />
          </Tree>
        )
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
        fireEvent.click(screen.getByText(/t0100/))
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
        const msigAddress = 't034066'
        const msigBalance = new FilecoinNumber('1', 'fil')

        const toAddrId = 't0100'
        const toAddrAccount = 'f1gdiug3uoxk6pwh75fqaygnxc4pmfca464zuh4hi'
        const { selectedWalletIdx, wallets } = store.getState()

        const signers = [
          { account: wallets[selectedWalletIdx].address, id: 't0101' },
          { account: toAddrAccount, id: toAddrId }
        ]
        let res

        await act(async () => {
          res = render(
            <Tree>
              <RemoveSigner
                address={msigAddress}
                balance={msigBalance}
                signers={signers}
                close={close}
              />
            </Tree>
          )
        })
        expect(res.container).toMatchSnapshot()
        expect(screen.getByText(/Warning/)).toBeInTheDocument()
      })

      test('it renders step 2 correctly', async () => {
        const { Tree, store } = composeMockAppTree('postOnboard')
        const msigAddress = 't034066'
        const msigBalance = new FilecoinNumber('1', 'fil')

        const toAddrId = 't0100'
        const toAddrAccount = 'f1gdiug3uoxk6pwh75fqaygnxc4pmfca464zuh4hi'
        const { selectedWalletIdx, wallets } = store.getState()

        const signers = [
          { account: wallets[selectedWalletIdx].address, id: 't0101' },
          { account: toAddrAccount, id: toAddrId }
        ]
        let res

        await act(async () => {
          res = render(
            <Tree>
              <RemoveSigner
                address={msigAddress}
                balance={msigBalance}
                signers={signers}
                close={close}
              />
            </Tree>
          )
          fireEvent.click(screen.getByText('Next'))
          await flushPromises()
        })
        expect(res.container).toMatchSnapshot()
        expect(
          screen.getByText(
            /Please select the Filecoin address you want to remove from your multisig wallet/
          )
        ).toBeInTheDocument()
      })

      test('it renders step 3 correctly', async () => {
        const { Tree, store } = composeMockAppTree('postOnboard')
        const msigAddress = 't034066'
        const msigBalance = new FilecoinNumber('1', 'fil')

        const toAddrId = 't0100'
        const toAddrAccount = 'f1gdiug3uoxk6pwh75fqaygnxc4pmfca464zuh4hi'
        const { selectedWalletIdx, wallets } = store.getState()

        const signers = [
          { account: wallets[selectedWalletIdx].address, id: 't0101' },
          { account: toAddrAccount, id: toAddrId }
        ]
        let res

        await act(async () => {
          res = render(
            <Tree>
              <RemoveSigner
                address={msigAddress}
                balance={msigBalance}
                signers={signers}
                close={close}
              />
            </Tree>
          )
          fireEvent.click(screen.getByText('Next'))
          await flushPromises()
          fireEvent.click(screen.getByText(/t0100/))
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
})
