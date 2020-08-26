export const formatFilscanMessages = messages =>
  messages.map(message => {
    const formattedMsg = {
      ...message.msg,
      cid: message.cid,
      gas_used: '122',
      timestamp: message.msgcreate
    }
    return formattedMsg
  })

export const formatFilscoutMessages = messages =>
  messages.map(message => {
    const formattedMsg = {
      ...message,
      gas_used: '0',
      timestamp: message.timestamp.toString()
    }
    return formattedMsg
  })
