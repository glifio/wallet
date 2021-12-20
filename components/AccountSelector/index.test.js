import React from 'react'
import { ThemeProvider, theme } from '@glif/react-components'
import { render, act, screen, cleanup, fireEvent } from '@testing-library/react'
import AccountSelector from '.'
import HelperText from './HelperText'

import composeMockAppTree from '../../test-utils/composeMockAppTree'
import { flushPromises } from '../../test-utils'

function expectAllAccountsInView(screen) {
  for (let i = 0; i < 5; i++) {
    if (i === 0) {
      expect(screen.getByText('Default')).toBeInTheDocument()
    } else expect(screen.getByText(`Account ${i}`)).toBeInTheDocument()
  }
}

describe('AccountSelector', () => {
  afterEach(cleanup)
  test('it renders the loading screen first', async () => {
    const { Tree } = composeMockAppTree('postOnboard')
    await act(async () => {
      let res = render(<AccountSelector test />, { wrapper: Tree })
      expect(screen.getByText(/Loading/)).toBeInTheDocument()
      expect(res.container).toMatchSnapshot()
    })
  })

  test('it renders the wallets in redux with the msig copy when the msig prop is passed', async () => {
    const { Tree } = composeMockAppTree('postOnboard')
    let res
    await act(async () => {
      res = render(<AccountSelector test msig />, { wrapper: Tree })
    })

    expectAllAccountsInView(screen)
    // IMPORTANT; the the X button alone is the 0th child, so we assert against the first child
    expect(res.container).toMatchSnapshot()
  })

  test('it renders the wallets in redux, and an option to create the next wallet', async () => {
    const { Tree, getWalletProviderState } = composeMockAppTree('postOnboard')
    let res
    await act(async () => {
      res = render(<AccountSelector test />, { wrapper: Tree })
    })
    await flushPromises()

    expect(getWalletProviderState().wallets.length).toBe(5)
    getWalletProviderState().wallets.forEach((w, i) => {
      expect(Number(w.path.split('/')[5])).toBe(Number(i))
    })
    expectAllAccountsInView(screen)

    expect(res.container).toMatchSnapshot()
  })

  test('it adds a wallet to redux upon create', async () => {
    const { Tree, getWalletProviderState } = composeMockAppTree('postOnboard')
    await act(async () => {
      render(<AccountSelector test />, { wrapper: Tree })
    })

    await act(async () => {
      await fireEvent.click(screen.getByText('Create'))
    })
    expect(getWalletProviderState().wallets.length).toBe(6)
    expect(screen.getByDisplayValue('6')).toBeInTheDocument()
  })

  test('it adds the correct wallet to redux upon create', async () => {
    const { Tree, getWalletProviderState } = composeMockAppTree('postOnboard')
    const index = 8
    await act(async () => {
      render(<AccountSelector test />, { wrapper: Tree })
    })

    await act(async () => {
      fireEvent.click(screen.getByText('Legacy address'))
      await fireEvent.change(screen.getByDisplayValue(/5/), {
        target: { value: index },
        preventDefault: () => {}
      })
    })

    await act(async () => {
      await fireEvent.click(screen.getByText('Create'))
    })

    const wallets = getWalletProviderState().wallets
    expect(wallets.length).toBe(6)
    expect(Number(wallets[wallets.length - 1].path.split('/')[5])).toBe(index)
    expect(screen.getByDisplayValue('6')).toBeInTheDocument()
  })
})

describe('HelperText', () => {
  afterEach(cleanup)
  test('it renders the non-msig, non-saft, non-ledger helper text correctly', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <HelperText isLedger={false} msig={false} />
      </ThemeProvider>
    )
    expect(container.firstChild).toMatchSnapshot()
  })

  test('it renders the non-msig, non-saft, ledger helper text correctly', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <HelperText isLedger={true} msig={false} />
      </ThemeProvider>
    )
    expect(container.firstChild).toMatchSnapshot()
  })

  test('it renders the msig helper text correctly', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <HelperText isLedger={true} msig={true} />
      </ThemeProvider>
    )
    expect(container.firstChild).toMatchSnapshot()
  })
})
