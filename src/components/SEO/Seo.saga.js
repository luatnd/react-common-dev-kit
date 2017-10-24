import { takeEvery, call, put } from 'redux-saga/effects'
import axios from 'axios'
import { encoder } from '../../base/HttpService/HttpService' // Don't worry because --allowJS option was turned on
import { HOST, Api, STATUS_CODE } from '../../siteConfig'
import { sagaFetchSeoConf } from './Seo.redux'


// SAGA STEP 2. Watcher: Saga listening the dispatching of action
export function* seoSagaWatcher() {
  // run fetchDataFromServer on every trigger action
  yield takeEvery(sagaFetchSeoConf.TRIGGER, sagaFetchSeoConf_ServiceWorker)
}

// SAGA STEP 1. Worker: Do async API call stuff
function* sagaFetchSeoConf_ServiceWorker(action) {
  const sagaAction = sagaFetchSeoConf;
  const axiosRequest = {
    method: Api.seoConf.method,
    url: HOST + Api.seoConf.uri,
    headers: {
      'Accept': 'application/json',
    },
    data: encoder({}),
  };
  const apiErrorMsg = 'API error';
  const exceptionErrorMsg = 'Exception error';
  const makePayload = (responseBodyData) => {
    return typeof responseBodyData === 'string' ? JSON.parse(responseBodyData) : responseBodyData;
  };
  
  
  /**
   * SAGA section: Almost simple saga call is using bellow code:
   */
  try {
    const response = yield call(axios, axiosRequest);
    
    if (response.status === STATUS_CODE.SUCCESS) {
      const responseBody = response.data;
      yield put(sagaAction.success(makePayload(responseBody)));
    } else {
      yield put(sagaAction.failure({error: apiErrorMsg}));
    }
  } catch (e) {
    // if request failed
    yield put(sagaAction.failure({error: exceptionErrorMsg}));
  }
}
