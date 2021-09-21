import { presets } from './composeState'
import { initializeStore } from '..'

export default function mockReduxStoreWithState(options: {
  state?: object
  statePreset?: string
}) {
  const state = options.state || presets[options.statePreset]
  return initializeStore(state)
}
