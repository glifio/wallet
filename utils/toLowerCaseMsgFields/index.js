export default msg => {
  const formattedMsg = {}
  Object.keys(msg).forEach(key => {
    formattedMsg[key.toLowerCase()] = msg[key]
  })
  return formattedMsg
}
