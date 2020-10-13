import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import confirmMessage from '@glif/filecoin-message-confirmer'

import { confirmedMessage } from '../store/actions'

export default () => {
  const dispatch = useDispatch()
  const { pendingMsgs } = useSelector(state => ({
    pendingMsgs: state.messages.pending
  }))

  useEffect(() => {
    // if there are pending messages in state, we go ahead and try to confirm all of them in parallel
    if (pendingMsgs.length > 0) {
      pendingMsgs.map(async msg => {
        const confirmed = await confirmMessage(msg.cid)
        if (confirmed) dispatch(confirmedMessage(msg.cid))
      })
    }
  }, [dispatch, pendingMsgs])

  return null
}
