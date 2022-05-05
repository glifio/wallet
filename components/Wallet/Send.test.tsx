import {
  cleanup,
  render,
  act,
  waitFor,
  fireEvent,
  getByText,
  getByRole,
  getAllByRole,
  RenderResult
} from '@testing-library/react'
import { FilecoinNumber, BigNumber } from '@glif/filecoin-number'
import { Message } from '@glif/filecoin-message'

import composeMockAppTree from '../../test-utils/composeMockAppTree'
import { flushPromises, WALLET_ADDRESS } from '../../test-utils'
import { Send } from './Send'

const validAddress = 't1iuryu3ke2hewrcxp4ezhmr5cmfeq3wjhpxaucza'
const validAmount = new FilecoinNumber(0.01, 'fil')

jest.mock('@glif/filecoin-wallet-provider')

describe('Send', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllTimers()
    cleanup()
  })

  test('it allows a user to send a message', async () => {
    const { Tree, walletProvider } = composeMockAppTree('postOnboard')
    let result: RenderResult | null = null

    await act(async () => {
      result = render(
        <Tree>
          <Send />
        </Tree>
      )

      // Get HTML elements
      const header = getByRole(result.container, 'heading')
      const [recipient, params] = getAllByRole(result.container, 'textbox')
      const [amount, txFee] = getAllByRole(result.container, 'spinbutton')
      const cancel = getByText(result.container, 'Cancel')
      const send = getByText(result.container, 'Send')

      // Check initial state
      expect(header).toHaveTextContent('Send Filecoin')
      expect(recipient).toHaveFocus()
      expect(recipient).toHaveDisplayValue('')
      expect(params).toHaveDisplayValue('')
      expect(amount).toHaveDisplayValue('')
      expect(txFee).toHaveDisplayValue('')
      expect(txFee).toBeDisabled()
      expect(cancel).toBeEnabled()
      expect(send).toBeDisabled()

      // Enter recipient
      fireEvent.change(recipient, { target: { value: validAddress } })
      recipient.blur()

      // Check state
      await flushPromises()
      expect(send).toBeDisabled()

      // Enter amount
      amount.focus()
      fireEvent.change(amount, { target: { value: validAmount.toFil() } })
      amount.blur()
      
      // Check state
      await flushPromises()
      await waitFor(() => expect(send).toBeEnabled(), { timeout: 1000 });

      const maxFeeRegex =
        /You will not pay more than [0-9.]+ FIL for this transaction/i
      expect(getByText(result.container, maxFeeRegex)).toBeInTheDocument()
      expect(getByText(result.container, 'Total')).toBeInTheDocument()
      expect(txFee).not.toHaveDisplayValue('')
      expect(txFee).toBeEnabled()

      // Click send
      fireEvent.click(send)
      await flushPromises()
    })

    // Check wallet provider calls
    expect(walletProvider.getNonce).toHaveBeenCalled()
    expect(walletProvider.wallet.sign).toHaveBeenCalled()
    expect(walletProvider.simulateMessage).toHaveBeenCalled()
    expect(walletProvider.sendMessage).toHaveBeenCalled()

    // Check message
    const lotusMessage = walletProvider.wallet.sign.mock.calls[0][1]
    const message = Message.fromLotusType(lotusMessage)
    expect(message.from).toBe(WALLET_ADDRESS)
    expect(message.to).toBe(validAddress)
    expect(typeof message.nonce).toBe('number')
    expect(message.nonce).toBeGreaterThanOrEqual(0)
    expect(message.value instanceof BigNumber).toBe(true)
    expect(message.value.isEqualTo(validAmount.toAttoFil())).toBe(true)
    expect(typeof message.method).toBe('number')
    expect(message.method).toBe(0)
    expect(typeof message.params).toBe('string')
    expect(message.params).toBe('')
    expect(message.gasPremium instanceof BigNumber).toBe(true)
    expect(message.gasPremium.isGreaterThan(0)).toBe(true)
    expect(message.gasFeeCap instanceof BigNumber).toBe(true)
    expect(message.gasFeeCap.isGreaterThan(0)).toBe(true)
    expect(typeof message.gasLimit).toBe('number')
    expect(message.gasLimit).toBeGreaterThan(0)
  })
})
