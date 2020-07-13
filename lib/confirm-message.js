import { useEffect, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { confirmedMessage } from '../store/actions'
import { useWalletProvider } from '../WalletProvider'
import reportError from '../utils/reportError'

export default () => {
  const dispatch = useDispatch()
  const { pendingMsgs } = useSelector(state => ({
    pendingMsgs: state.messages.pending
  }))
  const { walletProvider } = useWalletProvider()
  const timeout = useRef()
  timeout.current = {}

  const confirm = useCallback(
    (msgCid, provider, optionalTimer) => {
      if (timeout.current[msgCid]) {
        clearTimeout(timeout.current[msgCid])
      }

      timeout.current[msgCid] = setTimeout(async () => {
        try {
          const res = await provider.jsonRpcEngine.request('StateSearchMsg', {
            '/': msgCid
          })
          if (res && res.Receipt.ExitCode === 0) {
            dispatch(confirmedMessage(msgCid))
          } else {
            return confirm(msgCid, provider)
          }
        } catch (err) {
          if (err.message.includes('504')) return confirm(msgCid, provider)
          // if this fails, its going to look like the message is confirming forever
          reportError(2, false, err.message, err.stack)
        }
      }, optionalTimer || 3000)
    },
    [dispatch]
  )

  useEffect(() => {
    // if there are pending messages in state, we go ahead and try to confirm all of them in parallel
    if (pendingMsgs.length > 0 && walletProvider) {
      pendingMsgs.map(msg => confirm(msg.cid, walletProvider))
    }
  }, [confirm, dispatch, pendingMsgs, walletProvider])

  return null
}
