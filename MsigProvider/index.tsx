import { useState, createContext, ReactNode, useContext, Dispatch } from 'react'
import { FilecoinNumber } from '@glif/filecoin-number'
import useSWR, { SWRConfig } from 'swr'
import { useRouter } from 'next/router'
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

export const MsigProviderWrapper = ({ children }: { children: ReactNode }) => {
  const wallet = useWallet()
  const [msigActor, setMsigActor] = useState(null)
  const { data: actor, error: msigActorStateError, isValidating } = useSWR(
    msigActor ? [msigActor, wallet.address] : null,
    fetchMsigState
  )

  return (
    <SWRConfig value={{ refreshInterval: 2000 }}>
      <MsigProviderContext.Provider
        value={{
          Address: msigActor,
          ActorCode: actor?.ActorCode || '',
          Balance: actor?.Balance || new FilecoinNumber('0', 'fil'),
          AvailableBalance:
            actor?.AvailableBalance || new FilecoinNumber('0', 'fil'),
          loading: isValidating,
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
