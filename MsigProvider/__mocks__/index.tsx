import { node, object, string } from 'prop-types'
import { createContext, ReactNode, Dispatch, useContext, useState } from 'react'
import { SWRConfig } from 'swr'
import { emptyMsigState, MsigActorState } from '../../MsigProvider/types'
import {
  composeMsigProviderState,
  presets
} from '../../test-utils/composeMockAppTree/composeState'

export const emptyMsigProviderContext = {
  ...emptyMsigState,
  loading: false,
  setMsigActor: null
}

type Preset = keyof typeof presets

const MsigProviderContextMock = createContext<
  MsigActorState & {
    setMsigActor: null | Dispatch<string | null>
    loading: boolean
  }
>(emptyMsigProviderContext)

export const MsigProviderWrapper = ({
  children,
  options,
  statePreset
}: {
  children: ReactNode
  options: object
  statePreset: Preset
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

export const useMsig = () => {
  const context = useContext(MsigProviderContextMock)
  return context
}
