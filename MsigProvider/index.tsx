import { useState, createContext, ReactNode, useContext, Dispatch } from 'react'
import { FilecoinNumber } from '@glif/filecoin-number'
import useSWR, { SWRConfig, SWRConfiguration } from 'swr'
import useWallet from '../WalletProvider/useWallet'
import { fetchMsigState } from '../utils/msig'
import { MsigActorState, emptyMsigState } from './types'

const MsigProviderContext = createContext<
  MsigActorState & {
    setMsigActor: null | Dispatch<string | null>
  } & { loading: boolean }
>({
  ...emptyMsigState,
  loading: true,
  setMsigActor: null
})

export type MsigProviderContextType = MsigActorState & {
  setMsigActor: null | Dispatch<string | null>
  loading: boolean
}

export const MsigProviderWrapper = ({
  children,
  test
}: {
  children: ReactNode
  test: boolean
}) => {
  const wallet = useWallet()
  const [msigActor, setMsigActor] = useState(null)
  const { data: actor, error: msigActorStateError } = useSWR(
    msigActor ? [msigActor, wallet.address] : null,
    fetchMsigState
  )

  let config: SWRConfiguration = { refreshInterval: 2000 }
  // this only exists for the tests covering THIS file only
  // every other test mocks this wrapper
  if (test) {
    config = { dedupingInterval: 0 }
  }

  return (
    <SWRConfig value={config}>
      <MsigProviderContext.Provider
        value={{
          Address: msigActor,
          ActorCode: actor?.ActorCode || '',
          Balance: actor?.Balance || new FilecoinNumber('0', 'fil'),
          AvailableBalance:
            actor?.AvailableBalance || new FilecoinNumber('0', 'fil'),
          loading: !actor,
          Signers: actor?.Signers || [],
          NextTxnID: actor?.NextTxnID || 0,
          NumApprovalsThreshold: actor?.NumApprovalsThreshold || 0,
          InitialBalance:
            actor?.InitialBalance || new FilecoinNumber('0', 'fil'),
          UnlockDuration: actor?.UnlockDuration || 0,
          StartEpoch: actor?.StartEpoch || 0,
          errors: actor?.errors || {
            notMsigActor: false,
            connectedWalletNotMsigSigner: false,
            actorNotFound: false,
            unhandledError: msigActorStateError ? msigActorStateError : ''
          },
          setMsigActor
        }}
      >
        {children}
      </MsigProviderContext.Provider>
    </SWRConfig>
  )
}

export const useMsig = () => useContext(MsigProviderContext)
