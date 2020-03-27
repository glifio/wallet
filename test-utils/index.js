import { createStore } from 'redux'
import { initialState } from '../store/states'
import reducer from '../store/reducer'

export const flushPromises = () => new Promise(setImmediate)

export function initializeStore(state = initialState) {
  return createStore(reducer, state)
}

export default initializeStore
