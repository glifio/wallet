import React from 'react'
import { render, act, waitFor, screen, cleanup } from '@testing-library/react'
import { FilecoinNumber } from '@openworklabs/filecoin-number'
import AccountSelector from '.'

import composeMockAppTree from '../../test-utils/composeMockAppTree'
import createPath from '../../utils/createPath'

describe('AccountSelector', () => {
  afterEach(cleanup)
  test('it renders the loading screen first', () => {
    const { Tree } = composeMockAppTree('postOnboard')
    let res = render(<AccountSelector />, { wrapper: Tree })

    expect(res.container.children[1]).toMatchSnapshot()
  })

  test('it renders the wallets in redux with the investor copy when the investor prop is passed', async () => {
    const { Tree } = composeMockAppTree('postOnboard')
    let res
    await act(async () => {
      res = render(<AccountSelector investor />, { wrapper: Tree })
    })
    // IMPORTANT; the investor prop causes the X button to not get rendered, which is normally the firstChild of the container here
    expect(res.container.firstChild).toMatchSnapshot()
  })

  test('it renders the wallets in redux, and an option to create the next wallet', async () => {
    const { Tree } = composeMockAppTree('postOnboard')
    let res
    await act(async () => {
      res = render(<AccountSelector />, { wrapper: Tree })
    })

    expect(res.container.children[1]).toMatchSnapshot()
  })

  test.only('it renders an error when an error exists', async () => {
    const { Tree } = composeMockAppTree('postOnboardWithError')
    let res
    await act(async () => {
      res = render(<AccountSelector />, { wrapper: Tree })
    })
    expect(screen.getAllByText('error for testing')[0]).toBeInTheDocument()
    expect(res.container.children[1]).toMatchSnapshot()
  })
})
