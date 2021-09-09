import {
  useCallback,
  useEffect,
  useState,
  useRef,
  createContext,
  ReactNode,
  useContext
} from 'react'
import { FilecoinNumber } from '@glif/filecoin-number'
import useSWR, { SWRConfig } from 'swr'
import { useRouter } from 'next/router'
import { useWalletProvider } from '../WalletProvider'
import useWallet from '../WalletProvider/useWallet'
import reportError from '../utils/reportError'
import { fetchMsigState, stateDiff } from '../utils/msig'
import { MsigActorState } from './types'

const MsigProviderContext = createContext<
  MsigActorState & { setMsigActor: () => void }
>({
  Address: null,
  ActorCode: '',
  Balance: new FilecoinNumber('0', 'fil'),
  AvailableBalance: new FilecoinNumber('0', 'fil'),
  loading: true,
  Signers: [],
  PendingTxns: {},
  setMsigActor: () => {},
  errors: {
    notMsigActor: false,
    connectedWalletNotMsigSigner: false,
    actorNotFound: false,
    unhandledError: ''
  }
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
          PendingTxns: actor?.PendingTxns || {},
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

export const useMsigProvider = () => useContext(MsigProviderContext)
