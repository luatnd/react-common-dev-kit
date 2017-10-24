import { takeEvery, call, put } from 'redux-saga/effects'
import axios from 'axios'
import { getUrl, encoder } from '../../../base/HttpService/HttpService' // Don't worry because --allowJS option was turned on
import { sagaGetTopupCardAndRate } from './Topup.redux'
import { Api, STATUS_CODE } from '../../../siteConfig'


// SAGA STEP 2. Watcher: Saga listening the dispatching of action
export function* topupSagaWatcher() {
  // run fetchDataFromServer on every trigger action
  yield takeEvery(sagaGetTopupCardAndRate.TRIGGER, sagaGetTopupCardAndRate_ServiceWorker)
}

// SAGA STEP 1. Worker: Do async API call stuff
function* sagaGetTopupCardAndRate_ServiceWorker(action) {
  const sagaAction = sagaGetTopupCardAndRate;
  const axiosRequest = {
    method: Api.banking.topupRates.method,
    url: getUrl(Api.banking.topupRates.uri, 'banking'),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
    data: encoder({}),
  };
  const logicErrorMsg = 'Logic error';
  const apiErrorMsg = 'API error';
  const exceptionErrorMsg = 'Exception error';
  const makePayload = (responseBodyData) => {
    const cards = {};
    const supportedCarriers = [];
    
    responseBodyData.results.map((v) => {
      const rateInfo = {...v};
      const networkCode = v.network_code;
      supportedCarriers.push(networkCode);
      
      rateInfo.rates = {}; //reset rates
      for (let value of v.rates) {
        rateInfo.rates[value.id.toString()] = value;
      }
      cards[networkCode] = rateInfo;
      
      return null;
    });

    return {
      cards,
      supportedCarriers,
    };
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
