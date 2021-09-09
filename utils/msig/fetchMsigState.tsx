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
        Signers: string[]
        StartEpoch: number
        UnlockDuration: number
      }
    }>('StateReadState', actorID, null)

    const [{ Code }, availableBalance] = await Promise.all([
      lCli.request<{ Code: { '/': string } }>('StateGetActor', actorID, null),
      lCli.request<string>('MsigGetAvailableBalance', actorID, null)
    ])

    const [{ data: ActorCode }, accountKeys] = await Promise.all([
      // get the actorCode so we can properly deserialize params in the future
      // and check to make sure this is a supported actor type
      axios.get<string>(`https://ipfs.io/ipfs/${Code['/']}`),
      // for each signer, compute their account key so we have both in state for later use
      Promise.all(
        State?.Signers.map(s => lCli.request('StateAccountKey', s, null))
      )
    ])

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
