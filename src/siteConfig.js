export const inProdMode = (process.env.NODE_ENV === 'production'); //production, development, test
//export const inProdMode = true;

export const API_HOST_MOCK = 'https://redux-persist-mock.herokuapp.com/';
export const API_HOST_DEV  = 'https://redux-persist-mock.herokuapp.com/';
export const API_HOST_PROD = 'https://redux-persist-mock.herokuapp.com/';

export const API_VERSION = `v1`;
export const API_HOST = inProdMode ? API_HOST_PROD : API_HOST_DEV;

let host = '';
try {
  host = window.location.origin;
} catch (e) {
  console.error(e);
  throw new Error('TODO: [src/siteConfig.js] Can not get window.location.origin, do you run server side rendering, you need to fix this code section.');
}
export const HOST = host + '/';


export const STATUS_CODE = {
  SUCCESS: 200,
};

export const Api = {
  seoConf: {method: 'get', uri: 'seo.conf.json'},
  common: {
    allProduct: {method: 'post', uri: '/Campaign/getCampaigns'},
    campaign: {
      getByCategory: {method: 'post', uri: '/Campaign/getCampaignByCategory'},
      getCampaignAndCategory: {method: 'post', uri: '/Campaign/v2/getCampaignsV2'},
    },
  },
  banking: {
    getBanks: {method: 'post', uri: '/EpayBanks/getBanks'},
    topup: {method: 'post', uri: '/Topups/topup'},
    topupV2: {method: 'post', uri: '/Topups/v2/topupV2'},
    topupRates: {method: 'post', uri: '/TopupRates/getAll'},
  },
  cms: {
    tmpBooking: {method: 'post', uri: '/TmpBooking/booking'},
  }
};


/**
 * TODO: Merge this `SITE_URLS` with above `Api` and `react-router json config` --> change route to support nested config
 * This is a Redundant (bad) code section
 */
export const SITE_URLS = {
  shop:{
    uri: 'shop',
  },
  checkout:{
    uri: 'checkout',
    topup: {
      uri: 'topup',
      choosePayment: 'phuong-thuc-thanh-toan',
      paymentSuccess: 'thanh-toan-thanh-cong',
      paymentUnSuccess: 'thanh-toan-khong-thanh-cong',
    },
  },
}
