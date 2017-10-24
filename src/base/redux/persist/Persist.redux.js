import { createAction, handleActions } from "redux-actions";

/**
 * See this: This is latest version of a advance reducer
 * A standard reducer include:
 *    name: The reducer name in redux store,
 *    reducer: The redux reducer,
 *    reader: The reader of reducer, imagine redux reducer is how you write data to store, reader is how you read from the store
 *    persist: Persist configuration, see all persist config of all *.redux.ts to see how it work
 */

/**
 * Name of the reducer, this was use as a key of reducer in redux store
 */
export const name = 'persist';

const initialState = {
  rehydrated: false,
}

export const rehydrateCompleted = createAction('persist/REHYDRATE_COMPLETED');



// How we write data to redux store
export const reducer = handleActions({
  [rehydrateCompleted]: () => ({rehydrated: true}),
}, {...initialState});

// How we read data from redux store
// NOTE: `state` is `state` params of @connect(mapStateToProps(state, props))
export const reader = {
  //rehydrated: (state, props) => state[name].rehydrated,
  rehydrated: (state) => state[name].rehydrated,
}

export const persist = false;