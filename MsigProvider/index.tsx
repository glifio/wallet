import { useState, createContext, ReactNode, useContext, Dispatch } from 'react'
import { FilecoinNumber } from '@glif/filecoin-number'
import useSWR from 'swr'
import { useWallet } from '@glif/react-components'
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
  children
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

  return (
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
        InitialBalance: actor?.InitialBalance || new FilecoinNumber('0', 'fil'),
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
  )
}

export const useMsig = () => useContext(MsigProviderContext)
