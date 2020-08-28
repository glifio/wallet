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
    const estimatedTransactionFee = new FilecoinNumber('1000', 'attofil')
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
            estimatedTransactionFee={estimatedTransactionFee}
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
    const estimatedTransactionFee = new FilecoinNumber('1000', 'attofil')
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
            estimatedTransactionFee={estimatedTransactionFee}
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
    const estimatedTransactionFee = new FilecoinNumber('1000', 'attofil')
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
            estimatedTransactionFee={estimatedTransactionFee}
            disabled
          />
        </Tree>
      )

      expect(container.firstChild).toMatchSnapshot()
      expect(screen.getAllByPlaceholderText('0')[0].disabled).toBeTruthy()
    })
  })

  test('it renders disabled and valid state correctly', async () => {
    const { Tree } = composeMockAppTree('postOnboard')
    const value = new FilecoinNumber('1', 'fil')
    const balance = new FilecoinNumber('2', 'fil')
    const estimatedTransactionFee = new FilecoinNumber('1000', 'attofil')
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
            estimatedTransactionFee={estimatedTransactionFee}
            disabled
            valid
          />
        </Tree>
      )

      expect(container.firstChild).toMatchSnapshot()
      expect(screen.getAllByPlaceholderText('0')[0].disabled).toBeTruthy()
    })
  })

  test('it renders disabled and invalid state correctly', async () => {
    const { Tree } = composeMockAppTree('postOnboard')
    const value = new FilecoinNumber('1', 'fil')
    const balance = new FilecoinNumber('2', 'fil')
    const estimatedTransactionFee = new FilecoinNumber('1000', 'attofil')
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
            estimatedTransactionFee={estimatedTransactionFee}
            disabled
            valid={false}
          />
        </Tree>
      )

      expect(container.firstChild).toMatchSnapshot()
      expect(screen.getAllByPlaceholderText('0')[0].disabled).toBeTruthy()
    })
  })

  test('it renders !disabled and invalid state correctly', async () => {
    const { Tree } = composeMockAppTree('postOnboard')
    const value = new FilecoinNumber('1', 'fil')
    const balance = new FilecoinNumber('2', 'fil')
    const estimatedTransactionFee = new FilecoinNumber('1000', 'attofil')
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
            estimatedTransactionFee={estimatedTransactionFee}
            disabled={false}
            valid={false}
          />
        </Tree>
      )

      expect(container.firstChild).toMatchSnapshot()
      expect(screen.getAllByPlaceholderText('0')[0].disabled).toBeFalsy()
    })
  })

  test('it renders error states properly', async () => {
    const { Tree } = composeMockAppTree('postOnboard')
    const value = new FilecoinNumber('1', 'fil')
    const balance = new FilecoinNumber('2', 'fil')
    const estimatedTransactionFee = new FilecoinNumber('1000', 'attofil')
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
            estimatedTransactionFee={estimatedTransactionFee}
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
      const estimatedTransactionFee = new FilecoinNumber('1000', 'attofil')
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
              estimatedTransactionFee={estimatedTransactionFee}
              disabled={false}
              valid={false}
            />
          </Tree>
        )

        fireEvent.focus(screen.getAllByPlaceholderText('0')[0])
        fireEvent.blur(screen.getAllByPlaceholderText('0')[0])
        expect(onAmountChange).toHaveBeenCalledTimes(1)
        fireEvent.focus(screen.getAllByPlaceholderText('0')[1])
        fireEvent.blur(screen.getAllByPlaceholderText('0')[1])
        expect(onAmountChange).toHaveBeenCalledTimes(2)
      })
      await flushPromises()
      expect(res.container.firstChild).toMatchSnapshot()
      expect(screen.getAllByPlaceholderText('0')[0].value).toBe('')
      expect(screen.getAllByPlaceholderText('0')[1].value).toBe('')
    })

    test('it sets the right fiat amount when the user sets FIL', async () => {
      const { Tree } = composeMockAppTree('postOnboard')
      const value = new FilecoinNumber('0', 'fil')
      const balance = new FilecoinNumber('2', 'fil')
      const estimatedTransactionFee = new FilecoinNumber('1000', 'attofil')
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
              estimatedTransactionFee={estimatedTransactionFee}
              disabled={false}
              valid={false}
            />
          </Tree>
        )

        fireEvent.click(screen.getAllByPlaceholderText('0')[0])
        fireEvent.change(screen.getAllByPlaceholderText('0')[0], {
          target: {
            value: new FilecoinNumber('0.1', 'fil')
          }
        })
        await flushPromises()
        fireEvent.blur(screen.getAllByPlaceholderText('0')[0])
        expect(res.container.firstChild).toMatchSnapshot()
        expect(screen.getAllByPlaceholderText('0')[0].value).toBe('0.1')
        expect(screen.getAllByPlaceholderText('0')[1].value).toBe('0.5')
      })
    })

    test('it sets the right FIL amount when the user sets fiat', async () => {
      const { Tree } = composeMockAppTree('postOnboard')
      const value = new FilecoinNumber('0', 'fil')
      const balance = new FilecoinNumber('2', 'fil')
      const estimatedTransactionFee = new FilecoinNumber('1000', 'attofil')
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
              estimatedTransactionFee={estimatedTransactionFee}
              disabled={false}
              valid={false}
            />
          </Tree>
        )

        fireEvent.click(screen.getAllByPlaceholderText('0')[1])
        fireEvent.change(screen.getAllByPlaceholderText('0')[1], {
          target: {
            value: '0.5'
          }
        })
        await flushPromises()
        fireEvent.blur(screen.getAllByPlaceholderText('0')[1])
        expect(res.container.firstChild).toMatchSnapshot()
        expect(screen.getAllByPlaceholderText('0')[0].value).toBe('0.1')
        expect(screen.getAllByPlaceholderText('0')[1].value).toBe('0.5')
      })
    })

    test('it sets the right fiat amount when the user sets FIL twice', async () => {
      const { Tree } = composeMockAppTree('postOnboard')
      const value = new FilecoinNumber('0', 'fil')
      const balance = new FilecoinNumber('2', 'fil')
      const estimatedTransactionFee = new FilecoinNumber('1000', 'attofil')
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
              estimatedTransactionFee={estimatedTransactionFee}
              disabled={false}
              valid={false}
            />
          </Tree>
        )

        fireEvent.click(screen.getAllByPlaceholderText('0')[0])
        fireEvent.change(screen.getAllByPlaceholderText('0')[0], {
          target: {
            value: new FilecoinNumber('0.1', 'fil')
          }
        })
        await flushPromises()
        fireEvent.blur(screen.getAllByPlaceholderText('0')[0])
        expect(res.container.firstChild).toMatchSnapshot()
        expect(screen.getAllByPlaceholderText('0')[0].value).toBe('0.1')
        expect(screen.getAllByPlaceholderText('0')[1].value).toBe('0.5')

        fireEvent.click(screen.getAllByPlaceholderText('0')[0])
        fireEvent.change(screen.getAllByPlaceholderText('0')[0], {
          target: {
            value: new FilecoinNumber('0.5', 'fil')
          }
        })
        await flushPromises()
        fireEvent.blur(screen.getAllByPlaceholderText('0')[0])
        expect(res.container.firstChild).toMatchSnapshot()
        expect(screen.getAllByPlaceholderText('0')[0].value).toBe('0.5')
        expect(screen.getAllByPlaceholderText('0')[1].value).toBe('2.5')
        expect(onAmountChange).toHaveBeenCalledTimes(2)
      })
    })

    test('it sets the right FIL amount when the user sets fiat twice', async () => {
      const { Tree } = composeMockAppTree('postOnboard')
      const value = new FilecoinNumber('0', 'fil')
      const balance = new FilecoinNumber('2', 'fil')
      const estimatedTransactionFee = new FilecoinNumber('1000', 'attofil')
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
              estimatedTransactionFee={estimatedTransactionFee}
              disabled={false}
              valid={false}
            />
          </Tree>
        )

        fireEvent.click(screen.getAllByPlaceholderText('0')[1])
        fireEvent.change(screen.getAllByPlaceholderText('0')[1], {
          target: {
            value: '0.5'
          }
        })
        await flushPromises()
        fireEvent.blur(screen.getAllByPlaceholderText('0')[1])
        expect(res.container.firstChild).toMatchSnapshot()
        expect(screen.getAllByPlaceholderText('0')[0].value).toBe('0.1')
        expect(screen.getAllByPlaceholderText('0')[1].value).toBe('0.5')

        fireEvent.click(screen.getAllByPlaceholderText('0')[1])
        fireEvent.change(screen.getAllByPlaceholderText('0')[1], {
          target: {
            value: '2.5'
          }
        })
        await flushPromises()
        fireEvent.blur(screen.getAllByPlaceholderText('0')[1])
        expect(res.container.firstChild).toMatchSnapshot()
        expect(screen.getAllByPlaceholderText('0')[0].value).toBe('0.5')
        expect(screen.getAllByPlaceholderText('0')[1].value).toBe('2.5')
        expect(onAmountChange).toHaveBeenCalledTimes(2)
      })
    })

    test('it sets the right FIL amount when the user sets FIL and then fiat', async () => {
      const { Tree } = composeMockAppTree('postOnboard')
      const value = new FilecoinNumber('0', 'fil')
      const balance = new FilecoinNumber('2', 'fil')
      const estimatedTransactionFee = new FilecoinNumber('1000', 'attofil')
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
              estimatedTransactionFee={estimatedTransactionFee}
              disabled={false}
              valid={false}
            />
          </Tree>
        )

        fireEvent.click(screen.getAllByPlaceholderText('0')[0])
        fireEvent.change(screen.getAllByPlaceholderText('0')[0], {
          target: {
            value: '0.1'
          }
        })
        await flushPromises()
        fireEvent.blur(screen.getAllByPlaceholderText('0')[0])
        expect(res.container.firstChild).toMatchSnapshot()
        expect(screen.getAllByPlaceholderText('0')[0].value).toBe('0.1')
        expect(screen.getAllByPlaceholderText('0')[1].value).toBe('0.5')

        fireEvent.click(screen.getAllByPlaceholderText('0')[1])
        fireEvent.change(screen.getAllByPlaceholderText('0')[1], {
          target: {
            value: '2.5'
          }
        })
        await flushPromises()
        fireEvent.blur(screen.getAllByPlaceholderText('0')[1])
        expect(res.container.firstChild).toMatchSnapshot()
        expect(screen.getAllByPlaceholderText('0')[0].value).toBe('0.5')
        expect(screen.getAllByPlaceholderText('0')[1].value).toBe('2.5')
        expect(onAmountChange).toHaveBeenCalledTimes(2)
      })
    })

    test('it sets the right fiat amount when the user sets fiat and then FIL', async () => {
      const { Tree } = composeMockAppTree('postOnboard')
      const value = new FilecoinNumber('0', 'fil')
      const balance = new FilecoinNumber('2', 'fil')
      const estimatedTransactionFee = new FilecoinNumber('1000', 'attofil')
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
              estimatedTransactionFee={estimatedTransactionFee}
              disabled={false}
              valid={false}
            />
          </Tree>
        )

        fireEvent.click(screen.getAllByPlaceholderText('0')[0])
        fireEvent.change(screen.getAllByPlaceholderText('0')[0], {
          target: {
            value: '0.1'
          }
        })
        await flushPromises()
        fireEvent.blur(screen.getAllByPlaceholderText('0')[0])
        expect(res.container.firstChild).toMatchSnapshot()
        expect(screen.getAllByPlaceholderText('0')[0].value).toBe('0.1')
        expect(screen.getAllByPlaceholderText('0')[1].value).toBe('0.5')

        fireEvent.click(screen.getAllByPlaceholderText('0')[0])
        fireEvent.change(screen.getAllByPlaceholderText('0')[0], {
          target: {
            value: '0.5'
          }
        })
        await flushPromises()
        fireEvent.blur(screen.getAllByPlaceholderText('0')[0])
        expect(res.container.firstChild).toMatchSnapshot()
        expect(screen.getAllByPlaceholderText('0')[0].value).toBe('0.5')
        expect(screen.getAllByPlaceholderText('0')[1].value).toBe('2.5')
        expect(onAmountChange).toHaveBeenCalledTimes(2)
      })
    })

    test('it sets error when more FIL is entered than what is in balance', async () => {
      const { Tree } = composeMockAppTree('postOnboard')
      const value = new FilecoinNumber('0', 'fil')
      const balance = new FilecoinNumber('2', 'fil')
      const estimatedTransactionFee = new FilecoinNumber('1000', 'attofil')
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
              estimatedTransactionFee={estimatedTransactionFee}
              disabled={false}
              valid={false}
            />
          </Tree>
        )

        fireEvent.click(screen.getAllByPlaceholderText('0')[0])
        fireEvent.change(screen.getAllByPlaceholderText('0')[0], {
          target: {
            value: new FilecoinNumber('5', 'fil')
          }
        })
        await flushPromises()
        fireEvent.blur(screen.getAllByPlaceholderText('0')[0])
        expect(setError).toHaveBeenCalled()
        expect(setError).toHaveBeenCalledWith(
          "The amount must be smaller than this account's balance"
        )
      })
    })

    test('it sets error when more fiat is entered than what is in balance', async () => {
      const { Tree } = composeMockAppTree('postOnboard')
      const value = new FilecoinNumber('0', 'fil')
      const balance = new FilecoinNumber('2', 'fil')
      const estimatedTransactionFee = new FilecoinNumber('1000', 'attofil')
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
              estimatedTransactionFee={estimatedTransactionFee}
              disabled={false}
              valid={false}
            />
          </Tree>
        )

        fireEvent.click(screen.getAllByPlaceholderText('0')[1])
        fireEvent.change(screen.getAllByPlaceholderText('0')[1], {
          target: {
            value: '50'
          }
        })
        await flushPromises()
        fireEvent.blur(screen.getAllByPlaceholderText('0')[1])
        expect(setError).toHaveBeenCalled()
        expect(setError).toHaveBeenCalledWith(
          "The amount must be smaller than this account's balance"
        )
      })
    })

    test('it empties error with valid input value after insufficent balance error', async () => {
      const { Tree } = composeMockAppTree('postOnboard')
      const value = new FilecoinNumber('0', 'fil')
      const balance = new FilecoinNumber('2', 'fil')
      const estimatedTransactionFee = new FilecoinNumber('1000', 'attofil')
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
              estimatedTransactionFee={estimatedTransactionFee}
              disabled={false}
              valid={false}
            />
          </Tree>
        )

        fireEvent.click(screen.getAllByPlaceholderText('0')[1])
        fireEvent.change(screen.getAllByPlaceholderText('0')[1], {
          target: {
            value: '50'
          }
        })
        await flushPromises()
        fireEvent.blur(screen.getAllByPlaceholderText('0')[1])
        expect(setError).toHaveBeenCalled()
        expect(setError).toHaveBeenCalledWith(
          "The amount must be smaller than this account's balance"
        )

        fireEvent.click(screen.getAllByPlaceholderText('0')[1])
        fireEvent.change(screen.getAllByPlaceholderText('0')[1], {
          target: {
            value: '0.1'
          }
        })
        await flushPromises()
        fireEvent.blur(screen.getAllByPlaceholderText('0')[1])
        expect(setError).toHaveBeenCalled()
        expect(setError).toHaveBeenLastCalledWith('')
      })
    })
  })

  test('it sets ammounts automatically after multiple changes', async () => {
    jest.useFakeTimers()
    const { Tree } = composeMockAppTree('postOnboard')
    const value = new FilecoinNumber('0', 'fil')
    const balance = new FilecoinNumber('2', 'fil')
    const estimatedTransactionFee = new FilecoinNumber('1000', 'attofil')
    await act(async () => {
      render(
        <Tree>
          <Funds
            name='amount'
            label='Amount'
            amount={value.toAttoFil()}
            onAmountChange={onAmountChange}
            balance={balance}
            setError={setError}
            estimatedTransactionFee={estimatedTransactionFee}
            disabled={false}
            valid={false}
          />
        </Tree>
      )

      fireEvent.click(screen.getAllByPlaceholderText('0')[1])
      fireEvent.change(screen.getAllByPlaceholderText('0')[1], {
        target: {
          value: '0'
        }
      })
      await flushPromises()
      fireEvent.change(screen.getAllByPlaceholderText('0')[1], {
        target: {
          value: '0.'
        }
      })
      await flushPromises()
      fireEvent.change(screen.getAllByPlaceholderText('0')[1], {
        target: {
          value: '0.0'
        }
      })
      await flushPromises()
      fireEvent.change(screen.getAllByPlaceholderText('0')[1], {
        target: {
          value: '0.001'
        }
      })
      await flushPromises()
      fireEvent.change(screen.getAllByPlaceholderText('0')[1], {
        target: {
          value: '0.0010'
        }
      })
      await flushPromises()
      fireEvent.change(screen.getAllByPlaceholderText('0')[1], {
        target: {
          value: '0.00101'
        }
      })
      await flushPromises()
      fireEvent.change(screen.getAllByPlaceholderText('0')[1], {
        target: {
          value: '0.001010'
        }
      })
      await flushPromises()
      jest.runOnlyPendingTimers()
    })
    await flushPromises()

    expect(screen.getAllByPlaceholderText('0')[0].value).toBe('0.000202')
    expect(screen.getAllByPlaceholderText('0')[1].value).toBe('0.001010')
    expect(onAmountChange).toHaveBeenCalledTimes(1)
  })
})
