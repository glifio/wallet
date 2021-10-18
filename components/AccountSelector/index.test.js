import React from 'react'
import { render, act, screen, cleanup, fireEvent } from '@testing-library/react'
import AccountSelector from '.'
import HelperText from './HelperText'
import ThemeProvider from '../Shared/ThemeProvider'

import composeMockAppTree from '../../test-utils/composeMockAppTree'
import { flushPromises } from '../../test-utils'

jest.mock('../../WalletProvider')

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
      expect(res.container.firstChild).toMatchSnapshot()
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
    expect(res.container.firstChild).toMatchSnapshot()
  })

  test('it renders the wallets in redux, and an option to create the next wallet', async () => {
    const { Tree, store } = composeMockAppTree('postOnboard')
    let res
    await act(async () => {
      res = render(<AccountSelector test />, { wrapper: Tree })
    })
    await flushPromises()
    expect(store.getState().wallets.length).toBe(5)
    store.getState().wallets.forEach((w, i) => {
      expect(Number(w.path.split('/')[5])).toBe(Number(i))
    })
    expectAllAccountsInView(screen)

    expect(res.container.firstChild).toMatchSnapshot()
  })

  test('it renders an error when an error exists', async () => {
    const { Tree } = composeMockAppTree('postOnboardWithError')
    let res
    await act(async () => {
      res = render(<AccountSelector test />, { wrapper: Tree })
    })
    expect(screen.getAllByText('error for testing')[0]).toBeInTheDocument()
    expectAllAccountsInView(screen)

    expect(res.container.firstChild).toMatchSnapshot()
  })

  test('it adds a wallet to redux upon create', async () => {
    const { Tree, store } = composeMockAppTree('postOnboard')
    await act(async () => {
      render(<AccountSelector test />, { wrapper: Tree })
      await flushPromises()
      await fireEvent.click(screen.getByText('Create'))
      await flushPromises()
    })
    expect(store.getState().wallets.length).toBe(6)
    expect(screen.getByDisplayValue('6')).toBeInTheDocument()
  })
})

describe('HelperText', () => {
  afterEach(cleanup)
  test('it renders the non-msig, non-saft, non-ledger helper text correctly', () => {
    const { container } = render(
      <ThemeProvider>
        <HelperText isLedger={false} msig={false} />
      </ThemeProvider>
    )
    expect(container.firstChild).toMatchSnapshot()
  })

  test('it renders the non-msig, non-saft, ledger helper text correctly', () => {
    const { container } = render(
      <ThemeProvider>
        <HelperText isLedger={true} msig={false} />
      </ThemeProvider>
    )
    expect(container.firstChild).toMatchSnapshot()
  })

  test('it renders the msig helper text correctly', () => {
    const { container } = render(
      <ThemeProvider>
        <HelperText isLedger={true} msig={true} />
      </ThemeProvider>
    )
    expect(container.firstChild).toMatchSnapshot()
  })
})
