export const formatFilscanMessages = messages =>
  messages.map(message => {
    const formattedMsg = {
      ...message.msg,
      cid: message.cid,
      paidFee: '0',
      maxFee: '0',
      timestamp: message.msgcreate
    }
    return formattedMsg
  })

export const formatFilscoutMessages = messages =>
  messages.map(message => {
    const formattedMsg = {
      ...message,
      paidFee: '0',
      maxFee: '0',
      timestamp: message.timestamp.toString()
    }
    return formattedMsg
  })
