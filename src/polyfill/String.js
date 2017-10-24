
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
if (!String.prototype.nl2br) {
  Object.defineProperty(String.prototype, 'nl2br', {
  
    /**
     * Fill key with value from value or value list
     *
     * @param keyList
     * @param {*|[*]} valueOrValueList If is array --> Fill with array index value. ELSE fill with value.
     * @returns {object} with key and value
     */
    value: function () {
      console.warn("This was deprecated, please use `import nl2br from 'locutus/php/strings/nl2br'` instead");
      
      // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }
      
      var s = this;
  
      s= s.replace(/\r?\n/g, '<br/>');

      // Return value
      return s;
    }
  });
} else {
  console.warn(`=================================================
[src/polyfill/String.js] String.prototype.nl2br already defined, you might review this polyfill to avoid conflict in logic
=================================================
`);
}


if (!String.prototype.replacePair) {
  Object.defineProperty(String.prototype, 'replacePair', {
  
    /**
     *
     *
     * @param {{toBeFindStr1: 'toBeReplaceStr1'}, {toBeFindStrN: 'toBeReplaceStrN'}} pairObj
     * @returns {object} with key and value
     */
    value: function (pairObj) {
      // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }
      
      var s = this;
  
      for (var toBeFind in pairObj) {
        if (pairObj.hasOwnProperty(toBeFind)) {
          s = s.replace(toBeFind, pairObj[toBeFind])
        }
      }

      // Return value
      return s;
    }
  });
} else {
  console.warn(`=================================================
[src/polyfill/String.js] String.prototype.replacePair already defined, you might review this polyfill to avoid conflict in logic
=================================================
`);
}

