import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { confirmedMessage } from '../store/actions'
import { useWalletProvider } from '../WalletProvider'

export default () => {
  const dispatch = useDispatch()
  const { pendingMsgs } = useSelector(state => ({
    pendingMsgs: state.messages.pending
  }))
  const { walletProvider } = useWalletProvider()
  const listenForMsgConfirmation = useCallback(
    msgCid => {
      let listenerSubscribed = true
      const confirm = async () => {
        if (listenerSubscribed) {
          try {
            const { Receipt } = await walletProvider.jsonRpcEngine.request(
              'StateWaitMsg',
              {
                '/': msgCid
              }
            )
            if (Receipt.ExitCode === 0) {
              dispatch(confirmedMessage(msgCid))
            }
          } catch (err) {
            if (err.message.includes('504')) await confirm(msgCid)
            else throw new Error(err)
          }
        }
      }
      const unsubscribe = () => {
        listenerSubscribed = false
      }
      confirm()
      return unsubscribe
    },
    [dispatch, walletProvider]
  )

  useEffect(() => {
    if (pendingMsgs.length > 0 && walletProvider) {
      const unsubscribers = pendingMsgs.map(msg =>
        listenForMsgConfirmation(msg.cid)
      )
      // cleanup effects
      return () => unsubscribers.forEach(unsubscribe => unsubscribe())
    }
  }, [listenForMsgConfirmation, dispatch, pendingMsgs, walletProvider])

  return null
}
