import { createStore, applyMiddleware, compose } from 'redux'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import { initialState } from './states'
import reducer from './reducer'

function initializeStore(state = initialState) {
  const middleware = process.env.IS_PROD
    ? [thunkMiddleware]
    : [thunkMiddleware, createLogger()]

  return createStore(reducer, state, compose(applyMiddleware(...middleware)))
}

export default initializeStore
