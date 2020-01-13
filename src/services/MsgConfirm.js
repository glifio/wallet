import { useEffect, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { confirmedMessage } from '../store/actions'

export default () => {
  const dispatch = useDispatch()
  const { pendingMsgs, walletProvider } = useSelector(state => ({
    confirmedMsgs: state.messages.confirmed,
    pendingMsgs: state.messages.pending,
    walletProvider: state.walletProvider
  }))
  const listenForMsgConfirmation = useCallback(
    async msgCid => {
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
        await listenForMsgConfirmation(msgCid)
      }
    },
    [dispatch, walletProvider]
  )

  useEffect(() => {
    if (pendingMsgs.length > 0) {
      pendingMsgs.forEach(msg => listenForMsgConfirmation(msg.cid))
    }
  }, [listenForMsgConfirmation, dispatch, pendingMsgs])

  return null
}
