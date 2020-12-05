import { cleanup, render, screen, act, fireEvent } from '@testing-library/react'
import { FilecoinNumber } from '@glif/filecoin-number'

import Withdraw from '.'
import composeMockAppTree from '../../../test-utils/composeMockAppTree'
import { flushPromises } from '../../../test-utils'

jest.mock('@glif/filecoin-wallet-provider')

describe('Multisig withdraw flow', () => {
  let close = () => {}
  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
    close = jest.fn()
  })

  describe('Withdrawing FIL', () => {
    afterEach(() => {
      jest.clearAllTimers()
      cleanup()
    })

    test('it allows a user to withdraw filecoin', async () => {
      const { Tree, store, walletProvider } = composeMockAppTree('postOnboard')
      const msigAddress = 't034066'
      const msigBalance = new FilecoinNumber('1', 'fil')

      const toAddr = 't0100'
      const filAmount = new FilecoinNumber('1', 'fil')

      await act(async () => {
        render(
          <Tree>
            <Withdraw
              address={msigAddress}
              balance={msigBalance}
              close={close}
            />
          </Tree>
        )
        fireEvent.change(screen.getByPlaceholderText(/f1.../), {
          target: { value: toAddr },
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

    test('it does not allow a user to withdraw FIL if address is poorly formed', async () => {
      const { Tree, store, walletProvider } = composeMockAppTree('postOnboard')
      const msigAddress = 't034066'
      const msigBalance = new FilecoinNumber('1', 'fil')

      const toAddr = 't5100'

      await act(async () => {
        render(
          <Tree>
            <Withdraw
              address={msigAddress}
              balance={msigBalance}
              close={close}
            />
          </Tree>
        )
        fireEvent.change(screen.getByPlaceholderText(/f1.../), {
          target: { value: toAddr },
          preventDefault: () => {}
        })
        await flushPromises()
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
      })
      expect(screen.getByText(/Invalid to address/)).toBeInTheDocument()
      expect(walletProvider.getNonce).not.toHaveBeenCalled()
      expect(walletProvider.wallet.sign).not.toHaveBeenCalled()
      expect(store.getState().messages.pending.length).toBe(0)
    })

    test('it does not allow a user to proceed if address is left blank', async () => {
      const { Tree, store, walletProvider } = composeMockAppTree('postOnboard')
      const msigAddress = 't034066'
      const msigBalance = new FilecoinNumber('1', 'fil')

      await act(async () => {
        render(
          <Tree>
            <Withdraw
              address={msigAddress}
              balance={msigBalance}
              close={close}
            />
          </Tree>
        )
        fireEvent.change(screen.getByPlaceholderText(/f1.../), {
          target: { value: '' },
          preventDefault: () => {}
        })
        await flushPromises()
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
      })
      expect(screen.getByText(/Step 1/)).toBeInTheDocument()
      expect(walletProvider.getNonce).not.toHaveBeenCalled()
      expect(walletProvider.wallet.sign).not.toHaveBeenCalled()
      expect(store.getState().messages.pending.length).toBe(0)
    })

    test('it does not allow a user to send a message if balance is less than total amount intended to send', async () => {
      const { Tree, store, walletProvider } = composeMockAppTree('postOnboard')
      const msigAddress = 't034066'
      const msigBalance = new FilecoinNumber('1', 'fil')

      const toAddr = 't0100'
      const filAmount = new FilecoinNumber('2', 'fil')
      await act(async () => {
        render(
          <Tree>
            <Withdraw
              address={msigAddress}
              balance={msigBalance}
              close={close}
            />
          </Tree>
        )

        fireEvent.change(screen.getByPlaceholderText(/f1.../), {
          target: { value: toAddr },
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
      })
      expect(
        screen.getByText(
          /The amount must be smaller than this account's balance/
        )
      ).toBeInTheDocument()
      expect(walletProvider.getNonce).not.toHaveBeenCalled()
      expect(walletProvider.wallet.sign).not.toHaveBeenCalled()
      expect(store.getState().messages.pending.length).toBe(0)
    })

    test('it does not allow a user to send a message if value intended to send is 0', async () => {
      const { Tree, store, walletProvider } = composeMockAppTree('postOnboard')
      const msigAddress = 't034066'
      const msigBalance = new FilecoinNumber('1', 'fil')

      const toAddr = 't0100'
      const filAmount = new FilecoinNumber('0', 'fil')
      await act(async () => {
        render(
          <Tree>
            <Withdraw
              address={msigAddress}
              balance={msigBalance}
              close={close}
            />
          </Tree>
        )
        fireEvent.change(screen.getByPlaceholderText(/f1.../), {
          target: { value: toAddr },
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
      })
      expect(
        screen.getByText(/Please enter a valid amount/)
      ).toBeInTheDocument()
      expect(walletProvider.getNonce).not.toHaveBeenCalled()
      expect(walletProvider.wallet.sign).not.toHaveBeenCalled()
      expect(store.getState().messages.pending.length).toBe(0)
    })

    test('it allows the user to see the max transaction fee', async () => {
      const { Tree } = composeMockAppTree('postOnboard')
      const msigAddress = 't034066'
      const msigBalance = new FilecoinNumber('1', 'fil')

      const toAddr = 't0100'
      const filAmount = new FilecoinNumber('.5', 'fil')
      await act(async () => {
        render(
          <Tree>
            <Withdraw
              address={msigAddress}
              balance={msigBalance}
              close={close}
            />
          </Tree>
        )
        fireEvent.change(screen.getByPlaceholderText(/f1.../), {
          target: { value: toAddr },
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
      })
      expect(screen.getByText(/Transaction fee/)).toBeInTheDocument()
    })

    test('it allows the user to set the max transaction fee', async () => {
      const { Tree } = composeMockAppTree('postOnboard')
      const msigAddress = 't034066'
      const msigBalance = new FilecoinNumber('1', 'fil')

      const toAddr = 't0100'
      const filAmount = new FilecoinNumber('.5', 'fil')
      await act(async () => {
        render(
          <Tree>
            <Withdraw
              address={msigAddress}
              balance={msigBalance}
              close={close}
            />
          </Tree>
        )
        fireEvent.change(screen.getByPlaceholderText(/f1.../), {
          target: { value: toAddr },
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
      const filAmount = new FilecoinNumber('.5', 'fil')
      await act(async () => {
        render(
          <Tree>
            <Withdraw
              address={msigAddress}
              balance={msigBalance}
              close={close}
            />
          </Tree>
        )
        fireEvent.change(screen.getByPlaceholderText(/f1.../), {
          target: { value: toAddr },
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

    test('it restricts a user from continuing if the tx fee > balance', async () => {
      const { Tree } = composeMockAppTree('postOnboardLowBal')
      const msigAddress = 't034066'
      const msigBalance = new FilecoinNumber('1', 'fil')

      const toAddr = 't0100'
      const filAmount = new FilecoinNumber('.99999999999999999999999', 'fil')
      let res
      await act(async () => {
        res = render(
          <Tree>
            <Withdraw
              address={msigAddress}
              balance={msigBalance}
              close={close}
            />
          </Tree>
        )
        fireEvent.change(screen.getByPlaceholderText(/f1.../), {
          target: { value: toAddr },
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
        fireEvent.change(screen.getByDisplayValue('1000000'), {
          target: { value: '20000000000000000000000' }
        })
        await flushPromises()
        fireEvent.click(screen.getByText('Save'))
        await flushPromises()
      })
      expect(screen.getByText(/Transaction fee/)).toBeInTheDocument()
      expect(
        screen.getByText(/does not have sufficient funds/)
      ).toBeInTheDocument()
      expect(screen.getByText('Next')).toBeDisabled()
      expect(res.container).toMatchSnapshot()
    })

    test('it restricts a user from continuing if the tx fee entered is invalid', async () => {
      const { Tree } = composeMockAppTree('postOnboard')
      const msigAddress = 't034066'
      const msigBalance = new FilecoinNumber('1', 'fil')

      const toAddr = 't0100'
      const filAmount = new FilecoinNumber('.5', 'fil')
      let res
      await act(async () => {
        res = render(
          <Tree>
            <Withdraw
              address={msigAddress}
              balance={msigBalance}
              close={close}
            />
          </Tree>
        )
        fireEvent.change(screen.getByPlaceholderText(/f1.../), {
          target: { value: toAddr },
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
        fireEvent.change(screen.getByDisplayValue('1000000'), {
          target: { value: '' }
        })
        await flushPromises()
        fireEvent.click(screen.getByText('Save'))
        await flushPromises()
      })
      expect(screen.getByText(/Transaction fee/)).toBeInTheDocument()
      expect(screen.getByText(/Invalid/)).toBeInTheDocument()
      expect(screen.getByText('Next')).toBeDisabled()
      expect(res.container).toMatchSnapshot()
    })

    test('it sends the user to the message history after message successfully sent', async () => {
      const { Tree } = composeMockAppTree('postOnboard')
      const msigAddress = 't034066'
      const msigBalance = new FilecoinNumber('1', 'fil')

      const toAddr = 't0100'
      const filAmount = new FilecoinNumber('.5', 'fil')
      await act(async () => {
        render(
          <Tree>
            <Withdraw
              address={msigAddress}
              balance={msigBalance}
              close={close}
            />
          </Tree>
        )
        fireEvent.change(screen.getByPlaceholderText(/f1.../), {
          target: { value: toAddr },
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
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
      })
      await flushPromises()
      expect(close).toHaveBeenCalled()
    })
  })

  describe('snapshots', () => {
    afterEach(cleanup)
    test('it renders correctly', async () => {
      const { Tree } = composeMockAppTree('postOnboard')
      const msigAddress = 't034066'
      const msigBalance = new FilecoinNumber('1', 'fil')

      let res
      await act(async () => {
        res = render(
          <Tree>
            <Withdraw
              address={msigAddress}
              balance={msigBalance}
              close={close}
            />
          </Tree>
        )
      })
      expect(res.container).toMatchSnapshot()
      expect(screen.getByText(/Withdrawing Filecoin/)).toBeInTheDocument()
      expect(screen.getByText(/Recipient/)).toBeInTheDocument()
      expect(screen.getByText(/Step 1/)).toBeInTheDocument()
    })

    test('it renders step 2 correctly', async () => {
      const { Tree } = composeMockAppTree('postOnboard')
      const msigAddress = 't034066'
      const msigBalance = new FilecoinNumber('1', 'fil')
      const toAddr = 't0100'

      let res
      await act(async () => {
        res = render(
          <Tree>
            <Withdraw
              address={msigAddress}
              balance={msigBalance}
              close={close}
            />
          </Tree>
        )
        fireEvent.change(screen.getByPlaceholderText(/f1.../), {
          target: { value: toAddr },
          preventDefault: () => {}
        })
        await flushPromises()
        fireEvent.click(screen.getByText('Next'))
      })
      expect(res.container).toMatchSnapshot()
      expect(screen.getByText(/Withdrawing Filecoin/)).toBeInTheDocument()
      expect(screen.getByText(/Amount/)).toBeInTheDocument()
      expect(screen.getByText(/Step 2/)).toBeInTheDocument()
    })

    test('it renders step 3 correctly', async () => {
      const { Tree } = composeMockAppTree('postOnboard')
      const msigAddress = 't034066'
      const msigBalance = new FilecoinNumber('1', 'fil')
      const toAddr = 't0100'
      const filAmount = new FilecoinNumber('.5', 'fil')

      let res
      await act(async () => {
        res = render(
          <Tree>
            <Withdraw
              address={msigAddress}
              balance={msigBalance}
              close={close}
            />
          </Tree>
        )
        fireEvent.change(screen.getByPlaceholderText(/f1.../), {
          target: { value: toAddr },
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
      })
      expect(res.container).toMatchSnapshot()
      expect(screen.getByText(/Withdrawing Filecoin/)).toBeInTheDocument()
      expect(screen.getByText(/Transaction fee/)).toBeInTheDocument()
      expect(screen.getByText(/Step 3/)).toBeInTheDocument()
    })

    test('it renders step 4 correctly', async () => {
      const { Tree } = composeMockAppTree('postOnboard')
      const msigAddress = 't034066'
      const msigBalance = new FilecoinNumber('1', 'fil')
      const toAddr = 't0100'
      const filAmount = new FilecoinNumber('.5', 'fil')

      let res
      await act(async () => {
        res = render(
          <Tree>
            <Withdraw
              address={msigAddress}
              balance={msigBalance}
              close={close}
            />
          </Tree>
        )
        fireEvent.change(screen.getByPlaceholderText(/f1.../), {
          target: { value: toAddr },
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
        fireEvent.click(screen.getByText('Next'))
        await flushPromises()
      })
      expect(res.container).toMatchSnapshot()
      expect(screen.getByText(/Withdrawing Filecoin/)).toBeInTheDocument()
      expect(screen.getByText(/Total/)).toBeInTheDocument()
      expect(screen.getByText(/Step 4/)).toBeInTheDocument()
    })
  })
})
