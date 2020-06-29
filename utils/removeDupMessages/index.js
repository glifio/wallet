/** NOTE - */
export default (oldMessages, newMessages) => {
  const cids = new Set(newMessages.map(msg => msg.cid))
  return oldMessages
    .reduce(
      (uniqueMessageArr, message) => {
        if (!cids.has(message.cid)) {
          cids.add(message.cid)
          uniqueMessageArr.push(message)
        }
        return uniqueMessageArr
      },
      [...newMessages]
    )
    .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
}
