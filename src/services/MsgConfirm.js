import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Lotus } from '@openworklabs/lotus-block-explorer'
import { confirmedMessages } from '../store/actions'

export const MsgConfirm = () => {
  const dispatch = useDispatch()
  const pendingMsgs = useSelector(({ messages }) => messages.pending)

  useEffect(() => {
    if (pendingMsgs.length > 0) {
      const lotus = new Lotus({
        jsonrpcEndpoint: 'https://lotus-dev.temporal.cloud/rpc/v0'
      })

      const subscribeCb = chainState => {
        const confirmedMsgs = []
        const newPendingMsgs = pendingMsgs.filter(msg => {
          confirmedMsgs.push(msg)
          return false
        })

        dispatch(confirmedMessages(confirmedMsgs, newPendingMsgs))

        if (newPendingMsgs.length === 0) {
          lotus.store.unsubscribe(subscribeCb)
          lotus.stopListening()
        }
      }

      const timeout = setTimeout(subscribeCb, 3000)

      return () => {
        clearTimeout(timeout)
      }
    }
  }, [pendingMsgs, dispatch])

  return null
}
