import { createAction, handleActions, combineActions } from "redux-actions";
import { combineReducers } from 'redux';
import { createRoutine } from 'redux-saga-routines';
import { pick } from 'lodash';
import { HistoryType, getHistoryKey } from './TopupHelper';

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
export const name = 'topup';


/**
 * STEP 0: Include you reducer to redux: `src/base/redux/rootReducer.js`
 *
 * STEP 1: Initial state
 */

interface TopUpStateType {
  collapse?: boolean,
  error?:string,

  phone?: string,
  rateId?: number,
  cards?:any,
  supportedCarriers: string[],

  // Last 3 history topup history
  history: {
    [key:string]: HistoryType
  }
}
const initialState:TopUpStateType = {
  collapse: false,
  phone: '',
  rateId: 0,
  error: "",
  cards: {},
  supportedCarriers: [],
  history: {

    // Fake data for the heroku demo
    VNP100298743212: {
      phone: '0298743212',
      carrierId: 'VNP',
      rateId: 10,
      time: '1507550970'
    },
    VMS80998666999: {
      phone: '0998666999',
      carrierId: 'VMS',
      rateId: 8,
      time: '1507551349'
    },
  }
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
 * Example:     SET                   NOTIFICATION    ATTRS
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
 *       reduxAction,
 *     })
 * )
 */
export const setTopupData:any = createAction('SET_TOPUP_DATA', (data:TopUpStateType) => data);
export const toogleTopupCollapse:any = createAction('SET_TOPUP_COLLAPSE');
export const pushTopupHistory:any = createAction('PUSH_TOPUP_HISTORY', (history:HistoryType) => history);
export const sagaGetTopupCardAndRate:any = createRoutine('saga/GET_TOPUP_CARD_AND_RATE');


/**
 * STEP 3: Describe redux reducer, no saga related here
 */
export const reducer = handleActions({

  // Trigger was often call from React Component
  [setTopupData]: (state, action) => ({...state, ...action.payload}),
  [toogleTopupCollapse]: (state, action) => ({...state, collapse: !state.collapse}),
  [pushTopupHistory]: (state, action) => {
    const history:any = state.history;
    const last3History:any = history.pSlice(0, 3); // Retain 3 newest history
    const newHistory:any = action.payload;

    const historyKey = getHistoryKey(newHistory);
    const duplicated:boolean = (typeof last3History[historyKey] !== 'undefined');

    return duplicated ? state : {
      ...state,
      history: {
        [historyKey]: newHistory,
        ...last3History
      }
    }
  },
  //[sagaGetTopupCardAndRate.TRIGGER]: (state, action) => (state),
  [sagaGetTopupCardAndRate.SUCCESS]: (state, action) => ({
    ...state,
    ...action.payload,
    error: ''
  }),
  [sagaGetTopupCardAndRate.FAILURE]: (state, action) => ({...state, ...action.payload}),

}, {...initialState});


// How we read data from redux store
// NOTE: `state` is `state` params of @connect(mapStateToProps(state, props))
export const reader = {
  getState: (state:any) => state[name],
}


// TODO: Write a redux plugin to handle this case, call smart persist, replace transform filter
export const persist = true; // [Default] Persist this reducer with ALL its key
// export const persist = false; // Do not persist this reducer, default is case 'true' so you must specify if wanna blacklist this key
//export const persist = { // Or another way to persist
  // loading: false, // Do not persist this key
  // visible: false, // Do not persist this key
  // error: false, // Do not persist this key
  // product: false, // Do not persist this key
  // data: {
  //   product_id: false,
  //   note: false,
  // },
  //child1Reducer: child1Persist, // import { child1Persist } from '.pathTo/child1.redux.ts'
  //child2Reducer: child2Persist, // import { child2Persist } from '.pathTo/child2.redux.ts'
//};