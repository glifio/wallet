export default msg => {
  const formattedMsg = {}
  Object.keys(msg).forEach(key => {
    // lowercases the first letter only
    const newKey = `${key[0].toLowerCase()}${key.slice(1)}`
    formattedMsg[newKey] = msg[key]
  })
  return formattedMsg
}
