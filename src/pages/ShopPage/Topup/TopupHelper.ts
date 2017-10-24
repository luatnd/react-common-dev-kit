import { carriers } from './mockDataTopupMethods';

export interface HistoryType {
  time:number|string,
  phone:string,
  carrierId:string,
  rateId:number,
}

export const getHistoryKey = (historyEntry:HistoryType):string => {
  return historyEntry.carrierId + historyEntry.rateId + historyEntry.phone;
}

/**
 *
 * @param carrierId
 * @return {{name, logo}}
 */
export const getCarrierById = (carrierId:string) => {
  return carriers[carrierId];
}