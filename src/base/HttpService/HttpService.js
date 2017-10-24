import { API_HOST } from '../../siteConfig'

export const getUrl = (uri, module) => {
  return module ? API_HOST + module + uri : API_HOST + uri;
}

/**
 * Generate query string from JSON object, with safe encodeURIComponent
 * @param {{}} queryStringData
 * @return string the
 */
export const encoder = queryStringData => Object.keys(queryStringData)
  .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryStringData[key])}`)
  .join('&');

/**
 * Fake an async request return $data after $time
 
 Usage:
   console.log("Start calling fake API");
   const requestTimeout = 2500;
   const responseDataFake = {
      status: Math.random() > 0.4 ? 200 : 400, // Random success or failure
      data: bookingFormSuccessResponse,
    };
   const response = yield call(fakeApiRequest(responseDataFake, requestTimeout));
   response.data.data = {...action.payload};
   console.log('Finish fake API: response: ', {...response});
 
 * @param fakeResponse
 * @param time
 */
export const fakeApiRequest = (fakeResponse, time) => () => {
  return new Promise(resolve => {
    console.log('start');
    setTimeout(() => {
      console.log('end');
      resolve(fakeResponse)
    }, time);
  })
};