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
if (!Number.prototype.toSmartPrecision) {
  
  Object.defineProperty(Number.prototype, 'toSmartPrecision', {
    
    /**
     * Format float number to precision and remove redundant character
     * @param precision
     * @param {'round'|'floor'} mathAction
     * @returns {Number}
     */
    
    
    
    value: function (precision, mathAction = 'round') {
      
      var n = this;
  
      if (mathAction === 'floor') {
        n = Math.floor10(n, -precision);
      } else {
        // Default action
        n = n.toPrecision(precision);
      }
      
      n = n.toString().replace(/(\.(0+)?([1-9]+)?)(0+)$/, '$1'); // Remove redundant Zero number at the end of decimals
      return parseFloat(n);
      
    }
  });
} else {
  console.warn(`=================================================
[src/polyfill/Number.js] Number.prototype.toSmartPrecision already defined, you might review this polyfill to avoid conflict in logic
=================================================
`);
}


// Closure
(function () {
  /**
   * Decimal adjustment of a number.
   *
   * @param {String}  type  The type of adjustment.
   * @param {Number}  value The number.
   * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
   * @returns {Number} The adjusted value.
   */
  function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }
  
  // Decimal round
  if (!Math.round10) {
    Math.round10 = function (value, exp) {
      return decimalAdjust('round', value, exp);
    };
  }
  // Decimal floor
  if (!Math.floor10) {
    Math.floor10 = function (value, exp) {
      return decimalAdjust('floor', value, exp);
    };
  }
  // Decimal ceil
  if (!Math.ceil10) {
    Math.ceil10 = function (value, exp) {
      return decimalAdjust('ceil', value, exp);
    };
  }
})();
