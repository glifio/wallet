import { cleanup, render, screen, act, fireEvent } from '@testing-library/react'
import { FilecoinNumber } from '@openworklabs/filecoin-number'

import Send from '.'
import composeMockAppTree from '../../../test-utils/composeMockAppTree'
import { flushPromises } from '../../../test-utils'

jest.mock('@openworklabs/filecoin-wallet-provider')

describe('Send Flow', () => {
  let close = () => {}
  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
    close = jest.fn()
  })

  describe('Sending a message', () => {
    afterEach(() => {
      jest.clearAllTimers()
      cleanup()
    })

    test('it allows a user to send a message', async () => {
      const { Tree, store, walletProvider } = composeMockAppTree('postOnboard')
      const address = 't1z225tguggx4onbauimqvxzutopzdr2m4s6z6wgi'
      const filAmount = new FilecoinNumber('.01', 'fil')
      await act(async () => {
        render(
          <Tree>
            <Send close={close} />
          </Tree>
        )
        fireEvent.change(screen.getByPlaceholderText(/t1.../), {
          target: { value: address }
        })
        fireEvent.change(screen.getAllByPlaceholderText('0')[0], {
          target: { value: filAmount }
        })
        await flushPromises()
        fireEvent.blur(screen.getAllByPlaceholderText('0')[0])
        await flushPromises()
        fireEvent.click(screen.getByText('Send'))
        await flushPromises()
        fireEvent.click(screen.getByText('Confirm'))
        await flushPromises()
      })
      expect(walletProvider.getNonce).toHaveBeenCalledWith(address)
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
      expect(message.to).toBe(address)

      expect(store.getState().messages.pending.length).toBe(1)
    })

    test('it does not allow a user to send a message if address is poorly formed', async () => {
      const { Tree, store, walletProvider } = composeMockAppTree('postOnboard')
      const badAddress = 't1z225tguggx4onbauimqvxz'
      const filAmount = new FilecoinNumber('.01', 'fil')
      await act(async () => {
        render(
          <Tree>
            <Send close={close} />
          </Tree>
        )
        fireEvent.change(screen.getByPlaceholderText(/t1.../), {
          target: { value: badAddress }
        })
        fireEvent.change(screen.getAllByPlaceholderText('0')[0], {
          target: { value: filAmount }
        })
        await flushPromises()
        fireEvent.blur(screen.getAllByPlaceholderText('0')[0])
        await flushPromises()
        fireEvent.click(screen.getByText('Send'))
        await flushPromises()
      })
      expect(screen.getByText(/Invalid address/)).toBeInTheDocument()
      expect(walletProvider.getNonce).not.toHaveBeenCalled()
      expect(walletProvider.wallet.sign).not.toHaveBeenCalled()
      expect(store.getState().messages.pending.length).toBe(0)
    })

    test('it does not allow a user to send a message if address is left blank', async () => {
      const { Tree, store, walletProvider } = composeMockAppTree('postOnboard')
      const filAmount = new FilecoinNumber('.01', 'fil')
      await act(async () => {
        render(
          <Tree>
            <Send close={close} />
          </Tree>
        )
        fireEvent.change(screen.getAllByPlaceholderText('0')[0], {
          target: { value: filAmount }
        })
        await flushPromises()
        fireEvent.blur(screen.getAllByPlaceholderText('0')[0])
        await flushPromises()
        fireEvent.click(screen.getByText('Send'))
        await flushPromises()
      })
      expect(screen.getByText(/Invalid address/)).toBeInTheDocument()
      expect(walletProvider.getNonce).not.toHaveBeenCalled()
      expect(walletProvider.wallet.sign).not.toHaveBeenCalled()
      expect(store.getState().messages.pending.length).toBe(0)
    })

    test('it does not allow a user to send a message if balance is less than total amount intended to send', async () => {
      const { Tree, store, walletProvider } = composeMockAppTree('postOnboard')
      const filAmount = new FilecoinNumber(
        '.999999999999999999999999999999',
        'fil'
      )
      const address = 't1z225tguggx4onbauimqvxzutopzdr2m4s6z6wgi'

      await act(async () => {
        render(
          <Tree>
            <Send close={close} />
          </Tree>
        )

        fireEvent.change(screen.getByPlaceholderText(/t1.../), {
          target: { value: address }
        })
        fireEvent.change(screen.getAllByPlaceholderText('0')[0], {
          target: { value: filAmount }
        })
        await flushPromises()
        fireEvent.blur(screen.getAllByPlaceholderText('0')[0])
        await flushPromises()
        fireEvent.click(screen.getByText('Send'))
        await flushPromises()
      })
      // expect(
      //   screen.getByText(/Please enter a valid amount/)
      // ).toBeInTheDocument()
      expect(walletProvider.getNonce).not.toHaveBeenCalled()
      expect(walletProvider.wallet.sign).not.toHaveBeenCalled()
      expect(store.getState().messages.pending.length).toBe(0)
    })

    test('it does not allow a user to send a message if value intended to send is 0', async () => {
      const { Tree, store, walletProvider } = composeMockAppTree('postOnboard')
      const filAmount = new FilecoinNumber('0', 'fil')
      const address = 't1z225tguggx4onbauimqvxzutopzdr2m4s6z6wgi'

      await act(async () => {
        render(
          <Tree>
            <Send close={close} />
          </Tree>
        )
        fireEvent.change(screen.getByPlaceholderText(/t1.../), {
          target: { value: address }
        })
        fireEvent.change(screen.getAllByPlaceholderText('0')[0], {
          target: { value: filAmount }
        })
        await flushPromises()
        fireEvent.blur(screen.getAllByPlaceholderText('0')[0])
        await flushPromises()
        fireEvent.click(screen.getByText('Send'))
        await flushPromises()
      })
      expect(
        screen.getByText(/Please enter a valid amount/)
      ).toBeInTheDocument()
      expect(walletProvider.getNonce).not.toHaveBeenCalled()
      expect(walletProvider.wallet.sign).not.toHaveBeenCalled()
      expect(store.getState().messages.pending.length).toBe(0)
    })

    test.skip('it allows the user to adjust the gas price', async () => {
      const { Tree, store, walletProvider } = composeMockAppTree('postOnboard')
      const address = 't1z225tguggx4onbauimqvxzutopzdr2m4s6z6wgi'
      const filAmount = new FilecoinNumber('.5', 'fil')
      await act(async () => {
        render(
          <Tree>
            <Send close={close} />
          </Tree>
        )

        fireEvent.change(screen.getByPlaceholderText(/t1.../), {
          target: {
            value: address
          }
        })
        fireEvent.change(screen.getAllByPlaceholderText('0')[0], {
          target: {
            value: filAmount
          }
        })
        await flushPromises()
        fireEvent.blur(screen.getAllByPlaceholderText('0')[0])
        await flushPromises()

        fireEvent.click(screen.getByText('Customize'))

        fireEvent.change(screen.getByDisplayValue('1'), {
          target: {
            value: 2
          }
        })
        await flushPromises()

        fireEvent.click(screen.getByText('Send'))
        await flushPromises()

        fireEvent.click(screen.getByText('Confirm'))
        await flushPromises()
      })
      await flushPromises()

      expect(walletProvider.getNonce).toHaveBeenCalled()
      const message = walletProvider.wallet.sign.mock.calls[0][0].toLotusType()
      expect(message.GasPrice.toString()).toBe('2')
      expect(store.getState().messages.pending.length).toBe(1)
    })

    test.skip('it allows the user to adjust the gas limit', async () => {
      const { Tree, store, walletProvider } = composeMockAppTree('postOnboard')
      const address = 't1z225tguggx4onbauimqvxzutopzdr2m4s6z6wgi'
      const filAmount = new FilecoinNumber('.5', 'fil')
      await act(async () => {
        render(
          <Tree>
            <Send close={close} />
          </Tree>
        )

        fireEvent.change(screen.getByPlaceholderText(/t1.../), {
          target: {
            value: address
          }
        })
        fireEvent.change(screen.getAllByPlaceholderText('0')[0], {
          target: {
            value: filAmount
          }
        })
        await flushPromises()
        fireEvent.blur(screen.getAllByPlaceholderText('0')[0])
        await flushPromises()

        fireEvent.click(screen.getByText('Customize'))

        fireEvent.change(screen.getByDisplayValue('1000'), {
          target: {
            value: 2000
          }
        })
        await flushPromises()

        fireEvent.click(screen.getByText('Send'))
        await flushPromises()

        fireEvent.click(screen.getByText('Confirm'))
        await flushPromises()
      })
      expect(walletProvider.getNonce).toHaveBeenCalled()
      const message = walletProvider.wallet.sign.mock.calls[0][0].toLotusType()
      expect(message.GasLimit).toBe(2000)
      expect(store.getState().messages.pending.length).toBe(1)
    })

    test.skip('it re-estimates the gas used after adjusting the gas price', async () => {
      const { Tree, walletProvider } = composeMockAppTree('postOnboard')
      await act(async () => {
        render(
          <Tree>
            <Send close={close} />
          </Tree>
        )
        await flushPromises()
        expect(walletProvider.estimateGas).toHaveBeenCalledTimes(1)

        fireEvent.click(screen.getByText('Customize'))

        fireEvent.change(screen.getByDisplayValue('1'), {
          target: {
            value: 2
          }
        })
        jest.runOnlyPendingTimers()
      })
      await flushPromises()
      expect(walletProvider.estimateGas).toHaveBeenCalledTimes(2)
    })

    test('it sends the user to the message history after message successfully sent', async () => {
      const { Tree } = composeMockAppTree('postOnboard')
      const address = 't1z225tguggx4onbauimqvxzutopzdr2m4s6z6wgi'
      const filAmount = new FilecoinNumber('.01', 'fil')
      await act(async () => {
        render(
          <Tree>
            <Send close={close} />
          </Tree>
        )
        fireEvent.change(screen.getByPlaceholderText(/t1.../), {
          target: { value: address }
        })
        fireEvent.change(screen.getAllByPlaceholderText('0')[0], {
          target: { value: filAmount }
        })
        await flushPromises()
        fireEvent.blur(screen.getAllByPlaceholderText('0')[0])
        await flushPromises()
        fireEvent.click(screen.getByText('Send'))
        await flushPromises()
        fireEvent.click(screen.getByText('Confirm'))
        await flushPromises()
      })
      await flushPromises()
      expect()
    })
  })

  describe('snapshots', () => {
    test('it renders correctly', async () => {
      const { Tree } = composeMockAppTree('postOnboard')
      let res
      await act(async () => {
        res = render(
          <Tree>
            <Send close={close} />
          </Tree>
        )
      })
      expect(res.container.firstChild).toMatchSnapshot()
    })
    test('it renders invalid address errors correctly', async () => {
      const { Tree } = composeMockAppTree('postOnboard')
      const badAddress = 't1z225tguggx4onbauimqvxz'
      const filAmount = new FilecoinNumber('.01', 'fil')
      let res
      await act(async () => {
        res = render(
          <Tree>
            <Send close={close} />
          </Tree>
        )
        fireEvent.change(screen.getByPlaceholderText(/t1.../), {
          target: { value: badAddress }
        })
        fireEvent.change(screen.getAllByPlaceholderText('0')[0], {
          target: { value: filAmount }
        })
        await flushPromises()
        fireEvent.blur(screen.getAllByPlaceholderText('0')[0])
        await flushPromises()
        fireEvent.click(screen.getByText('Send'))
        await flushPromises()
      })
      expect(res.container.firstChild).toMatchSnapshot()
    })

    test('it renders invalid value errors correctly', async () => {
      const { Tree } = composeMockAppTree('postOnboard')
      const filAmount = new FilecoinNumber('.01', 'fil')
      let res
      await act(async () => {
        res = render(
          <Tree>
            <Send close={close} />
          </Tree>
        )
        fireEvent.change(screen.getAllByPlaceholderText('0')[0], {
          target: { value: filAmount }
        })
        await flushPromises()
        fireEvent.blur(screen.getAllByPlaceholderText('0')[0])
        await flushPromises()
        fireEvent.click(screen.getByText('Send'))
        await flushPromises()
      })
      expect(res.container.firstChild).toMatchSnapshot()
    })

    test.skip('it renders the gas customization view', async () => {
      const { Tree } = composeMockAppTree('postOnboard')
      let res
      await act(async () => {
        res = render(
          <Tree>
            <Send close={close} />
          </Tree>
        )
        fireEvent.click(screen.getByText('Customize'))
        await flushPromises()

        fireEvent.change(screen.getByDisplayValue('1000'), {
          target: {
            value: 2000
          }
        })
        await flushPromises()
      })
      expect(res.container.firstChild).toMatchSnapshot()
    })
  })
})
