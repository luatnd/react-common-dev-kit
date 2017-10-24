import { compose, createStore, applyMiddleware } from "redux";
import { persistStore, autoRehydrate } from "redux-persist";
import promiseMiddleware from 'redux-promise';
import localForage from "localforage";

//import logger from 'redux-logger'
import thunk from "redux-thunk";
//import { clearThunk } from './createActionThunk';

import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas/rootSaga';

import { routerMiddleware } from 'react-router-redux';
import history from '../router/history';

import { rootReducer, rootCombinedPersistFilters } from './reducerConfig';

import { loadTranslations, setLocale, syncTranslationWithStore } from "react-redux-i18n";
import { translationsObject } from '../translations/translationsObject'
import { rehydrateCompleted } from './persist/Persist.redux'


/** Devtools */
const composeEnhancers = process.env.NODE_ENV !== "production" &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      name: "MY APP",
      actionsBlacklist: []
    })
  : compose;

const sagaMiddleware = createSagaMiddleware();

/** Compose & Middleware */
const enhancer = composeEnhancers(
  applyMiddleware(
    thunk,              // redux-thunk
    sagaMiddleware,     // redux-saga
    promiseMiddleware,  // redux-promise
    routerMiddleware(history), // connected-react-router: for dispatching history actions
  ),
  autoRehydrate(),      // redux-persist: restore data from storage
);

/**
 * Store creation
 */
export const store = createStore(
  rootReducer,
  undefined,
  enhancer
);
// After that, run saga middleware to loop and listen
sagaMiddleware.run(rootSaga);

/**
 * Load translation
 */
const DEFAULT_LOCALE = 'vi';

syncTranslationWithStore(store);
store.dispatch(setLocale(DEFAULT_LOCALE));
store.dispatch(loadTranslations(translationsObject)); // Move to rehydrationPromise section: Why ?


/**
 * TODO: Enable deep merge strategy for some reducer --> is this true?
 * TODO: Auto clear localforage base on deploy version changes
 *
 * When we upgrade a new release that has a new property, persist rehydration will do a shallow merge by default
 * So that some props thats located deep inside an reducer was removed after persist
 */
export const rehydrationPromise = new Promise(resolve => {
  
  // persistStore<State>(store: Store<State>, persistorConfig?: PersistorConfig, onComplete?: OnComplete<any>): Persistor;
  persistStore(
    store,
    {
      // blacklist: ['toast'],
      // whitelist: ['someTransientReducer'],
      transforms: rootCombinedPersistFilters,
      storage: localForage
    },
    () => {
      /** Callback when rehydration completed */
      //console.log("Rehydration complete"); // TODO: Turn on this msg on dev mode only

      //store.dispatch(loadTranslations(translationsObject)); // reload cached lang, and lang translation
      store.dispatch(rehydrateCompleted()); // Notice that rehydrate was complete to the store
      // store.dispatch(clearThunk());

      resolve();
    }
  );
});

if (module.hot) {
  module.hot.accept('../translations/translationsObject', () => {
    store.dispatch(loadTranslations(require('../translations/translationsObject').translationsObject));
  });
}
