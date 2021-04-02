import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import confirmMessage from '@glif/filecoin-message-confirmer'

import { getMessagesFromCache } from '../utils/cacheMessage'
import { confirmedMessage, populateRedux } from '../store/actions'

const MessageConfirmer = () => {
  const dispatch = useDispatch()
  const { pendingMsgs, address } = useSelector(state => {
    const { address } = state.wallets[state.selectedWalletIdx]
    return { pendingMsgs: state.messages.pending, address }
  })

  useEffect(() => {
    const messages = getMessagesFromCache(address)
    dispatch(populateRedux(messages))
  }, [address, dispatch])

  const pendingCIDsRef = useRef(new Set([]))

  useEffect(() => {
    // if there are pending messages in state, we go ahead and try to confirm all of them in parallel
    if (pendingMsgs.length > 0) {
      pendingMsgs.map(async msg => {
        if (!pendingCIDsRef.current.has(msg.cid)) {
          pendingCIDsRef.current.add(msg.cid)
          const confirmed = await confirmMessage(msg.cid, {
            apiAddress: process.env.LOTUS_NODE_JSONRPC,
            timeoutAfter: 500
          })
          if (confirmed) {
            pendingCIDsRef.current.delete(msg.cid)
            dispatch(confirmedMessage(msg.cid))
          }
        }
      })
    }
  }, [dispatch, pendingMsgs])

  return null
}

export default MessageConfirmer
