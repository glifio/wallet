export function uniqueifyMsgs(oldMessages, newMessages) {
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

export function pluckConfirmed(pending, confirmed) {
  const confirmedCids = new Set(confirmed.map(msg => msg.cid))
  return pending
    .filter(msg => !confirmedCids.has(msg.cid))
    .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
}
