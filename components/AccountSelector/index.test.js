import React from 'react'
import { render, act, screen, cleanup } from '@testing-library/react'
import AccountSelector from '.'

import composeMockAppTree from '../../test-utils/composeMockAppTree'

describe('AccountSelector', () => {
  afterEach(cleanup)
  test('it renders the loading screen first', async () => {
    const { Tree } = composeMockAppTree('postOnboard')
    await act(async () => {
      let res = render(<AccountSelector />, { wrapper: Tree })
      expect(res.container.children[1]).toMatchSnapshot()
    })
  })

  test('it renders the wallets in redux with the investor copy when the investor prop is passed', async () => {
    const { Tree } = composeMockAppTree('postOnboard')
    let res
    await act(async () => {
      res = render(<AccountSelector premainnetInvestor />, { wrapper: Tree })
    })
    // IMPORTANT; the investor prop causes the X button to not get rendered, which is normally the firstChild of the container here
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
    expect(res.container.children[1]).toMatchSnapshot()
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
    expect(res.container.children[1]).toMatchSnapshot()
  })
})
