import { FilecoinNumber } from '@glif/filecoin-number'
import LotusRPCEngine from '@glif/filecoin-rpc-client'

import isAddressSigner from './isAddressSigner'
import isActorMsig from './isActorMsig'
import isSupportedMsig from './isSupportedMsig'

export default async (
  actorID,
  signerAddress,
  onNotMsigCb,
  onNotSignerCb,
  onNotSupportedMsigCb
) => {
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

  if (!isSupportedMsig(State)) {
    return onNotSupportedMsigCb()
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
