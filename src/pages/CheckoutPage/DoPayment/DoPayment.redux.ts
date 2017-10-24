import { createAction, handleActions, combineActions } from "redux-actions";
import { combineReducers } from 'redux';
import { createRoutine } from 'redux-saga-routines';
// import * as pick from 'lodash/pick'; // Fuck! Why I can not use it , WTF bug!

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
 * STEP 0: Include you reducer to redux: `src/base/redux/rootReducer.js`
 *
 * STEP 1: Initial state
 */
const initialState:any = {
  error: '',
  loading: false,
  data: {
    mac: "",
    responsecode: "",
    status: "",
    tranid: "",
    url: "",
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
export const sagaStartTopup:any = createRoutine('saga/START_TOPUP');

/**
 * STEP 3: Describe redux reducer, no saga related here
 */
export const doPaymentReducer = handleActions({
  [sagaStartTopup.TRIGGER]: (state, action) => ({...state,
    error: '',
    loading: true,
  }),
  [sagaStartTopup.SUCCESS]: (state, action) => ({...state,
    error: '',
    loading: false,
    //data: pick(action.payload.data, ['mac', 'responsecode', 'status', 'tranid', 'url'])
    data: action.payload.data,
  }),
  [sagaStartTopup.FAILURE]: (state, action) => ({...state,
    error: action.payload.message,
    loading: false,
  }),
}, {...initialState});
