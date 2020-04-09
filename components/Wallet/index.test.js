import { cleanup, render, act, fireEvent } from '@testing-library/react'
import WalletProvider from '@openworklabs/filecoin-wallet-provider'

import WalletView from '.'
import composeMockAppTree from '../../test-utils/composeMockAppTree'

jest.mock('@openworklabs/filecoin-wallet-provider')

describe('WalletView', () => {
  afterEach(cleanup)
  test.only('it renders correctly', () => {
    const { Tree } = composeMockAppTree('postOnboard')
    const { container } = render(
      <Tree>
        <WalletView />
      </Tree>
    )

    expect(container.firstChild).toMatchSnapshot()
  })
})
