import { createAction, handleActions, combineActions } from "redux-actions";
import { combineReducers } from 'redux';
import { createRoutine } from 'redux-saga-routines';
import * as moment from 'moment';
import omit = require("lodash/omit");

import { ProductCategoryStateType, ProductCategoryType } from './ProductCategoryType'

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
export const name = 'productCategory';


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
interface ProductCategoryReducerType {
  categories:{
    // loading:boolean,
    // error:string,
    // maxAge:number,
    // items:ProductCategoryType[]
  },

  // Cache data of productCategoryPage
  categoryData:{
    [categoryId:number]:ProductCategoryStateType
  },

  // Cache data of shopPage
  shopCategoryData:{
    [categoryId:number]:ProductCategoryStateType
  }
}

const initialState:ProductCategoryReducerType = {
  categories: {
    loading: false,
    error: '',
    maxAge: 0,
    // items: [],
    items: {},
  },
  categoryData: {},
  shopCategoryData: {}
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
export const sagaFetchProductsByCat = createRoutine('saga/FETCH_PRODUCTS_BY_CAT');
export const sagaFetchProductsByCatShopPage = createRoutine('saga/FETCH_PRODUCTS_BY_CAT_SHOP_PAGE');
export const sagaFetchShopCategories = createRoutine('saga/FETCH_SHOP_CATEGORIES');
export const changeCategoryPage:any = createAction('CHANGE_CATEGORY_PAGE', (category:number, page: number) => ({category, page}));
export const changeShopCategoryPage:any = createAction('CHANGE_SHOP_CATEGORY_PAGE', (category:number, page: number) => ({category, page}));


function changeCategoryPage_Reducer(reducerKey:string, state:any, action:any) {
  const payload:{
    category:number,
    page: number
  } = action.payload;

  const categoryId = payload.category;
  const categoryData = state[reducerKey];
  const newCategoryData = categoryData ? {...categoryData}: {};

  if (newCategoryData[categoryId] && newCategoryData[categoryId].data) {
    newCategoryData[categoryId].data.currentPage = payload.page;
  }

  return {
    ...state,
    [reducerKey]: newCategoryData
  }
}

function sagaFetchProductsByCat_Trigger_Reducer(reducerKey:string, state:any, action:any) {
  const payload:any = action.payload;
  const category = payload.category;
  const categoryData = state[reducerKey];
  const categoryState:ProductCategoryStateType = categoryData[category];

  const newState = {
    error: '',
    loading: true,
  };

  return {
    ...state,
    [reducerKey]: {
      ...categoryData,
      [category]: {...categoryState, ...newState},
    }
  }
}

// TODO: Introduce new reducer for breaking down this ugly reducer
function sagaFetchProductsByCat_Success_Reducer(reducerKey:string, state:any, action:any) {
  const payload:any = action.payload;
  const category = payload.category;
  const categoryData = state[reducerKey];
  const categoryState:ProductCategoryStateType = categoryData[category];

  let oldResults = {};
  if (categoryState && typeof categoryState.data !== 'undefined') {
    oldResults = categoryState.data.results;
  }

  const responseData = payload.data;

  return {
    ...state,
    [reducerKey]: {
      ...categoryData,
      [category]: {
        loading: false,
        error: '',
        data: {
          total: responseData.total,
          currentPage: responseData.page,
          results: {
            ...oldResults,
            [responseData.page]: {
              maxAge: parseInt(moment().format('X')),
              results: responseData.results,
            }
          },
        }
      },
    }
  }
}

function sagaFetchProductsByCat_Failure_Reducer(reducerKey:string, state:any, action:any) {
  const payload:any = action.payload;
  const category = payload.category;
  const categoryData = state[reducerKey];
  const categoryState:ProductCategoryStateType = categoryData[category];

  const newState = {
    error: payload.message,
    loading: false,
  };

  return {
    ...state,
    [reducerKey]: {
      ...categoryData,
      [category]: {...categoryState, ...newState},
    }
  }
}

/**
 * STEP 3: Describe redux reducer, no saga related here
 */
export const reducer = handleActions({


  [changeCategoryPage]: (state, action) => changeCategoryPage_Reducer('categoryData', state, action),
  [changeShopCategoryPage]: (state, action) => changeCategoryPage_Reducer('shopCategoryData', state, action),

  [sagaFetchShopCategories.TRIGGER]: (state, action) => {
    return {
      ...state,
      categories: {
        ...state.categories,
        error: '',
        loading: true,
      },
    }
  },
  [sagaFetchShopCategories.SUCCESS]: (state, action) => {
    const categories = {
      maxAge: parseInt(moment().format('X')),
      loading: false,
      error: '',
      items: {},
      //items: [] as any,
    };


    //sagaFetchProductsByCat.success({}); // TODO: Dispatch to update category Data too.


    const itemArr:any = action.payload; // Actually: itemArr:ProductCategoryType[]
    categories.items = itemArr.mapToObject(
      (category:ProductCategoryType) => category.category_id,
      (category:ProductCategoryType) => omit(category, 'results'),
    );
    // categories.items = action.payload;


    return {
      ...state,
      categories: categories,
    }
  },
  [sagaFetchShopCategories.FAILURE]: (state, action) => {
    return {
      ...state,
      categories: {
        ...state.categories,
        error: action.payload,
        loading: false,
      },
    }
  },


  // Trigger was often call from React Component
  [sagaFetchProductsByCat.TRIGGER]: (state, action) => {
    return sagaFetchProductsByCat_Trigger_Reducer('categoryData', state, action);
  },

  // SUCCESS was often call from Saga
  [sagaFetchProductsByCat.SUCCESS]: (state, action) => {
    return sagaFetchProductsByCat_Success_Reducer('categoryData', state, action);
  },

  // FAILURE was often call from Saga
  [sagaFetchProductsByCat.FAILURE]: (state, action) => {
    return sagaFetchProductsByCat_Failure_Reducer('categoryData', state, action);
  },

  // Trigger was often call from React Component
  [sagaFetchProductsByCatShopPage.TRIGGER]: (state, action) => {
    return sagaFetchProductsByCat_Trigger_Reducer('shopCategoryData', state, action);
  },

  // SUCCESS was often call from Saga
  [sagaFetchProductsByCatShopPage.SUCCESS]: (state, action) => {
    return sagaFetchProductsByCat_Success_Reducer('shopCategoryData', state, action);
  },

  // FAILURE was often call from Saga
  [sagaFetchProductsByCatShopPage.FAILURE]: (state, action) => {
    return sagaFetchProductsByCat_Failure_Reducer('shopCategoryData', state, action);
  },

}, {...initialState});


// How we read data from redux store
// NOTE: `state` is `state` params of @connect(mapStateToProps(state, props))
export const reader = {
  getState: (state:any) => state[name],

  /**
   * Get category state by category Id and datasource
   *
   * @param state your redux store single source of truth
   * @param dataSource is categoryData or shopCategoryData
   * @param categoryId
   */
  getCategoryStateById: (state:any, dataSource:string, categoryId:number) => {
    // state.productCategory[reduxDataSourceKey] always defined because it's redux initial state
    const categoryState:{} = state[name][dataSource][categoryId];

    return undefinedThenNext(categoryState, {});
  },
}


// Do not persist the loading state --> Persist loading state can cause rehydrate loading
export const persist = {
  categories: {
    loading: false,
    error: false,
  },
  // categoryData: false,
  // shopCategoryData: false,
}