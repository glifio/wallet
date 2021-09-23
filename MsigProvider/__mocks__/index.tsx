import { FilecoinNumber } from '@glif/filecoin-number'
import { node, object, string } from 'prop-types'
import { createContext, ReactNode, Dispatch, useContext, useState } from 'react'
import { SWRConfig } from 'swr'
import { MsigActorState } from '../../MsigProvider/types'
import {
  composeMsigProviderState,
  presets
} from '../../test-utils/composeMockAppTree/composeState'
import { signers } from '../../test-utils'

export const emptyMsigProviderContext = {
  Address: null,
  ActorCode: '',
  Balance: new FilecoinNumber('0', 'fil'),
  AvailableBalance: new FilecoinNumber('0', 'fil'),
  Signers: signers,
  InitialBalance: new FilecoinNumber('0', 'fil'),
  NextTxnID: 0,
  NumApprovalsThreshold: 0,
  StartEpoch: 0,
  UnlockDuration: 0,
  errors: {
    notMsigActor: false,
    connectedWalletNotMsigSigner: false,
    actorNotFound: false,
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
  // this is a bit confusing, but if the composed msig provider state has an address, use that one
  // if its null, we use the stateful variable above ^^
  const addressForContextConsumers = providerContextValue.Address || Address
  return (
    <SWRConfig value={{ dedupingInterval: 0 }}>
      <MsigProviderContextMock.Provider
        value={{
          ...providerContextValue,
          Address: addressForContextConsumers,
          loading: false,
          setMsigActor: setMsigAddress
        }}
      >
        {children}
      </MsigProviderContextMock.Provider>
    </SWRConfig>
  )
}

MsigProviderWrapper.propTypes = {
  options: object,
  statePreset: string,
  children: node.isRequired
}

MsigProviderWrapper.defaultProps = {
  statePreset: 'postOnboard'
}

export const useMsig = () => useContext(MsigProviderContextMock)
