//import { takeEvery, call, put, fork } from 'redux-saga/effects'
//import { choosePaymentSagaWatcher } from './ChoosePayment/ChoosePayment.saga'
//import { topupSagaWatcher } from './DoPayment/DoPayment.saga'
//
//// SAGA STEP 2. Watcher: Saga listening the dispatching of action
//
//// TODO: Try to merge
//export function* checkoutPageSagaWatcher() {
//  // run fetchDataFromServer on every trigger action
//  yield [
//    fork(choosePaymentSagaWatcher()),
//    fork(topupSagaWatcher()),
//  ];
//}
