import { createAction, handleActions, combineActions } from "redux-actions";
import { combineReducers } from 'redux';
import { createRoutine } from 'redux-saga-routines';

import { antFormItemAttr } from '../../../components/AntForm/AntStaticData';

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
  loading: false,
  error: '',
  email: '',
  bankId: 0,
  bankValidateStatus: antFormItemAttr.validateStatus.unTouch,

  formItemBanks: {
    loading: false,
    error: '',
    banks: [],
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
export const setChoosePayment_Data:any = createAction('SET_CHOOSE_PAYMENT__DATA', (payload:any) => payload);
export const setChoosePayment_Bank:any = createAction('SET_CHOOSE_PAYMENT__BANK', (payload:{bankId:number, bankValidateStatus:string}) => payload);
export const setChoosePayment_Loading:any = createAction('SET_CHOOSE_PAYMENT__LOADING', (value:boolean) => value);
export const sagaFetchEpayBankList:any = createRoutine('saga/FETCH_EPAY_BANK_LIST');

/**
 * STEP 3: Describe redux reducer, no saga related here
 */
export const reducer = handleActions({
  [setChoosePayment_Data]: (state, action) => ({...state, ...action.payload}),
  [setChoosePayment_Bank]: (state, action) => ({...state, ...action.payload}),
  [setChoosePayment_Loading]: (state, action) => ({...state, loading: true}),

  [sagaFetchEpayBankList.TRIGGER]: (state, action) => ({
    ...state,
    formItemBanks: {
      ...state.formItemBanks,
      error: '',
      loading: true,
    }
  }),
  [sagaFetchEpayBankList.SUCCESS]: (state, action) => ({
    ...state,
    formItemBanks: {
      ...state.formItemBanks,
      error: '',
      loading: false,
      banks: action.payload.data
    }
  }),
  [sagaFetchEpayBankList.FAILURE]: (state, action) => ({
    ...state,
    formItemBanks: {
      ...state.formItemBanks,
      error: action.payload.message,
      loading: false,
    }
  }),
}, {...initialState});


export const persist = {
  loading: false,
  error: false,
  email: true, // Save only the email
  bankId: false,
  bankValidateStatus: false,
  formItemBanks: false
};