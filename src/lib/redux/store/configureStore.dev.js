import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import { combineReducers } from 'redux'
import { thunk, createLogger } from 'redux-middleware'

import { log, IS_BROWSER } from '../../../config'
import { middleware as idle } from '../modules/redux-idle-monitor'
import * as reducers from '../reducers'

const getDevToolsEnhancer = () => IS_BROWSER && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f

export default function configureStore(history, initialState) {
  const reducer = combineReducers(reducers)
  const middlewares = [ thunk
                      , routerMiddleware(history)
                      , idle
                      , createLogger({ logger: IS_BROWSER ? console : log })
                      ]
  const enhancer = compose( applyMiddleware(...middlewares)
                          , getDevToolsEnhancer()
                          )
  const store = createStore(reducer, initialState, enhancer)
  if(module.hot)
    module.hot.accept('../reducers', () => store.replaceReducer(require('../reducers').default))
  return store
}
