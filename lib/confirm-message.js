import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import confirmMessage from '@glif/filecoin-message-confirmer'

import { confirmedMessage } from '../store/actions'

const MessageConfirmer = () => {
  const dispatch = useDispatch()
  const pendingMsgs = useSelector((state) => state.messages.pending)

  const pendingCIDsRef = useRef(new Set([]))

  useEffect(() => {
    // if there are pending messages in state, we go ahead and try to confirm all of them in parallel
    if (pendingMsgs.length > 0) {
      pendingMsgs.map(async (msg) => {
        if (!pendingCIDsRef.current.has(msg.cid)) {
          pendingCIDsRef.current.add(msg.cid)
          const confirmed = await confirmMessage(msg.cid, {
            apiAddress: process.env.LOTUS_NODE_JSONRPC
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
