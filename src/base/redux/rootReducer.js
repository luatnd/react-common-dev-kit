// 3rd reducers: Declare here + rootReducer + reducerPersists
import { i18nReducer } from "react-redux-i18n";
import { routerReducer } from 'react-router-redux';

// My reducers: Declare here + myReduxes, this program will do all the rest.
import * as Persist from './persist/Persist.redux';
import * as ProductCategory from "../../components/ProductCategory/ProductCategory.redux";
import * as TmpShopItemDialog  from "../../pages/ShopPage/TmpShopItemDialog/TmpShopItemDialog.redux";
import * as Topup  from "../../pages/ShopPage/Topup/Topup.redux";
import * as CheckoutPage from "../../pages/CheckoutPage/CheckoutPage.redux";
import * as Seo  from "../../components/SEO/Seo.redux";


/**
 * Define your redux here, your redux must include:
 *    name    ==> Reducer name in redux store
 *    reducer ==> Your reducer code
 *    persist ==> Persist it to indexed db or not ? which key need to persist, which one not.
 *
 * The program will base on your info and do all the rest
 */
export const myReduxes = [
  // We do not use `require()` because its synchronous, use `import` of ES6 instead for future improvement
  //require('./persistReducer'),
  
  Persist,
  ProductCategory,
  TmpShopItemDialog,
  Topup,
  CheckoutPage,
  Seo,
];

export const thirdPartyReducers = {
  //reducerKey: reducer,
  i18n: i18nReducer,
  router: routerReducer,
}

export const thirdPartyReducerPersist = {
  //reducerKey: reducerPersist,
  i18n: false, // Because i18 is store in json already, we don't need to make the hydration more heavy
  router: false,
}