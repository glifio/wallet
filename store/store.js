import { createStore, applyMiddleware, compose } from 'redux'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import { initialState } from './states'
import reducer from './reducer'
import deserialize from './deserializeState'

function initializeStore(state = initialState) {
  const middleware = process.env.IS_PROD
    ? [thunkMiddleware]
    : [(thunkMiddleware, createLogger())]

  return createStore(
    reducer,
    deserialize(state),
    compose(applyMiddleware(...middleware))
  )
}

export default initializeStore
