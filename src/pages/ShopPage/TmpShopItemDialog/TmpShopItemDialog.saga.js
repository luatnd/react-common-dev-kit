import { takeEvery, call, put } from 'redux-saga/effects'
import axios from 'axios'
import { getUrl, encoder } from '../../../base/HttpService/HttpService' // Don't worry because --allowJS option was turned on
import { sagaSendBookingForm } from './TmpShopItemDialog.redux'
import { Api, STATUS_CODE } from '../../../siteConfig'


// SAGA STEP 2. Watcher: Saga listening the dispatching of action
export function* tmpShopItemDialogSagaWatcher() {
  // run fetchDataFromServer on every trigger action
  yield takeEvery(sagaSendBookingForm.TRIGGER, sagaSendBookingForm_ServiceWorker)
}

// SAGA STEP 1. Worker: Do async API call stuff
function* sagaSendBookingForm_ServiceWorker(action) {
  const sagaAction = sagaSendBookingForm;
  const axiosRequest = {
    method: Api.cms.tmpBooking.method,
    url: getUrl(Api.cms.tmpBooking.uri, 'cms'),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
    data: encoder(action.payload),
  };
  const logicErrorMsg = "Sản phẩm có thể đã hết hàng trong quá trình bạn đặt mua. Bạn vui lòng đặt mua lại nếu sản phẩm vẫn còn hàng";
  const apiErrorMsg = "Lỗi đặt mua không xác định xảy ra, bạn có thể đặt mua lại hoặc liên hệ số hotline của Campp++ để được hỗ trợ, xin cảm ơn";
  const exceptionErrorMsg = "Lỗi đặt mua không xác định xảy ra, bạn có thể đặt mua lại hoặc liên hệ số hotline của Campp++ để được hỗ trợ, xin cảm ơn";
  const makePayload = (responseBodyData) => {
    return {...responseBodyData};
  };


  // SAGA section: Almost simple saga call is using bellow code:
  try {
    const response = yield call(axios, axiosRequest);

    if (response.status === STATUS_CODE.SUCCESS) {
      const responseBody = response.data;

      // eslint-disable-next-line
      if (responseBody.response_code == STATUS_CODE.SUCCESS) {
        yield put(sagaAction.success(makePayload(responseBody.data)));
      } else {
        yield put(sagaAction.failure({message: logicErrorMsg}));
      }
    } else {
      yield put(sagaAction.failure({message: apiErrorMsg}));
    }
  } catch (e) {
    // if request failed
    yield put(sagaAction.failure({message: exceptionErrorMsg}));
  }
}
