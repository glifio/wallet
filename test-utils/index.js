// solution found https://github.com/facebook/jest/issues/2157#issuecomment-897935688
export function flushPromises() {
  return new Promise(jest.requireActual('timers').setImmediate)
}

export * from './constants'
