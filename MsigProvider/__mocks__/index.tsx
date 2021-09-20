import { FilecoinNumber } from '@glif/filecoin-number'
import { createContext, ReactNode, Dispatch, useContext } from 'react'
import { SWRConfig } from 'swr'
import { MsigActorState } from '../../MsigProvider/types'

export const MULTISIG_ACTOR_ADDRESS =
  'f2m4f2dv7m35skytoqzsyrh5wqz3kxxfflxsha5za'
export const MULTISIG_SIGNER_ADDRESS =
  'f1nq5k2mps5umtebdovlyo7y6a3ywc7u4tobtuo3a'

const MsigProviderContextMock = createContext<
  MsigActorState & {
    setMsigActor: null | Dispatch<string | null>
  } & { loading: boolean }
>({
  Address: MULTISIG_ACTOR_ADDRESS,
  ActorCode: 'fil/5/multisig',
  Balance: new FilecoinNumber('1', 'fil'),
  AvailableBalance: new FilecoinNumber('1', 'fil'),
  Signers: [
    {
      account: MULTISIG_SIGNER_ADDRESS,
      id: 't01234'
    }
  ],
  InitialBalance: new FilecoinNumber('1', 'fil'),
  NextTxnID: 0,
  NumApprovalsThreshold: 1,
  StartEpoch: 0,
  UnlockDuration: 0,
  errors: {
    notMsigActor: false,
    connectedWalletNotMsigSigner: false,
    actorNotFound: true,
    unhandledError: ''
  },
  loading: false,
  setMsigActor: null
})

export const MsigProviderWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <SWRConfig value={{ dedupingInterval: 0 }}>
      <MsigProviderContextMock.Provider
        value={{
          Address: 'f2m4f2dv7m35skytoqzsyrh5wqz3kxxfflxsha5za',
          ActorCode: 'fil/5/multisig',
          Balance: new FilecoinNumber('1', 'fil'),
          AvailableBalance: new FilecoinNumber('1', 'fil'),
          Signers: [],
          InitialBalance: new FilecoinNumber('1', 'fil'),
          NextTxnID: 0,
          NumApprovalsThreshold: 1,
          StartEpoch: 0,
          UnlockDuration: 0,
          errors: {
            notMsigActor: false,
            connectedWalletNotMsigSigner: false,
            actorNotFound: true,
            unhandledError: ''
          },
          loading: false,
          setMsigActor: () => {}
        }}
      >
        {children}
      </MsigProviderContextMock.Provider>
    </SWRConfig>
  )
}

export const useMsig = () => useContext(MsigProviderContextMock)
