import { createAction, handleActions, combineActions } from "redux-actions";
import { combineReducers } from 'redux';
import { createRoutine } from 'redux-saga-routines';

/**
 * Useful documentation:
 *
 * https://redux-actions.js.org/docs/api/combineActions.html
 * https://redux-saga.js.org/docs/basics/UsingSagaHelpers.html
 * https://github.com/redux-saga/redux-saga/tree/master/docs/api#callfn-args
 * https://github.com/afitiskin/redux-saga-routines
 *
 */

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
export const name = 'example';


/**
 * STEP 0: Include you reducer to redux: `src/base/redux/rootReducer.js`
 *
 * STEP 1: Initial state
 */
interface ExampleType {
  loading?:boolean,
  error?:string,
  data?:{},
}
const initialState:ExampleType = {
  loading: false,
  error: '',
  data: {},
};


/**
 * STEP 2: Define redux action, two kind of action:
 *    1. Non HTTP request: Use redux-actions.createAction to create action, called `redux action`
 *    2. HTTP request: Use redux-saga-routines.createRoutine to create action, called `saga routines`
 *
 *
 * Naming rule (<mean required> [mean optional]):
 * Format:      <Action> [Addition]  <ReducerName>   [Addition of Reducer]
 * Example:     HIDE                  NOTIFICATION
 * Example:     SET                   NOTIFICATION    _ATTRS
 * Example:     SHOW      TEXT        NOTIFICATION
 *
 * If your action is Non-HTTP request, must append `saga/` prefix to your action name: eg: `saga/FETCH_USER`
 *
 * WHY: You know why? --> To segregate which is redux action, which is saga routine for easy handle in the future
 *
 *
 * Now, you can use your action in your React Component (refer to whatever component to see the real example):
 * @connect(
 *     state => ({}),
 *     getAllMapper({
 *       sagaAction,
 *     }, {
 *       reduxAction,p
 *     })
 * )
 */
export const exampleAction:any = createAction('EXAMPLE_ACTION', (data:any) => data);

/**
 * STEP 3: Describe redux reducer, no saga related here
 */
export const reducer = handleActions({
  [exampleAction]: (state, action) => ({...state, ...action.payload}),
}, {...initialState});


// How we read data from redux store
// NOTE: `state` is `state` params of @connect(mapStateToProps(state, props))
export const reader = {
  getState: (state:any) => state[name],
  getExampleDataByFooId: (state:any, fooId:number) => state[name].someDeepPath[fooId],
}


export const persist = { // Or another way to persist
  loading: false, // Do not persist this key
  visible: false, // Do not persist this key
  error: false, // Do not persist this key
  product: false, // Do not persist this key
  data: {
    product_id: false,
    note: false,
  },
  //child1Reducer: child1Persist, // import { child1Persist } from '.pathTo/child1.redux.ts'
  //child2Reducer: child2Persist, // import { child2Persist } from '.pathTo/child2.redux.ts'
};