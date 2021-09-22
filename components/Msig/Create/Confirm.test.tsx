import '@testing-library/jest-dom/extend-expect'
import { cleanup, render, screen } from '@testing-library/react'

import composeMockAppTree from '../../../test-utils/composeMockAppTree'
import { PAGE } from '../../../constants'

import Confirm from './Confirm'

jest.mock('../../../MsigProvider')
jest.mock('../../../WalletProvider')

jest.spyOn(require('next/router'), 'useRouter').mockImplementation(() => {
  return {
    query: { network: 't' },
    pathname: PAGE.MSIG_CREATE_CONFIRM,
    push: jest.fn()
  }
})

describe('confirmation of newly created multisig', () => {
  afterEach(cleanup)
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('it renders message pending UI while the transaction is pending', async () => {
    const { Tree } = composeMockAppTree('pendingMsigCreate')
    render(
      <Tree>
        <Confirm />
      </Tree>
    )

    expect(
      screen.getByText(
        /This screen will automatically show you your new Multisig wallet address once the transaction confirms./
      )
    ).toBeInTheDocument()
  })
})
