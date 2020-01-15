const storage = window.localStorage

/*
  We use local storage to keep track of pending messages that have yet to be confirmed, 
  and confirmed messages that have yet to make it to the chainwatch database on our backend

  The object in localstorage looks like this:

  {
    messages: {
      address1: {
        msgCid1: {
          ...msgFields,
          confirmed: false
        },
        msgCid2: {
          ...msgFields,
          confirmed: true
        }
      }
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
  const messages = storage.getItem('messages') || {}
  const confirmedMsgs = []
  const pendingMsgs = []
  const messagesByAddress = messages[address] || {}

  for (let message in messagesByAddress) {
    const { confirmed } = message.confirmed
    delete message.confirmed
    if (confirmed) confirmedMsgs.push(message)
    else pendingMsgs.push(message)
  }

  return {
    confirmedMsgs,
    pendingMsgs
  }
}

export const setInCache = message => {
  // const currentUserMsgs = storage.getItem(message.from) || {}
}
