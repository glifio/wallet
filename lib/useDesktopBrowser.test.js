import useDesktopBrowser from './useDesktopBrowser'
import { cleanup } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'

describe('useDesktopBrowser', () => {
  afterEach(cleanup)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('it does not redirect to the mobile error page on Mac Chrome desktop', async () => {
    const { navigator } = window
    const mockRouterReplace = jest.fn(() => {})
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementationOnce(() => ({
      replace: mockRouterReplace
    }))

    delete window.navigator
    window.navigator = {
      vendor: 'Google Inc.',
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36'
    }

    renderHook(() => useDesktopBrowser())
    expect(mockRouterReplace).not.toHaveBeenCalled()
    window.navigator = navigator
  })

  test('it does not redirect to the mobile error page on Edge', async () => {
    const { navigator } = window
    const mockRouterReplace = jest.fn(() => {})
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementationOnce(() => ({
      replace: mockRouterReplace
    }))

    delete window.navigator
    window.navigator = {
      vendor: 'Microsoft',
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Edge/537.36'
    }

    renderHook(() => useDesktopBrowser())
    expect(mockRouterReplace).not.toHaveBeenCalled()
    expect(mockRouterReplace).not.toHaveBeenCalledWith(
      '/error/use-desktop-browser'
    )
    window.navigator = navigator
  })

  test('it redirects to the mobile error page on Android Chrome', async () => {
    const { navigator } = window
    const mockRouterReplace = jest.fn(() => {})
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementationOnce(() => ({
      replace: mockRouterReplace
    }))

    delete window.navigator
    window.navigator = {
      vendor: 'Google Inc.',
      userAgent:
        'Mozilla/5.0 (Linux; Android 7.0; Moto G (5) Build/NPPS25.137-93-4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.109'
    }

    renderHook(() => useDesktopBrowser())
    expect(mockRouterReplace).toHaveBeenCalled()
    expect(mockRouterReplace).toHaveBeenCalledWith('/error/use-desktop-browser')
    window.navigator = navigator
  })

  test('it redirects to the mobile error page on Android Chrome', async () => {
    const { navigator } = window
    const mockRouterReplace = jest.fn(() => {})
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementationOnce(() => ({
      replace: mockRouterReplace
    }))

    delete window.navigator
    window.navigator = {
      vendor: 'Google Inc.',
      userAgent:
        'Mozilla/5.0 (Linux; Android 7.0; Moto G (5) Build/NPPS25.137-93-4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.109'
    }

    renderHook(() => useDesktopBrowser())
    expect(mockRouterReplace).toHaveBeenCalled()
    expect(mockRouterReplace).toHaveBeenCalledWith('/error/use-desktop-browser')
    window.navigator = navigator
  })

  test('it redirects to the mobile error page on IE on Windows NT tablet', async () => {
    const { navigator } = window
    const mockRouterReplace = jest.fn(() => {})
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementationOnce(() => ({
      replace: mockRouterReplace
    }))

    delete window.navigator
    window.navigator = {
      vendor: 'Google Inc.',
      userAgent:
        'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; Tablet PC 2.0; MAMD; .NET4.0C)'
    }

    renderHook(() => useDesktopBrowser())
    expect(mockRouterReplace).toHaveBeenCalled()
    expect(mockRouterReplace).toHaveBeenCalledWith('/error/use-desktop-browser')
    window.navigator = navigator
  })

  test('it redirects to the mobile error page on Safari on Apple phone', async () => {
    const { navigator } = window
    const mockRouterReplace = jest.fn(() => {})
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementationOnce(() => ({
      replace: mockRouterReplace
    }))

    delete window.navigator
    window.navigator = {
      vendor: 'Apple',
      userAgent: 'MobileSafari/604.1 CFNetwork/901.1 Darwin/17.6.0'
    }

    renderHook(() => useDesktopBrowser())
    expect(mockRouterReplace).toHaveBeenCalled()
    expect(mockRouterReplace).toHaveBeenCalledWith('/error/use-desktop-browser')
    window.navigator = navigator
  })
})
