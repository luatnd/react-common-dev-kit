// 3rd required libs
import { combineReducers } from "redux";
import reduceReducers from "reduce-reducers";
import { getCombinedPersistFilters } from './utils';

// My config
import { myReduxes, thirdPartyReducers, thirdPartyReducerPersist } from './rootReducer';

/**
 * TL;DR: Auto defined the reducers and its persist info from your above declaration
 */

const myReducers = {};
const myReducerPersists = {};
for (let myRedux of myReduxes) {
  myReducers[myRedux.name] = myRedux.reducer;
  myReducerPersists[myRedux.name] = myRedux.persist;
}



/**
 * Root reducer
 */
export const rootReducer = reduceReducers(
  combineReducers({
    //reducerKey: reducer,
    ...thirdPartyReducers,
    ...myReducers,
  })
);


/**
 * Persist your reducer to Indexed DB ?
 *
 * `reducerPersists` is a nested object, with the structure as same as your redux store,
 *  but it define: true, false to indicate persist that key or not
 *
 * Usage: [reducer_name]: persist_config
 * persist_config can be:
 *    1. {bool}: true    ==> persist entirely your reducer
 *    2. {bool}: false   ==> Do not persist this reducer
 *    3. {object}: {
 *      key1: true, ==> Persist this key
 *      key2: false, ==> Do not persist this key
 *    }
 *
 * This config was set at `*.redux.ts` , see the `tmpShopItemDialog.redux.ts` for more detail
 */
const reducerPersists = {
  //reducerKey: reducerPersist,
  ...thirdPartyReducerPersist,
  ...myReducerPersists,
};
export const rootCombinedPersistFilters = getCombinedPersistFilters(reducerPersists);