import { useEffect, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { confirmedMessage } from '../store/actions'
import { useWalletProvider } from '../WalletProvider'

export default () => {
  const dispatch = useDispatch()
  const { pendingMsgs } = useSelector(state => ({
    pendingMsgs: state.messages.pending
  }))
  const { walletProvider } = useWalletProvider()
  const timeout = useRef()
  timeout.current = {}

  const confirm = useCallback(
    (msgCid, provider) => {
      if (timeout.current[msgCid]) {
        clearTimeout(timeout.current[msgCid])
      }

      timeout.current[msgCid] = setTimeout(async () => {
        try {
          const res = await provider.jsonRpcEngine.request('StateWaitMsg', {
            '/': msgCid
          })
          if (res && res.Receipt.ExitCode === 0) {
            dispatch(confirmedMessage(msgCid))
          } else {
            return confirm(msgCid, provider)
          }
        } catch (err) {
          if (err.message.includes('504')) return confirm(msgCid, provider)
          throw new Error(err)
        }
      }, 3000)
    },
    [dispatch]
  )

  useEffect(() => {
    if (pendingMsgs.length > 0 && walletProvider) {
      pendingMsgs.map(msg => confirm(msg.cid, walletProvider))
    }
  }, [confirm, dispatch, pendingMsgs, walletProvider])

  return null
}
