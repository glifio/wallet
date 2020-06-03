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
          // needed until https://github.com/filecoin-project/lotus/issues/1907 is fixed
          if (err.message.includes('address not found'))
            return confirm(msgCid, provider, 10000)
          throw new Error(err)
        }
      }, optionalTimer || 3000)
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
