const getMsgsUntilCustodyTaken = async (messages) => {
  let go = true
  const messagePool = [...messages]
  const relevantMessages = []
  while (go && messagePool.length > 0) {
    const message = messagePool.shift()
    relevantMessages.push(message)
    if (message.params?.method === 6) {
      go = false
    }
  }

  return relevantMessages
}

export default getMsgsUntilCustodyTaken
