import React from 'react'
import { render, act, screen, cleanup } from '@testing-library/react'
import AccountSelector from '.'
import HelperText from './HelperText'
import ThemeProvider from '../Shared/ThemeProvider'

import composeMockAppTree from '../../test-utils/composeMockAppTree'

describe('AccountSelector', () => {
  afterEach(cleanup)
  test('it renders the loading screen first', async () => {
    const { Tree } = composeMockAppTree('postOnboard')
    await act(async () => {
      let res = render(<AccountSelector />, { wrapper: Tree })
      expect(res.container.firstChild).toMatchSnapshot()
    })
  })

  test('it renders the wallets in redux with the investor copy when the investor prop is passed', async () => {
    const { Tree } = composeMockAppTree('postOnboard')
    let res
    await act(async () => {
      res = render(<AccountSelector msig />, { wrapper: Tree })
    })
    // IMPORTANT; the the X button alone is the 0th child, so we assert against the first child
    expect(res.container.firstChild).toMatchSnapshot()
  })

  test('it renders the wallets in redux, and an option to create the next wallet', async () => {
    const { Tree, store } = composeMockAppTree('postOnboard')
    let res
    await act(async () => {
      res = render(<AccountSelector />, { wrapper: Tree })
    })
    expect(store.getState().wallets.length).toBe(5)
    store.getState().wallets.forEach((w, i) => {
      expect(Number(w.path.split('/')[5])).toBe(Number(i))
    })
    expect(res.container.firstChild).toMatchSnapshot()
  })

  test('it renders an error when an error exists', async () => {
    const { Tree } = composeMockAppTree('postOnboardWithError')
    let res
    await act(async () => {
      res = render(<AccountSelector />, { wrapper: Tree })
    })
    expect(screen.getAllByText('error for testing')[0]).toBeInTheDocument()
    for (let i = 0; i < 5; i++) {
      expect(screen.getAllByText('Address')[i]).toBeInTheDocument()
    }
    expect(res.container.firstChild).toMatchSnapshot()
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
