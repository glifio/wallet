import { cleanup, render, screen, act, fireEvent } from '@testing-library/react'
import { MULTISIG_SIGNER_ADDRESS_2 } from '../../../test-utils'
import composeMockAppTree from '../../../test-utils/composeMockAppTree'

import Admin from '.'
import { PAGE } from '../../../constants'

jest.mock('../../../WalletProvider')

const routerPushMock = jest.fn()
jest.spyOn(require('next/router'), 'useRouter').mockImplementation(() => {
  return {
    query: {},
    pathname: PAGE.MSIG_ADMIN,
    push: routerPushMock
  }
})

describe('Admin page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  test('it renders the required approvals and the signers', () => {
    const { Tree } = composeMockAppTree('postOnboard')

    const container = render(
      <Tree>
        <Admin />
      </Tree>
    )

    expect(screen.getByText(/Required Approvals/)).toBeInTheDocument()
    expect(screen.getByText(/Signers/)).toBeInTheDocument()
    expect(screen.getByText(/Signer 1 - Your Ledger/)).toBeInTheDocument()
    // make sure we only render 1 additional signer
    expect(screen.queryAllByText(/Additional Signer/).length).toBe(1)
    expect(screen.getByText('View on Device')).toBeInTheDocument()
    expect(screen.getByText(/Multisig Address/)).toBeInTheDocument()
    // signers - "t1z225tguggx4onbauimqvxzutopzdr2m4s6z6wgi" and f1nq5k2mps5umtebdovlyo7y6a3ywc7u4tobtuo3a from msig provider mocks
    expect(screen.getByText(/6wgi/)).toBeInTheDocument()
    expect(screen.getByText(/uo3a/)).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })

  test('it sends you to the add signer page when the user clicks the add signer button', () => {
    const { Tree } = composeMockAppTree('postOnboard')

    act(() => {
      render(
        <Tree>
          <Admin />
        </Tree>
      )
      fireEvent.click(screen.getByText('Add Signer'))
    })

    expect(routerPushMock).toHaveBeenCalledWith('/vault/add-signer')
  })

  test('it sends you to the change signer page with the right query params when the user clicks the edit signer button', () => {
    const { Tree } = composeMockAppTree('postOnboard')

    act(() => {
      render(
        <Tree>
          <Admin />
        </Tree>
      )
      fireEvent.click(screen.getByLabelText('edit-signer'))
    })

    expect(routerPushMock).toHaveBeenCalledWith(
      `${PAGE.MSIG_CHANGE_SIGNER}?address=${MULTISIG_SIGNER_ADDRESS_2}`
    )
  })

  test('it sends you to the remove signer page with the right query params when the user clicks the remove signer button', () => {
    const { Tree } = composeMockAppTree('postOnboard')

    act(() => {
      render(
        <Tree>
          <Admin />
        </Tree>
      )
      fireEvent.click(screen.getByLabelText('remove-signer'))
    })

    expect(routerPushMock).toHaveBeenCalledWith(
      `${PAGE.MSIG_REMOVE_SIGNER}?address=${MULTISIG_SIGNER_ADDRESS_2}`
    )
  })
})
