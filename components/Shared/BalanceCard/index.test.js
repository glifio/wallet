import React from 'react'
import { FilecoinNumber } from '@openworklabs/filecoin-number'
import { fireEvent, cleanup, render, act } from '@testing-library/react'
import BalanceCard from '.'
import noop from '../../../utils/noop'
import ThemeProvider from '../ThemeProvider'

describe('BalanceCard', () => {
  afterEach(cleanup)

  test('it renders correctly', () => {
    const { container } = render(
      <ThemeProvider>
        <BalanceCard
          balance={new FilecoinNumber('100', 'fil')}
          onSend={noop}
          onReceive={noop}
        />
      </ThemeProvider>
    )
    expect(container.firstChild).toMatchSnapshot()
  })

  test('it renders pretty billion dollar balances', () => {
    const { container } = render(
      <ThemeProvider>
        <BalanceCard
          balance={new FilecoinNumber('10023324902.1241', 'fil')}
          onSend={noop}
          onReceive={noop}
        />
      </ThemeProvider>
    )
    expect(container.firstChild).toMatchSnapshot()
  })

  test('it renders pretty million dollar balances', () => {
    const { container } = render(
      <ThemeProvider>
        <BalanceCard
          balance={new FilecoinNumber('10022324.1241', 'fil')}
          onSend={noop}
          onReceive={noop}
        />
      </ThemeProvider>
    )
    expect(container.firstChild).toMatchSnapshot()
  })

  test('it renders pretty thousand dollar balances', () => {
    const { container } = render(
      <ThemeProvider>
        <BalanceCard
          balance={new FilecoinNumber('10021.1241', 'fil')}
          onSend={noop}
          onReceive={noop}
        />
      </ThemeProvider>
    )
    expect(container.firstChild).toMatchSnapshot()
  })

  test('it renders pretty under thousand dollar balances', () => {
    const { container } = render(
      <ThemeProvider>
        <BalanceCard
          balance={new FilecoinNumber('999.1241', 'fil')}
          onSend={noop}
          onReceive={noop}
        />
      </ThemeProvider>
    )
    expect(container.firstChild).toMatchSnapshot()
  })

  test('it renders pretty under 1 dollar balances', () => {
    const { container } = render(
      <ThemeProvider>
        <BalanceCard
          balance={new FilecoinNumber('.00001', 'fil')}
          onSend={noop}
          onReceive={noop}
        />
      </ThemeProvider>
    )
    expect(container.firstChild).toMatchSnapshot()
  })

  test('it renders precise when the user clicks "precise"', () => {
    const { container, getByText } = render(
      <ThemeProvider>
        <BalanceCard
          balance={new FilecoinNumber('23488219.00001', 'fil')}
          onSend={noop}
          onReceive={noop}
        />
      </ThemeProvider>
    )

    act(() => {
      fireEvent.click(getByText('Exact'))
    })

    expect(container.firstChild).toMatchSnapshot()
  })
})
