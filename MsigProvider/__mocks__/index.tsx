import { FilecoinNumber } from '@glif/filecoin-number'
import { createContext, ReactNode, Dispatch, useContext, useState } from 'react'
import { SWRConfig } from 'swr'
import { MsigActorState } from '../../MsigProvider/types'
import {
  composeMsigProviderState,
  presets,
  WALLET_ADDRESS
} from '../../test-utils/composeMockAppTree/composeState'
import converAddrToFPrefix from '../../utils/convertAddrToFPrefix'

export const MULTISIG_ACTOR_ADDRESS =
  'f2m4f2dv7m35skytoqzsyrh5wqz3kxxfflxsha5za'
export const MULTISIG_SIGNER_ADDRESS = converAddrToFPrefix(WALLET_ADDRESS)
export const MULTISIG_SIGNER_ADDRESS_2 =
  'f1kxx73uhwgtorxxn7gbyihi6rwmaokj64iyg5qjy'

const signers = [
  {
    account: MULTISIG_SIGNER_ADDRESS,
    id: 't01234'
  },
  {
    account: MULTISIG_SIGNER_ADDRESS_2,
    id: 't01235'
  }
]

const emptyMsigProviderContext = {
  Address: MULTISIG_ACTOR_ADDRESS,
  ActorCode: 'fil/5/multisig',
  Balance: new FilecoinNumber('1', 'fil'),
  AvailableBalance: new FilecoinNumber('1', 'fil'),
  Signers: signers,
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
}

type Presets = keyof typeof presets

const MsigProviderContextMock = createContext<
  MsigActorState & {
    setMsigActor: null | Dispatch<string | null>
  } & { loading: boolean }
>(emptyMsigProviderContext)

export const MsigProviderWrapper = ({
  children,
  options,
  statePreset
}: {
  children: ReactNode
  options: object
  statePreset: Presets
}) => {
  const providerContextValue = composeMsigProviderState(statePreset)
  const [Address, setMsigAddress] = useState<null | string>(null)
  return (
    <SWRConfig value={{ dedupingInterval: 0 }}>
      <MsigProviderContextMock.Provider
        value={{
          ...providerContextValue,
          Address,
          loading: false,
          setMsigActor: setMsigAddress
        }}
      >
        {children}
      </MsigProviderContextMock.Provider>
    </SWRConfig>
  )
}

export const useMsig = () => useContext(MsigProviderContextMock)
