import { useCallback, useEffect, useState } from 'react'
import LotusRPCEngine from '@openworklabs/lotus-jsonrpc-engine'
import { useWasm } from '../lib/WasmLoader'
import { useWalletProvider } from '../WalletProvider'

export const useMsig = msigActorID => {
  const {
    createMultisig,
    proposeMultisig,
    transactionSerialize,
    transactionSignLotus,
    serializeParams
  } = useWasm()
  const { walletProvider } = useWalletProvider()
  const [actorState, setActorState] = useState(null)

  useEffect(() => {
    const fetchActorState = async () => {
      const lotus = new LotusRPCEngine({
        apiAddress: process.env.LOTUS_NODE_JSONRPC
      })
      const res = await Promise.all([
        lotus.request('StateReadState', msigActorID, null),
        lotus.request('MsigGetAvailableBalance', msigActorID, null)
      ])

      if (res.length === 2) {
        const nextState = {
          balance: res[0].Balance,
          availableBalance: res[1],
          ...res[0].State
        }
        setActorState(nextState)
      } else {
        // handle errors
      }
    }
    if (!actorState && msigActorID) {
      fetchActorState()
    }
  }, [actorState, msigActorID, setActorState, walletProvider])

  const createActor = useCallback(async () => {
    const createMsg = await createMultisig(
      't3vp4tgaz7shvxyqainnsbz62o3jbgz2cq4nz5jk7chve6cbg236spb5kogaiclwv23t67yxm5dfkf5rdwjdrq',
      [
        't3vp4tgaz7shvxyqainnsbz62o3jbgz2cq4nz5jk7chve6cbg236spb5kogaiclwv23t67yxm5dfkf5rdwjdrq'
      ],
      '1000',
      1
    )

    const serializedMsg = transactionSerialize(createMsg)
    return serializedMsg
  }, [createMultisig, transactionSerialize])

  const propose = useCallback(async () => {
    const to = 't137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizpy'
    const from = 't137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizpy'

    const proposal = proposeMultisig('t01003', to, from, '1')
    proposal.nonce = await walletProvider.getNonce(from)
    const privateKey = 'YbDPh1vq3fBClzbiwDt6WjniAdZn8tNcCwcBO2hDwyk='
    const sig = transactionSignLotus(proposal, privateKey)

    console.log(sig)
  }, [proposeMultisig, walletProvider, transactionSignLotus])
  return { createActor, propose }
}
