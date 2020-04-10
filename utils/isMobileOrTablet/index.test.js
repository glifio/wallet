import isMobileOrTablet from '.'

describe('isMobileOrTablet', () => {
  test('returns false for Mac Chrome desktop', async () => {
    const { navigator, chrome } = window

    window.chrome = { app: {}, runtime: {}, loadTimes: () => {}, csi: () => {} }
    delete window.navigator
    window.navigator = {
      vendor: 'Google Inc.',
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36'
    }

    expect(isMobileOrTablet()).toBe(false)
    window.navigator = navigator
    window.chrome = chrome
  })

  test('returns false for Windows Chrome desktop', async () => {
    const { navigator } = window

    delete window.navigator
    window.navigator = {
      vendor: 'Microsoft',
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'
    }

    expect(isMobileOrTablet()).toBe(false)
    window.navigator = navigator
  })

  test('returns false for Edge desktop', async () => {
    const { navigator } = window

    delete window.navigator
    window.navigator = {
      vendor: 'Microsoft',
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Edge/537.36'
    }

    expect(isMobileOrTablet()).toBe(false)
    window.navigator = navigator
  })

  test('returns true for Apple Safari on phone', async () => {
    const { navigator } = window

    delete window.navigator
    window.navigator = {
      vendor: 'Apple',
      userAgent: 'MobileSafari/604.1 CFNetwork/901.1 Darwin/17.6.0'
    }

    expect(isMobileOrTablet()).toBe(true)
    window.navigator = navigator
  })

  test('returns true for Android Chrome on phone', async () => {
    const { navigator } = window

    delete window.navigator
    window.navigator = {
      vendor: 'Google Inc.',
      userAgent:
        'Mozilla/5.0 (Linux; Android 7.0; Moto G (5) Build/NPPS25.137-93-4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.109'
    }

    expect(isMobileOrTablet()).toBe(true)
    window.navigator = navigator
  })

  test('returns true for IE on Windows NT tablet', async () => {
    const { navigator } = window

    delete window.navigator
    window.navigator = {
      vendor: 'Apple',
      userAgent:
        'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; Tablet PC 2.0; MAMD; .NET4.0C)'
    }

    expect(isMobileOrTablet()).toBe(true)
    window.navigator = navigator
  })

  test('returns true for Android Chrome on tablet', async () => {
    const { navigator } = window

    delete window.navigator
    window.navigator = {
      vendor: 'Apple',
      userAgent:
        'Android Chrome Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36 Mozilla/5.0 (Linux; U; Android 4.2.2; nl-nl; SM-T310 Build/JDQ39) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30'
    }

    expect(isMobileOrTablet()).toBe(true)
    window.navigator = navigator
  })

  test('returns true for Android Firefox on tablet', async () => {
    const { navigator } = window

    delete window.navigator
    window.navigator = {
      vendor: 'Apple',
      userAgent:
        'Mozilla/5.0 (Android; Tablet; rv:29.0) Gecko/20100101 Firefox/29.0'
    }

    expect(isMobileOrTablet()).toBe(true)
    window.navigator = navigator
  })
})
