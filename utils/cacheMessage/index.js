import intersectionWith from 'lodash.intersectionwith'
import isEqual from 'lodash.isequal'
import difference from 'lodash.difference'

function checkClientSide() {
  if (typeof window === 'undefined') throw new Error('No storage')
}

const PENDING_MESSAGE_CACHE_PATH = 'PENDING-MSGS'

function getMessagesFromLS(address) {
  checkClientSide()
  const messages = window.localStorage.getItem(
    `${address}/${PENDING_MESSAGE_CACHE_PATH}`
  )

  if (messages) return JSON.parse(messages)
  return []
}

/**
 *
 * The idea here is that messages are cached until they show up on filfox
 *
 * Messages that are on filfox are stored as "confirmed" in redux
 * So if a message is confirmed by filfox, remove it from the cache (this happens in the use transaction history hook)
 * If a message is pending in redux, do not remove it, but do not add duplicate
 */
export function retrievePendingMsgsAndReconcileCache(address, messagesInRedux) {
  checkClientSide()
  const pendingMessages = difference(
    messagesInRedux.pending,
    getMessagesFromLS(address)
  )

  return difference(pendingMessages, messagesInRedux.confirmed)
}

export function setMessageInCache(address, message) {
  console.log('setting')
  checkClientSide()
  const messages = getMessagesFromLS(address)
  window.localStorage.setItem(
    `${address}/${PENDING_MESSAGE_CACHE_PATH}`,
    JSON.stringify([message, ...messages])
  )
}

export function pluckConfirmedMessagesFromCache(
  cachedMessages,
  confirmedMessages
) {
  console.log(cachedMessages, confirmedMessages)
}
