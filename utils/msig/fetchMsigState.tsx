import { FilecoinNumber } from '@glif/filecoin-number'
import LotusRPCEngine from '@glif/filecoin-rpc-client'
import axios from 'axios'

import isAddressSigner from './isAddressSigner'
import { MsigActorState, emptyMsigState } from '../../MsigProvider/types'

const lCli = new LotusRPCEngine({
  apiAddress: process.env.LOTUS_NODE_JSONRPC
})

export default async function fetchMsigState(
  actorID: string,
  signerAddress: string
): Promise<MsigActorState> {
  try {
    const { Balance, State } = await lCli.request<{
      Balance: FilecoinNumber
      State: {
        InitialBalance: string
        NextTxnID: number
        NumApprovalsThreshold: number
        PendingTxns: any
        Signers: string[]
        StartEpoch: number
        UnlockDuration: number
      }
    }>('StateReadState', actorID, null)
    const { Code } = await lCli.request('StateGetActor', actorID, null)
    const { data: ActorCode } = await axios.get<string>(
      `https://ipfs.io/ipfs/${Code['/']}`
    )

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

    return {
      Address: '',
      Balance: new FilecoinNumber('0', 'fil'),
      AvailableBalance: new FilecoinNumber('0', 'fil'),
      loading: false,
      Signers: State.Signers,
      PendingTxns: State.PendingTxns,
      ActorCode,
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
