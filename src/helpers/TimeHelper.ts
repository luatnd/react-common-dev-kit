/**
 * Check if toBeCheck timestamp was expired with cachingTime
 *
 * @param toBeCheck Unix Timestamp
 * @param cachingTime caching time by seconds
 * @returns {boolean}
 */
import * as moment from 'moment';

export const wasExpired = (toBeCheck:number, cachingTime:number = 0) => {
  let maxAge = notThenNext(toBeCheck, 0);
  return maxAge + cachingTime < parseInt(moment().format('X'));
}