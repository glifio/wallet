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
            // TODO: get a proper error message from StateWaitMsg, so we know not to fetch again if a bad error occured
            await confirm(msgCid)
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
  }, [listenForMsgConfirmation, dispatch, pendingMsgs])

  return null
}
