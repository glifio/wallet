import { cleanup, render, act, fireEvent } from '@testing-library/react'
import composeMockAppTree from '../../../test-utils/composeMockAppTree'
import ErrorView from '.'

describe('Error', () => {
  afterEach(cleanup)
  test('renders the error', () => {
    const { Tree } = composeMockAppTree('preOnboard')
    const { container } = render(
      <Tree>
        <ErrorView
          title='Ledger only supports Chrome'
          description='Please install Google Chrome to continue using your Ledger device, or choose an alternative setup option'
          linkDisplay='Install Google Chrome.'
          linkhref='https://www.google.com/chrome'
        />
      </Tree>
    )
    expect(container.firstChild).toMatchSnapshot()
  })

  test('renders the error with the correct text', () => {
    const { Tree } = composeMockAppTree('preOnboard')
    const { getByText } = render(
      <Tree>
        <ErrorView
          title='Ledger only supports Chrome'
          description='Please install Google Chrome to continue using your Ledger device, or choose an alternative setup option'
          linkDisplay='Install Google Chrome.'
          linkhref='https://www.google.com/chrome'
        />
      </Tree>
    )

    expect(getByText('Ledger only supports Chrome')).toBeTruthy()
    expect(
      getByText(
        'Please install Google Chrome to continue using your Ledger device, or choose an alternative setup option'
      )
    ).toBeTruthy()
    expect(getByText('Install Google Chrome.')).toBeTruthy()
  })

  test('clicking "Back" takes you back to onboarding', () => {
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    const mockRouterReplace = jest.fn(() => {})
    useRouter.mockImplementationOnce(() => ({
      replace: mockRouterReplace,
      query: 'network=t'
    }))

    const { Tree } = composeMockAppTree('preOnboard')
    const { getByText } = render(
      <Tree>
        <ErrorView
          title='Ledger only supports Chrome'
          description='Please install Google Chrome to continue using your Ledger device, or choose an alternative setup option'
          linkDisplay='Install Google Chrome.'
          linkhref='https://www.google.com/chrome'
        />
      </Tree>
    )

    act(() => {
      fireEvent.click(getByText('Back'))
    })

    expect(mockRouterReplace).toHaveBeenCalled()
    expect(mockRouterReplace).toHaveBeenCalledWith('/')
  })
})
