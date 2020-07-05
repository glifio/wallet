import { useCallback } from 'react'
import { useWasm } from '../lib/WasmLoader'
import { useWalletProvider } from '../WalletProvider'
import useWallet from '../WalletProvider/useWallet'

export const useMsig = msigActorID => {
  const {
    createMultisig,
    proposeMultisig,
    transactionSerialize,
    transactionSignLotus
  } = useWasm()
  const { walletProvider } = useWalletProvider()
  const { path } = useWallet()

  console.log(path)
  const init = async () => {}

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

    console.log(serializedMsg)

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
