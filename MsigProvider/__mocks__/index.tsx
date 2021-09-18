import { FilecoinNumber } from '@glif/filecoin-number'
import { createContext, ReactNode, Dispatch, useContext } from 'react'
import { SWRConfig } from 'swr'
import { MsigActorState } from '../../MsigProvider/types'

const MsigProviderContextMock = createContext<
  MsigActorState & {
    setMsigActor: null | Dispatch<string | null>
  } & { loading: boolean }
>({
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
