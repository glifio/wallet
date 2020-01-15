import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import reducer from './reducer'
import { initialState } from './states'

const initStore = () => {
  const middleware = [thunkMiddleware, createLogger()]
  return createStore(
    reducer,
    initialState,
    compose(applyMiddleware(...middleware))
  )
}

export default initStore
