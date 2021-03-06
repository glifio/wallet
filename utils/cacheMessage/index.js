function checkClientSide() {
  if (typeof window === 'undefined') throw new Error('No storage')
}

const PENDING_MESSAGE_CACHE_PATH = 'PENDING-MSGS'

export function getMessagesFromCache(address) {
  checkClientSide()
  const messages = window.localStorage.getItem(
    `${address}/${PENDING_MESSAGE_CACHE_PATH}`
  )

  if (messages) return JSON.parse(messages)
  return []
}

export function setMessageInCache(address, message) {
  checkClientSide()
  const messages = getMessagesFromCache(address)
  window.localStorage.setItem(
    `${address}/${PENDING_MESSAGE_CACHE_PATH}`,
    JSON.stringify([message, ...messages])
  )
}

export function removeMessageFromCache(address, messageCid) {
  const cachedMessages = getMessagesFromCache(address)
  const newMessages = cachedMessages.filter(msg => msg.cid !== messageCid)
  window.localStorage.setItem(
    `${address}/${PENDING_MESSAGE_CACHE_PATH}`,
    JSON.stringify(newMessages)
  )
}
