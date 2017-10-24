/**
 * Generate query string from JSON object, with safe encodeURIComponent
 * @param {{}} queryStringData
 * @return string the
 */
export const encoder = (queryStringData:any) => Object.keys(queryStringData)
  .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryStringData[key])}`)
  .join('&');

/**
 * Make a safely and readable string to put on URL.
 * Encode string url and change %20 to +
 *
 * @param {string} urlComponent
 * @returns {*}
 */
export const getFriendlyUrlComponent = (urlComponent:string):string => {
  urlComponent = removeDangerousChar(urlComponent);
  return encodeURIComponent(urlComponent)
  .replace(/%20/g, '+')
  .replace(/%2C/g, ',')
  ;
}
export const restoreStringFromFriendlyUrl = (urlFriendly:string):string => {
  return urlFriendly.replace(/\+/g, ' ');
}

/**
 * Bad practice function
 *
 * @param str
 * @returns {string}
 */
function removeDangerousChar(str:string) {
  return str.replace(/%/g, ' phần trăm');
}
