import { cleanup, render, screen, act, fireEvent } from '@testing-library/react'
import composeMockAppTree from '../../../test-utils/composeMockAppTree'

import Admin from '.'
import { PAGE } from '../../../constants'
import { MULTISIG_SIGNER_ADDRESS_2 } from '../../../MsigProvider/__mocks__'

const routerPushMock = jest.fn()
jest.spyOn(require('next/router'), 'useRouter').mockImplementation(() => {
  return {
    query: { network: 't' },
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
    // signers - "t1z225tguggx4onbauimqvxzutopzdr2m4s6z6wgi" and f1kxx73uhwgtorxxn7gbyihi6rwmaokj64iyg5qjy from msig provider mocks
    expect(screen.getByText(/6wgi/)).toBeInTheDocument()
    expect(screen.getByText(/5qjy/)).toBeInTheDocument()
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

    expect(routerPushMock).toHaveBeenCalledWith('/vault/add-signer?network=t')
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
      `${PAGE.MSIG_CHANGE_SIGNER}?network=t&address=${MULTISIG_SIGNER_ADDRESS_2}`
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
      `${PAGE.MSIG_REMOVE_SIGNER}?network=t&address=${MULTISIG_SIGNER_ADDRESS_2}`
    )
  })
})
