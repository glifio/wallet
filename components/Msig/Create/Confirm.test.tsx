import '@testing-library/jest-dom/extend-expect'
import { act, cleanup, render, screen } from '@testing-library/react'

import composeMockAppTree from '../../../test-utils/composeMockAppTree'
import { PAGE } from '../../../constants'

import Confirm from './Confirm'
import { flushPromises } from '../../../test-utils'

jest.mock('../../../MsigProvider')
const mockMessageConfirmation = jest.fn(async () => true)
jest
  .spyOn(require('@glif/filecoin-message-confirmer'), 'default')
  .mockImplementation(mockMessageConfirmation)

const mockStateGetMessageReceipt = jest.fn(async () => ({
  ExitCode: 0,
  Return: 'gkQAyogBVQJnC6HX7N9krE3QzLET9tDO1XuUqw==',
  GasUsed: 8555837
}))
jest
  .spyOn(require('@glif/filecoin-rpc-client'), 'default')
  .mockImplementation(() => {
    return {
      request: mockStateGetMessageReceipt
    }
  })

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

  test('it renders message pending UI while the transaction is pending', () => {
    const { Tree } = composeMockAppTree('pendingMsigCreate')
    let container, unmount
    act(() => {
      const rendered = render(
        <Tree>
          <Confirm />
        </Tree>
      )

      container = rendered.container
      unmount = rendered.unmount
    })

    expect(
      screen.getByText(/waiting for your transaction to confirm./)
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        /This screen will automatically show you your new Multisig wallet address once the transaction confirms./
      )
    ).toBeInTheDocument()
    expect(container.firstChild).toMatchSnapshot()
    unmount()
  })

  test('it attempts to confirm the pending msig create message', async () => {
    const { Tree } = composeMockAppTree('pendingMsigCreate')
    let unmount
    act(() => {
      const rendered = render(
        <Tree>
          <Confirm />
        </Tree>
      )
      unmount = rendered.unmount
    })

    expect(mockMessageConfirmation).toHaveBeenCalled()
    unmount()
  })

  test('it displays the multisig address after the message is confirmed', async () => {
    const { Tree } = composeMockAppTree('pendingMsigCreate')
    let container, unmount
    await act(async () => {
      const rendered = render(
        <Tree>
          <Confirm />
        </Tree>
      )
      container = rendered.container
      unmount = rendered.unmount
    })
    await flushPromises()

    expect(mockMessageConfirmation).toHaveBeenCalled()
    expect(screen.getByText(/Your multisig has been created./))
    expect(container.firstChild).toMatchSnapshot()
    unmount()
  })
})
