import { getAllMapper, getDispatchMapper, getRoutineMapper } from './dispatch'
import {
  createBlacklistFilter,
  createWhitelistFilter,
} from 'redux-persist-transform-filter';

export { getAllMapper, getDispatchMapper, getRoutineMapper };

export const getCombinedPersistFilters = (persists) => {
  const filters = [];
  
  for (let rootReducerName of Object.keys(persists)) {
    const persist = persists[rootReducerName];
    
    if (typeof persist === 'boolean') {
      if (persist) {
        // PERSIST ALL:
        // Default case is whitelist,
        // so if you wanna whitelist, you don't need to defined
      } else {
        // IGNORE PERSIST: the entire reducer. It's mean save no thing:
        // InboundState: Redux to storage: Allow nothing
        // OutboundState: Storage to redux: Allow all
        filters.push(createWhitelistFilter(rootReducerName, []));
      }
    } else if (typeof persist === 'object') {
      // IGNORE PERSIST the specific children
      const blackListPaths = getBlackListPaths(persist);
      
      // InboundState: Redux to storage: Block nothing
      // OutboundState: Storage to redux: Block some path
      filters.push(createBlacklistFilter(rootReducerName, null, blackListPaths));
    } else {
      throw new Error(`[base/redux/utils.js:getCombinedPersistFilters()] [reducer: ${rootReducerName}] Invalid persist type, got '${typeof persist}' instead of 'boolean' or 'object'`);
    }
  }
  
  return filters;
}

const getBlackListPaths = (persists, prefix = '') => {
  let blacklist = [];
  
  for (let key of Object.keys(persists)) {
    let persist = persists[key];
    const keyPath = prefix ? `${prefix}.${key}` : key;
    
    if (typeof persist === 'boolean') {
      if (persist) {
        // PERSIST ALL:
        // Default case is whitelist,
        // so if you wanna whitelist, you don't need to defined
      } else {
        // IGNORE PERSIST
        blacklist.push(keyPath)
      }
    } else if (typeof persist === 'object') {
      
      blacklist = blacklist.concat(getBlackListPaths(persist, keyPath));
      
    } else {
      throw new Error(`[base/redux/utils.js:getCombinedPersistFilters()] [reducer: ${key}] Invalid persist type, got '${typeof persist}' instead of 'boolean' or 'object'`);
    }
  }
  
  return blacklist;
}
