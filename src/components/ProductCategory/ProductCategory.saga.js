// 3rd party
import { takeEvery, call, put } from 'redux-saga/effects'
import axios from 'axios'

// My dev kit common code
import { getUrl, encoder } from '../../base/HttpService/HttpService' // Don't worry because --allowJS option was turned on
import { Api, STATUS_CODE } from '../../siteConfig'

// My component redux action
import {
  sagaFetchProductsByCat,
  sagaFetchProductsByCatShopPage,
  sagaFetchShopCategories
} from './ProductCategory.redux'


// SAGA STEP 2. Watcher: Saga listening the dispatching of action
export function* productCategorySagaWatcher() {
  // run fetchDataFromServer on every trigger action
  yield takeEvery(sagaFetchProductsByCat.TRIGGER, sagaFetchCategoryProductsService)
  yield takeEvery(sagaFetchProductsByCatShopPage.TRIGGER, sagaFetchShopPageCategoryProductsService)
  yield takeEvery(sagaFetchShopCategories.TRIGGER, sagaFetchShopCategoriesService)
}

// SAGA STEP 1. Worker: Do async API call stuff
function* sagaFetchCategoryProductsService(action) {
  yield sagaFetchCategoryProducts(action, sagaFetchProductsByCat)
}
function* sagaFetchShopPageCategoryProductsService(action) {
  yield sagaFetchCategoryProducts(action, sagaFetchProductsByCatShopPage)
}

function* sagaFetchCategoryProducts(action, sagaAction) {
  const payload = action.payload; // This is payload data passed from your React Component: this.props.myAction(payload)
  const {page, perPage, category} = payload;

  const axiosRequest = {
    method: Api.common.campaign.getByCategory.method,
    url: getUrl(Api.common.campaign.getByCategory.uri, 'common'),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
    data: encoder({category_id: category, page, size: perPage}),
  };
  const logicErrorMsg = 'Logic error';
  const apiErrorMsg = 'API error';
  const exceptionErrorMsg = 'Exception error';
  const makePayload = (responseBodyData) => {
    // Standardize some data
    if (!responseBodyData.page) {
      responseBodyData.page = page;
    }

    if (Array.isArray(responseBodyData.results)) {
      responseBodyData.results = responseBodyData.results.map((product) => {
        let oneFiveRange = Math.floor(Math.random()*5); // Random a number from 1 to 5 for temporary rating number
    
        return {
          ...product,
          rate_avg: oneFiveRange + 2,
          rate_count: oneFiveRange * 3,
        }
      });
    }
    
    return {...payload, data: responseBodyData}
  };
  
  
  /**
   * SAGA section: Almost simple saga call is using bellow code:
   */
  try {
    const response = yield call(axios, axiosRequest);
    
    if (response.status === STATUS_CODE.SUCCESS) {
      const responseBody = response.data;
      
      // eslint-disable-next-line
      if (responseBody.response_code == STATUS_CODE.SUCCESS) {
        yield put(sagaAction.success(makePayload(responseBody.data)));
      } else {
        yield put(sagaAction.failure({...payload, message: logicErrorMsg}));
      }
    } else {
      yield put(sagaAction.failure({...payload, message: apiErrorMsg}));
    }
  } catch (e) {
    // if request failed
    console.warn('Exception: ', e.message);
    yield put(sagaAction.failure({...payload, message: exceptionErrorMsg}));
  }
}

function* sagaFetchShopCategoriesService(action) {
  const sagaAction = sagaFetchShopCategories;
  const axiosRequest = {
    method: Api.common.campaign.getCampaignAndCategory.method,
    url: getUrl(Api.common.campaign.getCampaignAndCategory.uri, 'common'),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
    data: encoder({
      //user_id: '', // TODO: implement anonymous user id tracking here
      size: action.payload.size,
      page: action.payload.page,
    }),
  };
  const logicErrorMsg = 'Logic error';
  const apiErrorMsg = 'API error';
  const exceptionErrorMsg = 'Exception error';
  const makePayload = (responseBodyData) => {
    return responseBodyData.results;
  };
  

  /**
   * SAGA section: Almost simple saga call is using bellow code:
   */
  try {
    const response = yield call(axios, axiosRequest);
    
    if (response.status === STATUS_CODE.SUCCESS) {
      const responseBody = response.data;
      
      // eslint-disable-next-line
      if (responseBody.response_code == STATUS_CODE.SUCCESS) {
        yield put(sagaAction.success(makePayload(responseBody.data)));
      } else {
        yield put(sagaAction.failure({error: logicErrorMsg}));
      }
    } else {
      yield put(sagaAction.failure({error: apiErrorMsg}));
    }
  } catch (e) {
    // if request failed
    yield put(sagaAction.failure({error: exceptionErrorMsg}));
  }
}
