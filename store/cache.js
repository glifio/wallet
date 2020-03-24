const storage = {
  getItem: () => {},
  setItem: () => {}
}

/*
  We use local storage to keep track of pending messages that have yet to be confirmed, 
  and confirmed messages that have yet to make it to the chainwatch database on our backend
  The object in localstorage looks like this:
  {
    messages: {
      address1: [
        {
          ...msgFields,
          confirmed: false
        },
        msgCid2: {
          ...msgFields,
          confirmed: true
        }
      ]
    }
  }
*/

/*
  returns an object that looks like:
  {
    confirmedMsgs: [msg1, msg2],
    pendingMsgs: [msg1]
  }
  Confirmed messages are only those that have been confirmed in the network, but not captured in our database yet
*/
export const getMsgsFromCache = address => {
  const messages = JSON.parse(storage.getItem('messages')) || {}
  return messages[address] || []
}

export const setMsgInCache = message => {
  const messages = JSON.parse(storage.getItem('messages')) || {}
  const messagesByAddress = messages[message.from] || []
  const newMessagesByAddress = [message, ...messagesByAddress]
  const updatedMessagesInCache = {
    ...messages,
    [message.from]: newMessagesByAddress
  }

  storage.setItem('messages', JSON.stringify(updatedMessagesInCache))
}

export const removeMsgFromCache = (address, msgCid) => {
  const messages = JSON.parse(storage.getItem('messages')) || {}
  const messagesByAddress = messages[address] || []
  const newMessagesByAddress = messagesByAddress.filter(
    msg => msg.cid !== msgCid
  )
  const updatedMessagesInCache = {
    ...messages,
    [address]: newMessagesByAddress
  }

  storage.setItem('messages', JSON.stringify(updatedMessagesInCache))
}
