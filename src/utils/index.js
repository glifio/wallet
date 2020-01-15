export const shortenAddress = address => {
  const beginning = address.slice(0, 5)
  const end = address.slice(address.length - 5, address.length)
  return beginning + '...' + end
}

export const toLowerCaseMsgFields = msg => {
  const formattedMsg = {}
  for (let key in msg) {
    formattedMsg[key.toLowerCase()] = msg[key]
  }
  return formattedMsg
}

export const isValidBrowser = () => {
  const isChromium = window.chrome
  const winNav = window.navigator
  const vendorName = winNav.vendor
  const isOpera = typeof window.opr !== 'undefined'
  const isIEedge = winNav.userAgent.indexOf('Edge') > -1
  const isIOSChrome = winNav.userAgent.match('CriOS')

  if (isIOSChrome) {
    return false
  } else if (
    isChromium !== null &&
    typeof isChromium !== 'undefined' &&
    vendorName === 'Google Inc.' &&
    isOpera === false &&
    isIEedge === false
  ) {
    return true
  } else {
    return false
  }
}
