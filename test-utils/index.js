import { createStore } from 'redux'
import { initialState } from '../store/states'
import reducer from '../store/reducer'

// solution found https://github.com/facebook/jest/issues/2157#issuecomment-897935688
export function flushPromises() {
  return new Promise(jest.requireActual('timers').setImmediate)
}

export function initializeStore(state = initialState) {
  return createStore(reducer, state)
}

export { default as composeMockAppTree } from './composeMockAppTree'

export * from './constants'

export default initializeStore
