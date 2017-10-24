
/**
 * a = [{"id":5,"name":"John"},{"id":6,"name":"Smath"},{"id":7,"name":"Martha"},{"id":8,"name":"Teeka"}]
 *
 * a.pickBy((v) => v.id === 6)
 * > {id: 6, name: "Smath"}
 *
 * a.pickBy((v, i) => v.id === 6 && i > 0)
 * > {id: 6, name: "Smath"}
 *
 * a.pickBy((v) => v.name === "Smath_XXX")
 * > null
 *
 * NOTE: the callback as a param of pickBy can modify the original Array, so be careful
 */
if (!Object.prototype.fillKeyFromArray) {
  Object.defineProperty(Object.prototype, 'fillKeyFromArray', {
  
    /**
     * Fill key with value from value or value list
     *
     * @param keyList
     * @param {*|[*]} valueOrValueList If is array --> Fill with array index value. ELSE fill with value.
     * @returns {object} with key and value
     */
    value: function (keyList = [], valueOrValueList) {
      
      // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }
      
      var o = this;
  
      if (typeof valueOrValueList === 'undefined') {
        for (let i = 0, l = keyList.length; i < l; i++) {
          o[keyList[i]] = 0;
        }
      } else {
        if (Array.isArray(valueOrValueList)) {
          for (let i = 0, l = keyList.length; i < l; i++) {
            o[keyList[i]] = valueOrValueList[i];
          }
        } else {
          for (let i = 0, l = keyList.length; i < l; i++) {
            o[keyList[i]] = valueOrValueList;
          }
        }
      }

      // Return value
      return o;
    }
  });
} else {
  console.warn(`=================================================
[src/polyfill/Object.js] Object.prototype.fillKeyFromArray already defined, you might review this polyfill to avoid conflict in logic
=================================================
`);
}


if (!Object.prototype.pSlice) {
  Object.defineProperty(Object.prototype, 'pSlice', {
    
    /**
     Slice method for Object.
     Pick some key of object return by Object.keys(obj).slice(a,b);
     NOTE: The order is not guaranty, so it's might lead to a bug, be careful
     Inspiration by Array slice:
     
     arr.slice()
     arr.slice(begin)
     arr.slice(begin, end)
     
     * @param begin
     * @param end
     * @returns {value}
     */
    value: function (begin, end) {
      
      // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }
      
      var o = this;
      const newO = {};
      
      const props = Object.keys(o).slice(begin, end);
      for (var prop of props) {
        newO[prop] = o[prop];
      }
      
      // Return value
      return newO;
    }
  });
} else {
  console.warn(`=================================================
[src/polyfill/Object.js] Object.prototype.pSlice already defined, you might review this polyfill to avoid conflict in logic
=================================================
`);
}


// Be sure To avoid use common name, if 2 libs are overwrite object with same method name then conflict.
//if (!Object.prototype.toJSON) {
//  Object.defineProperty(Object.prototype, 'toJSON', {
//    value: function () {
//
//      // 1. Let O be ? ToObject(this value).
//      if (this == null) {
//        throw new TypeError('"this" is null or not defined');
//      }
//
//      var o = this;
//
//      // Return value
//      return JSON.stringify(o);
//    }
//  });
//} else {
//  console.warn(`=================================================
//[src/polyfill/Object.js] Object.prototype.toJSON already defined, you might review this polyfill to avoid conflict in logic
//=================================================
//`);
//}

