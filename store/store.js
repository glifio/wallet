import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'
import { initialState } from './states'
import reducer from './reducer'

function initializeStore(state = initialState) {
  return createStore(
    reducer,
    state,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  )
}

export default initializeStore
