/**
 * Created by nguyenluat on 2017/08/31.
 */
(function (self) {
  'use strict';
  
  //if (typeof notThisThenNext === 'undefined') {
  //  function notThisThenNext(a, b) {
  //    console.log('arguments: ', arguments);
  //    return a ? a : b;
  //  }
  //}
  
  if (self.notThenNext) {
    return;
  }
  
  /**
   * Usage: const card = undefinedThenNext(rates[cardId], null);
   * Usage: const card = undefinedThenNext(var1, var2, var3, ..., null);
   *
   * > console.log(card)
   * > 16 // If card is 16
   * > null // If card is undefined
   */
  self.undefinedThenNext = function () {
    if (arguments.length < 1) {
      throw new Error('Invalid arguments, undefinedThenNext require more than 1 args');
    }
    
    var returnValue = arguments[arguments.length - 1];
    for (var i = 0; i < arguments.length - 1; i++) {
      if (typeof arguments[i] !== 'undefined') {
        returnValue = arguments[i];
        break;
      }
    }
    
    return returnValue;
  }
  
  self.notThenNext = function () {
    if (arguments.length < 1) {
      throw new Error('Invalid arguments, notThenNext require more than 1 args');
    }
    
    var returnValue = arguments[arguments.length - 1];
    for (var i = 0; i < arguments.length - 1; i++) {
      if (typeof arguments[i] !== 'undefined' && arguments[i]) {
        returnValue = arguments[i];
        break;
      }
    }
    
    return returnValue;
  }
  
  /**
   * Usage: const card = notCallbackThenNext(callback, var1, var2, var3, ..., null);
   * callback is function(var1) return true or false;
   * If true then this fn return the value,
   * If false then this fn continue to check the next value,
   *
   * > const card = notCallbackThenNext(n => n>8, 5,6,9,0);
   * > const card2 = notCallbackThenNext(n => n>10, 5,6,9,0);
   * > console.log(card);
   * > 9
   * > console.log(card2);
   * > 0
   */
  self.notCallbackThenNext = function (checkCallback) {
    if (arguments.length < 1) {
      throw new Error('Invalid arguments, notCallbackThenNext require more than 2 args');
    }

    if (typeof checkCallback !== 'function') {
      throw new Error('notCallbackThenNext first arg must be a function, example: notCallbackThenNext(callback, arg1, arg2, ..., argN)');
    }
    
    var returnValue = arguments[arguments.length - 1];
  
    // Skip check callback as first arg
    for (var i = 1; i < arguments.length - 1; i++) {
      if (typeof arguments[i] !== 'undefined' && checkCallback(arguments[i])) {
        returnValue = arguments[i];
        break;
      }
    }
    
    return returnValue;
  }

  
  //self.notThenNext.polyfill = true; // What is this ?
})(typeof self !== 'undefined' ? self : this);
