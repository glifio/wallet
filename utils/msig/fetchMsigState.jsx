import { FilecoinNumber } from '@openworklabs/filecoin-number'
import LotusRPCEngine from '@openworklabs/lotus-jsonrpc-engine'

import isAddressSigner from './isAddressSigner'
import isActorMsig from './isActorMsig'

export default async (actorID, signerAddress, onNotMsigCb, onNotSignerCb) => {
  const lotus = new LotusRPCEngine({
    apiAddress: process.env.LOTUS_NODE_JSONRPC
  })
  const { Balance, State } = await lotus.request(
    'StateReadState',
    actorID,
    null
  )

  if (!isActorMsig(State)) {
    return onNotMsigCb()
  }

  if (!(await isAddressSigner(lotus, signerAddress, State?.Signers))) {
    return onNotSignerCb()
  }

  const availableBalance = await lotus.request(
    'MsigGetAvailableBalance',
    actorID,
    null
  )
  const balance = new FilecoinNumber(Balance, 'attofil')

  return {
    Balance: balance,
    AvailableBalance: new FilecoinNumber(availableBalance, 'attofil'),
    ...State
  }
}
