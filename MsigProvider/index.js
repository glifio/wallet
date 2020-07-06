import { useEffect, useState } from 'react'
import { FilecoinNumber } from '@openworklabs/filecoin-number'
import LotusRPCEngine from '@openworklabs/lotus-jsonrpc-engine'
import { useWasm } from '../lib/WasmLoader'
import { useWalletProvider } from '../WalletProvider'

const emptyActorState = {
  Balance: new FilecoinNumber('4999', 'attofil'),
  AvailableBalance: new FilecoinNumber('4999', 'attofil')
}

// Taking a small shortcut here for now, this hook should only be called once per msig
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
          Balance: new FilecoinNumber(res[0].Balance, 'attofil'),
          AvailableBalance: new FilecoinNumber(res[1], 'attofil'),
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

  // const createActor = useCallback(async () => {
  //   const createMsg = await createMultisig(
  //     't3vp4tgaz7shvxyqainnsbz62o3jbgz2cq4nz5jk7chve6cbg236spb5kogaiclwv23t67yxm5dfkf5rdwjdrq',
  //     [
  //       't3vp4tgaz7shvxyqainnsbz62o3jbgz2cq4nz5jk7chve6cbg236spb5kogaiclwv23t67yxm5dfkf5rdwjdrq'
  //     ],
  //     '1000',
  //     1
  //   )

  //   const serializedMsg = transactionSerialize(createMsg)
  //   return serializedMsg
  // }, [createMultisig, transactionSerialize])

  // const propose = useCallback(async () => {
  //   const to = 't137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizpy'
  //   const from = 't137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizpy'

  //   const proposal = proposeMultisig('t01003', to, from, '1')
  //   proposal.nonce = await walletProvider.getNonce(from)
  //   const privateKey = 'YbDPh1vq3fBClzbiwDt6WjniAdZn8tNcCwcBO2hDwyk='
  //   const sig = transactionSignLotus(proposal, privateKey)
  // }, [proposeMultisig, walletProvider, transactionSignLotus])
  if (!actorState) return emptyActorState
  return { Address: msigActorID, ...actorState }
}
