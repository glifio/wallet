import { cleanup, render, screen, act, fireEvent } from '@testing-library/react'

import WalletView from '.'
import composeMockAppTree from '../../test-utils/composeMockAppTree'

jest.mock('@openworklabs/filecoin-wallet-provider')

describe('WalletView', () => {
  afterEach(cleanup)
  test('it renders correctly', () => {
    const { Tree } = composeMockAppTree('postOnboard')
    const { container } = render(
      <Tree>
        <WalletView />
      </Tree>
    )

    expect(container.firstChild).toMatchSnapshot()
  })

  test('it renders the message history view by default', () => {
    const { Tree } = composeMockAppTree('postOnboard')
    render(
      <Tree>
        <WalletView />
      </Tree>
    )

    expect(screen.getByText('Transaction History')).toBeInTheDocument()
  })

  test('it renders the send flow when a user clicks send', async () => {
    const { Tree } = composeMockAppTree('postOnboard')

    let res
    // this isn't necessary, per se, but it silences the warnings
    await act(async () => {
      res = render(
        <Tree>
          <WalletView />
        </Tree>
      )
      fireEvent.click(screen.getByText('Send'))
    })

    expect(screen.getByText('Sending Filecoin')).toBeInTheDocument()
    expect(res.container.firstChild).toMatchSnapshot()
  })

  test('it renders the receive flow when a user clicks receive', async () => {
    const { Tree } = composeMockAppTree('postOnboard')

    let res
    // this isn't necessary, per se, but it silences the warnings
    await act(async () => {
      res = render(
        <Tree>
          <WalletView />
        </Tree>
      )
      fireEvent.click(screen.getByText('Receive'))
    })

    expect(screen.getByText('Receive Filecoin')).toBeInTheDocument()
    expect(res.container.firstChild).toMatchSnapshot()
  })
})
