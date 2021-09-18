import { cleanup, render, screen, act, fireEvent } from '@testing-library/react'
import composeMockAppTree from '../../../test-utils/composeMockAppTree'

import Home from '.'
import { PAGE } from '../../../constants'

const routerPushMock = jest.fn()
jest.spyOn(require('next/router'), 'useRouter').mockImplementation(() => {
  return {
    query: { network: 't' },
    pathname: PAGE.MSIG_HOME,
    push: routerPushMock
  }
})

describe('Msig Home', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  test('it renders the vesting balance, available balance, and msig address', async () => {
    const { Tree } = composeMockAppTree('postOnboard')

    const container = render(
      <Tree>
        <Home />
      </Tree>
    )

    expect(screen.getByText('Available Balance')).toBeInTheDocument()
    expect(screen.getByText('Multisig Address')).toBeInTheDocument()
    expect(screen.getByText('Total Vesting')).toBeInTheDocument()

    expect(container).toMatchSnapshot()
  })

  test('it renders the nav menu', async () => {
    const { Tree } = composeMockAppTree('postOnboard')

    render(
      <Tree>
        <Home />
      </Tree>
    )

    expect(screen.getByText('Assets')).toBeInTheDocument()
    expect(screen.getByText('Assets')).toHaveStyle('color: #5E26FF;')
    expect(screen.getByText('Admin')).toBeInTheDocument()
    expect(screen.getByText('History')).toBeInTheDocument()
  })

  test('clicking withdraw sends the user to the withdraw page', async () => {
    const { Tree } = composeMockAppTree('postOnboard')

    act(() => {
      render(
        <Tree>
          <Home />
        </Tree>
      )

      fireEvent.click(screen.getByText('Withdraw'))
    })

    expect(routerPushMock).toHaveBeenCalledWith('/vault/withdraw?network=t')
  })
})
