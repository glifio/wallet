import isDesktopChromeBrowser from '.'

describe('isDesktopChromeBrowser', () => {
  test('it invalidates IOSChrome', async () => {
    const { navigator } = window

    delete window.navigator
    window.navigator = {
      vendor: 'Apple Inc.',
      userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1'
    }

    expect(isDesktopChromeBrowser()).toBe(false)
    window.navigator = navigator
  })

  test('it invalidates undefined Chrome', async () => {
    const { chrome } = window

    delete window.chrome
    delete window.navigator
    window.navigator = {
      vendor: 'Google Inc.',
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36'
    }

    expect(isDesktopChromeBrowser()).toBe(false)
    window.navigator = navigator
    window.chrome = chrome
  })

  test('it validates Chrome', async () => {
    const { navigator, chrome } = window

    window.chrome = { app: {}, runtime: {}, loadTimes: () => {}, csi: () => {} }
    delete window.navigator
    window.navigator = {
      vendor: 'Google Inc.',
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36'
    }

    expect(isDesktopChromeBrowser()).toBe(true)
    window.navigator = navigator
    window.chrome = chrome
  })

  test('it invalidates Opera', async () => {
    const { opr } = window

    delete window.opr
    window.opr = {
      browserSidebarPrivate: {},
      defaultBrowserPrivate: {},
      importPrivate: {},
      powerSavePrivate: {},
      snapPrivate: {}
    }

    expect(isDesktopChromeBrowser()).toBe(false)
    window.opr = opr
  })

  test('it invalidates Edge', async () => {
    const { navigator } = window

    delete window.navigator
    window.navigator = {
      vendor: 'Microsoft',
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Edge/537.36'
    }

    expect(isDesktopChromeBrowser()).toBe(false)
    window.navigator = navigator
  })
})
