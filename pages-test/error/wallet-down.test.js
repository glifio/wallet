import { cleanup, render, screen } from '@testing-library/react'

import WalletDown from '../../pages/error/wallet-down.jsx'
import composeMockAppTree from '../../test-utils/composeMockAppTree'

jest.mock('@glif/filecoin-wallet-provider')

describe('WalletDown', () => {
  afterEach(cleanup)
  test('it renders the error page', () => {
    const { Tree } = composeMockAppTree('postOnboard')
    const { container } = render(
      <Tree>
        <WalletDown />
      </Tree>
    )

    expect(
      screen.getByText(
        "We've been notified of the problem, but feel free to reach out to squad@infinitescroll.org with any questions or concerns."
      )
    ).toBeInTheDocument()
    expect(container.firstChild).toMatchSnapshot()
  })
})
