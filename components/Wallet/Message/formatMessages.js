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
      gaslimit: message.gas_limit.toString(),
      gasprice: message.gas_price.toString(),
      gas_used: message.gas_used.toString(),
      timestamp: message.timestamp.toString()
    }
    return formattedMsg
  })
