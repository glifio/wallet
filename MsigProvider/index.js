import { useEffect, useState } from 'react'
import { FilecoinNumber } from '@openworklabs/filecoin-number'
import LotusRPCEngine from '@openworklabs/lotus-jsonrpc-engine'
import { useWalletProvider } from '../WalletProvider'
import reportError from '../utils/reportError'

const emptyActorState = {
  Balance: new FilecoinNumber('4999', 'attofil'),
  AvailableBalance: new FilecoinNumber('4999', 'attofil')
}

// Taking a small shortcut here for now, this hook should only be called once per msig
export const useMsig = msigActorID => {
  const { walletProvider } = useWalletProvider()
  const [actorState, setActorState] = useState(null)

  useEffect(() => {
    const fetchActorState = async () => {
      const lotus = new LotusRPCEngine({
        apiAddress: process.env.LOTUS_NODE_JSONRPC
      })
      try {
        const res = await Promise.all([
          lotus.request('StateReadState', msigActorID, null),
          lotus.request('MsigGetAvailableBalance', msigActorID, null)
        ])

        if (res.length === 2) {
          const nextState = {
            Balance: new FilecoinNumber(res[0].Balance, 'attofil'),
            AvailableBalance: new FilecoinNumber(res[1], 'attofil'),
            ...res[0].State
          }
          setActorState(nextState)
        } else {
          reportError(
            21,
            true,
            'Something went wrong fetching msig states, without catching an error'
          )
        }
      } catch (err) {
        reportError(22, true, err.message, err.stack)
      }
    }
    if (!actorState && msigActorID) {
      fetchActorState()
    }
  }, [actorState, msigActorID, setActorState, walletProvider])
  if (!actorState) return emptyActorState
  return { Address: msigActorID, ...actorState }
}
