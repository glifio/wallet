import { FilecoinNumber } from '@glif/filecoin-number'
import LotusRPCEngine from '@glif/filecoin-rpc-client'
import { CID } from '@glif/filecoin-wallet-provider'

import isAddressSigner from './isAddressSigner'
import { decodeActorCID } from '../actorCode'
import { MsigActorState, emptyMsigState } from '../../MsigProvider/types'

const lCli = new LotusRPCEngine({
  apiAddress: process.env.LOTUS_NODE_JSONRPC
})

export default async function fetchMsigState(
  actorID: string,
  signerAddress: string
): Promise<MsigActorState> {
  try {
    const { Code } = await lCli.request<{ Code: CID }>(
      'StateGetActor',
      actorID,
      null
    )

    const ActorCode = decodeActorCID(Code['/'])

    if (!ActorCode?.includes('multisig')) {
      return {
        ...emptyMsigState,
        errors: {
          notMsigActor: true,
          connectedWalletNotMsigSigner: false,
          actorNotFound: false,
          unhandledError: ''
        }
      }
    }

    const { Balance, State } = await lCli.request<{
      Balance: FilecoinNumber
      State: {
        InitialBalance: string
        NextTxnID: number
        NumApprovalsThreshold: number
        Signers: string[]
        StartEpoch: number
        UnlockDuration: number
      }
    }>('StateReadState', actorID, null)

    const [availableBalance, accountKeys] = await Promise.all([
      lCli.request<string>('MsigGetAvailableBalance', actorID, null),
      Promise.all(
        State?.Signers.map((s) =>
          lCli.request<string>('StateAccountKey', s, null)
        )
      )
    ])

    if (!(await isAddressSigner(lCli, signerAddress, State?.Signers))) {
      return {
        ...emptyMsigState,
        errors: {
          notMsigActor: false,
          connectedWalletNotMsigSigner: true,
          actorNotFound: false,
          unhandledError: ''
        }
      }
    }

    return {
      Address: actorID,
      Balance: new FilecoinNumber(Balance, 'attofil'),
      AvailableBalance: new FilecoinNumber(availableBalance, 'attofil'),
      Signers: State.Signers.map((id, idx) => ({
        // f0 address
        id,
        // non f0 address
        account: accountKeys[idx]
      })),
      ActorCode,
      InitialBalance: new FilecoinNumber(State.InitialBalance, 'attofil'),
      NextTxnID: State.NextTxnID,
      NumApprovalsThreshold: State.NumApprovalsThreshold,
      StartEpoch: State.StartEpoch,
      UnlockDuration: State.UnlockDuration,
      errors: {
        notMsigActor: false,
        connectedWalletNotMsigSigner: false,
        actorNotFound: false,
        unhandledError: ''
      }
    }
  } catch (err) {
    if (err?.message?.includes('actor not found')) {
      return {
        ...emptyMsigState,
        errors: {
          notMsigActor: false,
          connectedWalletNotMsigSigner: false,
          actorNotFound: true,
          unhandledError: ''
        }
      }
    }

    if (err?.message?.includes('unknown actor code')) {
      return {
        ...emptyMsigState,
        errors: {
          notMsigActor: true,
          connectedWalletNotMsigSigner: false,
          actorNotFound: false,
          unhandledError: ''
        }
      }
    }

    return {
      ...emptyMsigState,
      errors: {
        notMsigActor: false,
        connectedWalletNotMsigSigner: false,
        actorNotFound: false,
        unhandledError: err?.message || err
      }
    }
  }
}
