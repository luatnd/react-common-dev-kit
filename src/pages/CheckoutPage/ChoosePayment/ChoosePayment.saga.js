import { takeEvery, call, put } from 'redux-saga/effects'
import axios from 'axios'
import { getUrl, encoder } from '../../../base/HttpService/HttpService' // Don't worry because --allowJS option was turned on
import { sagaFetchEpayBankList } from './ChoosePayment.redux'
import { Api, STATUS_CODE } from '../../../siteConfig'

// SAGA STEP 2. Watcher: Saga listening the dispatching of action
export function* choosePaymentSagaWatcher() {
  // run fetchDataFromServer on every trigger action
  yield takeEvery(sagaFetchEpayBankList.TRIGGER, sagaFetchEpayBankListService)
}

// SAGA STEP 1. Worker: Do async API call stuff
function* sagaFetchEpayBankListService(action) {
  //console.log('sagaFetchCategoryProductsService action: ', action);
  
  try {
    const response = yield call(axios, {
      method: Api.banking.getBanks.method,
      url: getUrl(Api.banking.getBanks.uri, 'banking'),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      data: encoder({}),
    });
    
    if (response.status === STATUS_CODE.SUCCESS) {
      const responseBody = response.data;
    
      // eslint-disable-next-line
      if (responseBody.response_code == STATUS_CODE.SUCCESS) {
        yield put(sagaFetchEpayBankList.success({data: responseBody.data.results}));
      } else {
        yield put(sagaFetchEpayBankList.failure({message: responseBody.message}));
      }
    } else {
      yield put(sagaFetchEpayBankList.failure({message: response.statusText}));
    }
  } catch (e) {
    // if request failed
    yield put(sagaFetchEpayBankList.failure({message: e.message}));
  }
}
