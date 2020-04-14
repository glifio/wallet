import { cleanup, render, screen, act, fireEvent } from '@testing-library/react'
import { FilecoinNumber } from '@openworklabs/filecoin-number'

import Funds from './Funds'
import composeMockAppTree from '../../../test-utils/composeMockAppTree'
import { flushPromises } from '../../../test-utils'

describe('Funds input', () => {
  afterEach(cleanup)
  let setError = jest.fn()
  let onAmountChange = jest.fn()
  beforeEach(() => {
    jest.clearAllMocks()
    setError = jest.fn()
    onAmountChange = jest.fn()
  })
  test('it renders correctly', async () => {
    const { Tree } = composeMockAppTree('postOnboard')
    const value = new FilecoinNumber('1', 'fil')
    const balance = new FilecoinNumber('2', 'fil')
    const gasLimit = new FilecoinNumber('1000', 'attofil')
    await act(async () => {
      const { container } = render(
        <Tree>
          <Funds
            name='amount'
            label='Amount'
            amount={value.toAttoFil()}
            onAmountChange={onAmountChange}
            balance={balance}
            setError={setError}
            gasLimit={gasLimit}
            valid
          />
        </Tree>
      )

      expect(container.firstChild).toMatchSnapshot()
    })
  })

  test('it renders invalid state correctly', async () => {
    const { Tree } = composeMockAppTree('postOnboard')
    const value = new FilecoinNumber('1', 'fil')
    const balance = new FilecoinNumber('2', 'fil')
    const gasLimit = new FilecoinNumber('1000', 'attofil')
    await act(async () => {
      const { container } = render(
        <Tree>
          <Funds
            name='amount'
            label='Amount'
            amount={value.toAttoFil()}
            onAmountChange={onAmountChange}
            balance={balance}
            setError={setError}
            gasLimit={gasLimit}
            valid={false}
          />
        </Tree>
      )

      expect(container.firstChild).toMatchSnapshot()
    })
  })

  test('it renders disabled state correctly', async () => {
    const { Tree } = composeMockAppTree('postOnboard')
    const value = new FilecoinNumber('1', 'fil')
    const balance = new FilecoinNumber('2', 'fil')
    const gasLimit = new FilecoinNumber('1000', 'attofil')
    await act(async () => {
      const { container } = render(
        <Tree>
          <Funds
            name='amount'
            label='Amount'
            amount={value.toAttoFil()}
            onAmountChange={onAmountChange}
            balance={balance}
            setError={setError}
            gasLimit={gasLimit}
            disabled
          />
        </Tree>
      )

      expect(container.firstChild).toMatchSnapshot()
    })
  })

  test('it renders disabled and valid state correctly', async () => {
    const { Tree } = composeMockAppTree('postOnboard')
    const value = new FilecoinNumber('1', 'fil')
    const balance = new FilecoinNumber('2', 'fil')
    const gasLimit = new FilecoinNumber('1000', 'attofil')
    await act(async () => {
      const { container } = render(
        <Tree>
          <Funds
            name='amount'
            label='Amount'
            amount={value.toAttoFil()}
            onAmountChange={onAmountChange}
            balance={balance}
            setError={setError}
            gasLimit={gasLimit}
            disabled
            valid
          />
        </Tree>
      )

      expect(container.firstChild).toMatchSnapshot()
    })
  })

  test('it renders disabled and invalid state correctly', async () => {
    const { Tree } = composeMockAppTree('postOnboard')
    const value = new FilecoinNumber('1', 'fil')
    const balance = new FilecoinNumber('2', 'fil')
    const gasLimit = new FilecoinNumber('1000', 'attofil')
    await act(async () => {
      const { container } = render(
        <Tree>
          <Funds
            name='amount'
            label='Amount'
            amount={value.toAttoFil()}
            onAmountChange={onAmountChange}
            balance={balance}
            setError={setError}
            gasLimit={gasLimit}
            disabled
            valid={false}
          />
        </Tree>
      )

      expect(container.firstChild).toMatchSnapshot()
    })
  })

  test('it renders !disabled and invalid state correctly', async () => {
    const { Tree } = composeMockAppTree('postOnboard')
    const value = new FilecoinNumber('1', 'fil')
    const balance = new FilecoinNumber('2', 'fil')
    const gasLimit = new FilecoinNumber('1000', 'attofil')
    await act(async () => {
      const { container } = render(
        <Tree>
          <Funds
            name='amount'
            label='Amount'
            amount={value.toAttoFil()}
            onAmountChange={onAmountChange}
            balance={balance}
            setError={setError}
            gasLimit={gasLimit}
            disabled={false}
            valid={false}
          />
        </Tree>
      )

      expect(container.firstChild).toMatchSnapshot()
    })
  })

  test('it renders error states properly', async () => {
    const { Tree } = composeMockAppTree('postOnboard')
    const value = new FilecoinNumber('1', 'fil')
    const balance = new FilecoinNumber('2', 'fil')
    const gasLimit = new FilecoinNumber('1000', 'attofil')
    await act(async () => {
      const { container } = render(
        <Tree>
          <Funds
            name='amount'
            label='Amount'
            amount={value.toAttoFil()}
            onAmountChange={onAmountChange}
            balance={balance}
            setError={setError}
            gasLimit={gasLimit}
            disabled={false}
            valid={false}
            error='specific error message'
          />
        </Tree>
      )

      expect(container.firstChild).toMatchSnapshot()
      expect(screen.getByText(/specific error message/)).toBeInTheDocument()
    })
  })

  describe('changing values', () => {
    test('it calls the value change callback when the user focuses between inputs', async () => {
      const { Tree } = composeMockAppTree('postOnboard')
      const value = new FilecoinNumber('0', 'fil')
      const balance = new FilecoinNumber('2', 'fil')
      const gasLimit = new FilecoinNumber('1000', 'attofil')
      let res
      await act(async () => {
        res = render(
          <Tree>
            <Funds
              name='amount'
              label='Amount'
              amount={value.toAttoFil()}
              onAmountChange={onAmountChange}
              balance={balance}
              setError={setError}
              gasLimit={gasLimit}
              disabled={false}
              valid={false}
            />
          </Tree>
        )

        // focus and blur the fil input
        fireEvent.focus(screen.getAllByPlaceholderText('0')[0])
        fireEvent.blur(screen.getAllByPlaceholderText('0')[0])
        expect(onAmountChange).toHaveBeenCalledTimes(1)
        // focus and blur the fiat input
        fireEvent.focus(screen.getAllByPlaceholderText('0')[1])
        fireEvent.blur(screen.getAllByPlaceholderText('0')[1])
        expect(onAmountChange).toHaveBeenCalledTimes(2)
      })
      await flushPromises()
      expect(res.container.firstChild).toMatchSnapshot()
      // test the fil input content being dislayed to the user
      expect(screen.getAllByPlaceholderText('0')[0].textContent).toBe('')
      // test the fiat input content being dislayed to the user
      expect(screen.getAllByPlaceholderText('0')[1].textContent).toBe('')
    })

    test.skip('it sets the right fiat amount when the user sets Filecoin', async () => {})
    test.skip('it sets the right FIL amount when the user sets fiat', async () => {})
    test.skip('it displays the right FIL amount when the user enters decimals like .0001', async () => {})
    test.skip('it displays the right USD amount when the user enters decimals like .0001', async () => {})
  })
})
