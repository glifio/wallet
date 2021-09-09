import { FilecoinNumber } from '@glif/filecoin-number'

export interface MsigActorErrors {
  notMsigActor: boolean
  connectedWalletNotMsigSigner: boolean
  actorNotFound: boolean
  unhandledError: string
}

export interface MsigActorState {
  Address: string | null
  ActorCode: string
  Balance: FilecoinNumber
  AvailableBalance: FilecoinNumber
  loading: boolean
  Signers: string[]
  PendingTxns: any
  errors: MsigActorErrors
}

export const emptyMsigState: MsigActorState = {
  Address: '',
  ActorCode: '',
  Balance: new FilecoinNumber('0', 'fil'),
  AvailableBalance: new FilecoinNumber('0', 'fil'),
  loading: true,
  Signers: [],
  PendingTxns: {},
  errors: {
    notMsigActor: false,
    connectedWalletNotMsigSigner: false,
    actorNotFound: true,
    unhandledError: ''
  }
}
