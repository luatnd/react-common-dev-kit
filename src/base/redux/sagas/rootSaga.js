// NOTE: For all saga: Should not use Typescript for saga because lacking of value, it's definition only
import { all } from 'redux-saga/effects'

// 1. Worker: Do async API call stuff
// 2. Watcher: Saga listening the dispatching of action
import { routinesWatcherSaga } from 'redux-saga-routines'
import { productCategorySagaWatcher } from '../../../components/ProductCategory/ProductCategory.saga'
import { topupSagaWatcher } from '../../../pages/ShopPage/Topup/Topup.saga'
import { tmpShopItemDialogSagaWatcher } from '../../../pages/ShopPage/TmpShopItemDialog/TmpShopItemDialog.saga'
import { choosePaymentSagaWatcher } from '../../../pages/CheckoutPage/ChoosePayment/ChoosePayment.saga'
import { doPaymentSagaWatcher } from '../../../pages/CheckoutPage/DoPayment/DoPayment.saga'
import { seoSagaWatcher } from '../../../components/SEO/Seo.saga'


// SAGA STEP 3. Root saga: Combine all saga, it's single entry point
export default function* rootSaga() {
  yield all([
    // Routines watcher
    routinesWatcherSaga,
    
    // Any my saga watcher
    productCategorySagaWatcher(),
    topupSagaWatcher(),
    tmpShopItemDialogSagaWatcher(),
    choosePaymentSagaWatcher(),
    doPaymentSagaWatcher(),
    seoSagaWatcher(),
  ]);
}


