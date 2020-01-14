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
