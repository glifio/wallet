import useDesktopBrowser from './useDesktopBrowser'

const mockRouterReplace = jest.fn(() => {})
const useRouter = jest.spyOn(require('next/router'), 'useRouter')
useRouter.mockImplementationOnce(() => ({
  replace: mockRouterReplace
}))

describe('useDesktopBrowser', () => {
  test('it renders its children when a valid wallet is passed as a prop', async () => {
    const { navigator } = window

    delete window.navigator
    window.navigator = {
      vendor: 'Microsoft',
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Edge/537.36'
    }

    useDesktopBrowser()
    expect(mockRouterReplace).not.toHaveBeenCalled()
    expect(mockRouterReplace).not.toHaveBeenCalledWith(
      '/error/use-desktop-browsers'
    )
    window.navigator = navigator
  })
})
