
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
if (!Array.prototype.pickBy) {
  Object.defineProperty(Array.prototype, 'pickBy', {
    value: function (callback) {
      
      // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }
      
      var a = this;
  
      for (var i = 0; i < a.length; i++) {
        if (callback(a[i], i)) {
          return a[i];
        }
      }

      // 8. Return false
      return null;
    }
  });
} else {
  console.warn(`=================================================
[src/polyfill/Array.js] Array.prototype.pickBy already defined, you might review this polyfill to avoid conflict in logic
=================================================
`);
}

if (!Array.prototype.mapToObject) {
  Object.defineProperty(Array.prototype, 'mapToObject', {
    /**
     Array to object: `mapToObject(getObjectKeyFn)`
     As same as Lodash/keyBy: https://lodash.com/docs/4.17.4#keyBy
   
     ```
     // Basic usage:
     const getObjectKeyFn = user => user.id;
     const fooObj = [
     {id: 1, name: "Sub Zero", age: 20},
     {id: 4, name: "Scorpion", age: 18},
     {id: 6, name: "Raiden", age: 21},
     {id: "3b1Gh6", name: "Johny Cage", age: 25},
     ].mapToObject(getObjectKeyFn);
   
     console.log(fooObj);
     > {
     >   "1": {id: 1, name: "Sub Zero", age: 20},
     >   "4": {id: 4, name: "Scorpion", age: 18},
     >   "6": {id: 6, name: "Raiden", age: 21},
     >   "3b1Gh6": {id: "3b1Gh6", name: "Johny Cage", age: 25},
     > }
   
     // Advance: Remove some key of ele
     const valueTransformFn = obj => lodash.pick(obj, ['id', 'name']);
     const fooObj2 = [
     {id: 1, name: "Sub Zero", age: 20},
     {id: 4, name: "Scorpion", age: 18},
     {id: 6, name: "Raiden", age: 21},
     {id: "3b1Gh6", name: "Johny Cage", age: 25},
     ].mapToObject(getObjectKeyFn, valueTransformFn);
   
     console.log(fooObj2);
     > {
     >   "1": {id: 1, name: "Sub Zero"},
     >   "4": {id: 4, name: "Scorpion"},
     >   "6": {id: 6, name: "Raiden"},
     >   "3b1Gh6": {id: "3b1Gh6", name: "Johny Cage"},
     > }
     ```
   
     * @param {function} getObjectKeyFn The function that return key
     * @param {function} valueTransformFn You can remove some obj props or remove props, transform the object as you want before assign it to the result
     * @returns {{object}}
     */
    value: function (getObjectKeyFn, valueTransformFn) {
      getObjectKeyFn = getObjectKeyFn || (obj => obj.id);
    
      // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }
    
      var a = this;
      const o = {};
    
      a.forEach(objElement => {
        if (typeof objElement === 'object') {
          o[getObjectKeyFn(objElement)] = valueTransformFn ? valueTransformFn(objElement) : objElement;
        } else {
          throw new Error("[src/polyfill/Object.js] Invalid array, expected an array of object");
        }
      });
    
      // Return value
      return o;
    }
  });
} else {
  console.warn(`=================================================
[src/polyfill/Array.js] Array.prototype.mapToObject already defined, you might review this polyfill to avoid conflict in logic
=================================================
`);
}

