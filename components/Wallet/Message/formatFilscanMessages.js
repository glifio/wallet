export default messages =>
  messages.map(message => {
    const formattedMsg = {
      ...message.msg,
      cid: message.cid,
      gas_used: '122'
    }
    return formattedMsg
  })
