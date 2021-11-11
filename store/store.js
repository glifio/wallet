import { createStore, applyMiddleware, compose } from 'redux'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import reducer from './reducer'

function initializeStore() {
  const middleware = process.env.IS_PROD
    ? [thunkMiddleware]
    : [thunkMiddleware, createLogger()]

  return createStore(reducer, compose(applyMiddleware(...middleware)))
}

export default initializeStore
