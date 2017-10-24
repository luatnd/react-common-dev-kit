import { takeEvery, call, put } from 'redux-saga/effects'
import axios from 'axios'
import { getUrl, encoder } from '../../../base/HttpService/HttpService' // Don't worry because --allowJS option was turned on
import { sagaStartTopup } from './DoPayment.redux'
import { Api, STATUS_CODE } from '../../../siteConfig'


// SAGA STEP 2. Watcher: Saga listening the dispatching of action
export function* doPaymentSagaWatcher() {
  // run fetchDataFromServer on every trigger action
  yield takeEvery(sagaStartTopup.TRIGGER, sagaStartTopup_ServiceWorker)
}

// SAGA STEP 1. Worker: Do async API call stuff
function* sagaStartTopup_ServiceWorker(action) {
  try {
    const response = yield call(axios, {
      method: Api.banking.topupV2.method,
      url: getUrl(Api.banking.topupV2.uri, 'banking'),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      data: encoder({
        //user_id: 0, // TODO: Add user ID if someone was logged in
        //env: 1, // 1 is web, 0 is mobile: Web client will have some different behavior with mobile
        email: action.payload.email,
        phone: action.payload.phone,
        
        //provider: action.payload.provider,
        //amount: action.payload.card,
        rate_id: action.payload.rateId,
        
        quantity: 1,
        type: 1, // 2 is thẻ cào đt, 1 is nạp tiền đt
        bankid: action.payload.bankId,
      }),
    });
    
    
    if (response.status === STATUS_CODE.SUCCESS) {
      const responseBody = response.data;
    
      // eslint-disable-next-line
      if (responseBody.response_code == STATUS_CODE.SUCCESS) {
        // if request successfully finished
        yield put(sagaStartTopup.success({data: responseBody.data}));
      } else {
        yield put(sagaStartTopup.failure({message: 'Có lỗi xảy ra khi kết nối với ngân hàng. Không thể thực hiện topup'}));
      }
    } else {
      yield put(sagaStartTopup.failure({message: 'Có lỗi xảy ra trong hệ thống. Không thể thực hiện topup'}));
    }
  } catch (e) {
    // if request failed
    yield put(sagaStartTopup.failure({
      message: `Hiện tại hệ thống không thể hỗ trợ bạn chọn ngân hàng, vui lòng thử lại sau ít phút.`
    }));
  }
}
