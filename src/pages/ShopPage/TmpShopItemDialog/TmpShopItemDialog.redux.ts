import { createAction, handleActions, combineActions } from "redux-actions";
import { combineReducers } from 'redux';
import { createRoutine } from 'redux-saga-routines';
import { ProductType } from "../../../components/Product/ProductType";

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
export const name = 'tmpShopItemDialog';


/**
 * STEP 0: Include you reducer to redux: `src/base/redux/rootReducer.js`
 *
 * STEP 1: Initial state
 */
interface TmpShopItemDialogType {
  loading?:boolean,
  visible?:boolean,
  error?:string,
  product?:any,
  data?:{},
}
const initialState:any = {
  loading: false,
  visible: false,
  error: '',
  product: null,
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
export const setBuyProductDialog_Data:any = createAction('SET_BUY_P_DLG__DATA', (data:any) => data);
export const setBuyProductDialog_Visible:any = createAction('SET_BUY_P_DLG__VISIBLE', (value:boolean) => value);
export const setBuyProductDialog_Loading:any = createAction('SET_BUY_P_DLG__LOADING', (value:boolean) => value);
export const setBuyProductDialog_Error:any = createAction('SET_BUY_P_DLG__ERROR', (value:string) => value);
export const setBuyProductDialog_Product:any = createAction('SET_BUY_P_DLG__PRODUCT', (product:ProductType) => product);
export const clearBuyProductDialog_Product:any = createAction('CLEAR_BUY_P_DLG__PRODUCT');
export const sagaSendBookingForm:any = createRoutine('saga/SEND_BOOKING_FORM');

/**
 * STEP 3: Describe redux reducer, no saga related here
 */
export const reducer = handleActions({
  [setBuyProductDialog_Data]: (state, action) => ({...state, ...action.payload}),
  [setBuyProductDialog_Visible]: (state, action) => ({...state, visible: action.payload}),
  [setBuyProductDialog_Loading]: (state, action) => ({...state, loading: action.payload}),
  [setBuyProductDialog_Error]: (state, action) => ({...state, error: action.payload}),
  [setBuyProductDialog_Product]: (state, action) => ({...state, product: action.payload}),
  [clearBuyProductDialog_Product]: (state, action) => ({...state, product: null}),

  [sagaSendBookingForm.TRIGGER]: (state, action) => ({...state,
    error: '',
    loading: true,
  }),
  [sagaSendBookingForm.SUCCESS]: (state, action) => ({...state,
    error: '',
    loading: false,
    data: action.payload,
  }),
  [sagaSendBookingForm.FAILURE]: (state, action) => ({...state,
    error: action.payload.message,
    loading: false,
  }),
}, {...initialState});


// How we read data from redux store
// NOTE: `state` is `state` params of @connect(mapStateToProps(state, props))
export const reader = {
  getState: (state:any) => state[name],
}


// TODO: Write a redux plugin to handle this case, call smart persist, replace transform filter
// export const persist = true; // [Default] Persist this reducer with ALL its key
// export const persist = false; // Do not persist this reducer, default is case 'true' so you must specify if wanna blacklist this key
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