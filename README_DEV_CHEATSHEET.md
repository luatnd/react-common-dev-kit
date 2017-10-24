Development cheatsheet
----------------------
Use for quick reference


Table of contents
=================

<details>

- [Development cheatsheet](#development-cheatsheet)
- [Table of content](#table-of-content)
- [Daily common task](#daily-common-task)
    - [Create new screen / new page](#create-new-screen--new-page)
      - [Create new route](#create-new-route)
      - [Create new state management (Redux reducer)](#create-new-state-management-redux-reducer)
    - [Router](#router)
      - [Navigate to new route](#navigate-to-new-route)
      - [Go back or forward](#go-back-or-forward)
      - [Get parameters from URL](#get-parameters-from-url)
    - [API interact with Redux saga](#api-interact-with-redux-saga)
      - [How to cache your API result](#how-to-cache-your-api-result)
- [Advance section](#advance-section)
    - [ES6 nested destructuring assignment](#es6-nested-destructuring-assignment)
    - [Create your own polyfil](#create-your-own-polyfil)
    - [Create your own node_modules](#create-your-own-node_modules)
    - [Redux dev tool advance](#redux-dev-tool-advance)
    - [Analyze the build](#analyze-the-build)
- [ES6 cheatsheet](#es6-cheatsheet)
    - [Const obj is mutable (This is apply for almost language)](#const-obj-is-mutable-this-is-apply-for-almost-language)
    - [Array](#array)
    - [Object](#object)
    - [Seq:](#seq)
    - [Sorted List](#sorted-list)
    - [xxx](#xxx)
- [Debugging](#debugging)
    - [`debugger` keyword](#debugger-keyword)
    - [Reactotron](#reactotron)
    - [Styling Console out put](#styling-console-out-put)
    - [How to modify SEO info for page:](#how-to-modify-seo-info-for-page)
- [Typescript](#typescript)
    - [import lodash, moment into typescript](#import-lodash-moment-into-typescript)
- [TDD with React JS how to](#tdd-with-react-js-how-to)

</details>


# Daily common task
### Create new screen / new page
TODO: Make a command line for quickly create new app
For example `ProductDetailPage`:
```
ProductDetailPage.jsx           --> Clone ShopPage.jsx and modify
ProductDetailPage.module.scss
ProductDetailPage.redux.ts
ProductDetailPage.saga.js
```

#### Create new route
src/base/router/rootRoutes.jsx
```
{
    // example: /product/126a89/Sản+phẩm+tên+dài
    path: '/product/:id/:productName',
    component: require('../../pages/ProductDetailPage/ProductDetailPape').default,
},
```
Learn more about path at https://github.com/pillarjs/path-to-regexp#parameters

#### Create new state management (Redux reducer)
TBW

### Router
#### Navigate to new route


```
/* Required spec:
    React v15
    react-router v4
    react-router-redux v5
*/

import { Link, NavLink, withRouter } from 'react-router-dom';
import { push as routerPush } from 'react-router-redux';

@withRouter
@connect()
export MyComponent extends React.Component {
  render () {
    return <ul className="nav navbar-nav">
     <li><a href="/">Traditional link</a></li>
     <li><NavLink to="/shop" activeClassName="active">React Router Link (Don't reload the browser)</NavLink></li>
     <li>
        <Link to="/shop_large">
            Nearly Similar to NavLink. it trigger the UI change. But this method does not trigger redux any action
        </Link>
     </li>
     <li>
         <a onClick={() => {this.props.history.push('/contact')}}>
            Contact (programatic go to link, `history` is from @withRouter) But this method change url only, not redux state (no action was dispatch)
         </a>
     </li>
     <li>
         <a onClick={() => {this.props.routerPush('/contact')}}>
            Contact (programatic trigger a redux action tp change router state).
            But do not trigger to change UI 
         </a>
     </li>
     <li>
         <Link to="/contact" onClick={() => this.props.routerPush('/contact')}>
             Trigger to change the UI AND dispatch redux action to change redux state.
             routerPush is from import { push as routerPush } from 'react-router-redux'
             But it still create a duplicate history from 2 action <Link/> and `routerPush`.
             TODO: Remove duplicated history
         </Link>
      </li>
     <li>
         <a onClick={() => {
            /**
            * import { push } from 'react-router-redux'
            * push() was expected to change url, and trigger redux action
            * But currently, push() do:
            *    - Trigger redux action
            *    - Change URL
            *    - Not trigger the UI change --> It's bug need to be fixed
            */
            routerComponentProps.push(targetUrl);
            
            /**
            * So that to trigger re-render the UI, we need to trigger browser history object.
            * But why replace()? ==> Because push() already push a item into browser history, we need to history.replace, not history.push
            */
            routerComponentProps.history.replace(targetUrl);
         }}>
            This trick is use for (React router v4 + react-router-redux v5.0-alpha)         
            Programatic navigate to a url:
             - Trigger redux
             - Change Url
             - Change UI
             Hope in the future, we don't need to do history.replace anymore
         </a>
      </li>
   </ul>
  }
}
```
#### Go back or forward
Need to dispatch the react-router-redux action only, every thing is good.
You don't need to custom history like you do with `push()`:
```
this.props.goBack();
this.props.goForward();
```


#### Get parameters from URL
Take a look at rootRouter again:
```
{
    // example: /product/126a89/Sản+phẩm+tên+dài
    path: '/product/:id/:productName',
    component: require('../../pages/ProductDetailPage/ProductDetailPage').default,
},
```

So you can get `:id` and `:productName`:
in `ProductDetailPage` component:
```
console.log(this.props.match.params.id)
console.log(this.props.match.params.productName)
```


Get from ?query:
```
// example: /product/126a89/Sản+phẩm+tên+dài?categoryId=23

import queryString from 'query-string';
const queryStr = this.props.location.search;
const queryStringObj = queryString.parse(queryStr);
const categoryId = queryStringObj.categoryId;
console.log(categoryId);
```

Get from @withRouter to @connect
 ```
 function mapStateToProps(state, ownProps) {
   return {
     id: ownProps.params.id,
     filter: ownProps.location.query.filter
   };
 }
 ```

### API interact with Redux saga
TBW
```
// 1. create action (saga routines)
// 2. redux reducer
// 3. saga worker, watcher 
// 4. dispatch action from component
// 5. Fake API calling and Use offline mockData
```
1. create action (saga routines)
2. redux reducer
3. saga worker, watcher 
4. dispatch action from component
5. Fake saga API calling and Use offline mockData

```
  import { fakeApiRequest } from 'base/HttpService/HttpService'
  
  console.log("Start calling fake API");
  const requestTimeout = 4000;
  const responseDataFake = {
    status: Math.random() > 0.5 ? 200 : 400, // Random success or failure
    data: bookingFormSuccessResponse,
  };
  const response = yield call(fakeApiRequest(responseDataFake, requestTimeout));
  console.log('Finish fake API: response: ', response);
```      
    

**Error you often struggle with:**
> The redux dev tool show the action name is: @@redux-saga-routines/PROMISE

The error cause by you forgot to call `.trigger()`:
```
// In-correct
this.props.sagaAction(payload);
// Correct
this.props.sagaAction.trigger(payload);
```

#### How to cache your API result
In the future, you have to cache your API in Cache API (Service Worker),
But currently, That's not all browser support it, so that we use cached in redux reducer.

You'll notice that we have `maxAge` key in reducer, here are the step:
1. Rehydrate your redux store: Use redux-persist: Read from indexed DB into redux store
2. You'll see `state.persist.rehydrated` === `false` after your store was rehydrated.
    2.1. If we're in hydrating process: Render your component with loading status, that make user feel like your page is loading
    2.2. If hydrating process was completed:
        2.2.1. If `maxAge` was expired then try to fetch new data from API in you `componentDidMount()`
        2.2.2. If `maxAge` was NOT expired then nothing to care here

NOTE: You need to carefully check the `rehydrated` state all the time you write the code, 
especially `shouldComponentUpdate()`, you might forgot to re-render your component.
For example:
```
  // NOTE: this.props.rehydrated was always use AND condition with other cond.  
   
  componentWillMount() {
    if (this.props.rehydrated && this.props.expired) {
      this.fetchNewDataFromAPI();
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.rehydrated && nextProps.expired && !nextProps.loading) {
      this.fetchNewDataFromAPI();
    }
  }
  
  shouldComponentUpdate(nextProps) {
    return (
      nextProps.rehydrated !== this.props.rehydrated
      || somethingChanged
    );
  }
```

NOTE2: You need to ensure handle rehydrate in `componentWillMount` and `componentWillReceiveProps`:
```
  componentWillMount() {
    if (this.props.rehydrated) {
      this.props.sagaGetTopupCardAndRate.trigger();
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.rehydrated && THE_REFETCH_CONDITION) {
      this.props.sagaGetTopupCardAndRate.trigger();
    }
  }
```
This way will improve user UX but harmful to your device performace because:
Rehydration complete will cause all your component re-render :( 


NOTE 3: If your component need to fetch API al the time component will mount, it will be like this:
```
  state = {
    sagaGetTopupCardAndRateTriggered: false,
  }
  
  componentWillMount() {
    if (this.props.rehydrated) {
      this.sagaGetTopupCardAndRateTrigger();
    }
  }
  
  componentWillReceiveProps(nextProps) {
    // nextProps.cards is not empty after rehydration if user already persist it. So that we need to use state.sagaGetTopupCardAndRateTriggered
    if (nextProps.rehydrated && (isEmpty(nextProps.cards) || !this.state.sagaGetTopupCardAndRateTriggered)) {
      this.sagaGetTopupCardAndRateTrigger();
    }
  }
  
  sagaGetTopupCardAndRateTrigger = () => {
    this.setState({sagaGetTopupCardAndRateTriggered: true})
    this.props.sagaGetTopupCardAndRate.trigger();
  }
```

NOTE4: Do NOT dispatch any action until rehydrated: 
* To ensure component performance and 
* To avoid rehydration overwrite your working state, 
    because some prev action was finish before and set the state 
    --> Rehydration complete after 
    --> Rehydration data overwrite your old data.
    If you can not ensure your hydration state is correct and full format, you should not dispatch any action before hydration complete.
    You `can not ensure` mean in your redux-persist, you've used transform filter, blacklist, whitelist, 
    so that your state will be a minimized status after rehydration.



NOTE 5: **All the PAIN above was resolve by:**
```
render() {
    const {rehydrated} = this.props;
    
    /**
     * NOTE: You must call renderRehydrate if ryhydration was not complete 
     */
    if (!rehydrated) {
      return this.renderRehydrate();
    }
    
    return (<span>Original content was here</span>)
}

/**
* Replace all your place holder here with loading state, try to imitate the shape of your result screen
* This must be static method, that not depend on state or props
*/
renderRehydrate() {
  return (<span>This screen placeholder with loading status UI</span>);
}
```

# Advance section

### ES6 nested destructuring assignment
```
const {
  match:{
    params:{
      checkoutTarget,
      stepSlug
    }
  }
} = this.props;
console.log(checkoutTarget); // >xxxxx was printed
console.log(params); // >Undefined
```

### Create your own polyfil
TBW

### Create your own node_modules
TBW

### Redux dev tool advance
* Time travel
* Commit, revert, sweep, reset



### Analyze the build
```
yarn build -- --source-map
yarn analyze
```

# ES6 cheatsheet

### Const obj is mutable (This is apply for almost language)
Carefully when you introduce a variable outside of your scope.
Obj const is mutable, so that if you put obj const outside of your component, you must read obj const as clone. See this wrong code:
```
const initialState = {foo: 0};
@connect((state) => {
    let a = initialState; // Assign a = pointer of initialState; so now: a may not be `{foo:0}`, instead, a can be `{foo:99}` 
    a.foo = a.foo++; // Intend to increase foo from 0 to 1 only. But this code will make foo has no-boundary
    
    return {a}
})
export default class ExampleComponent extends React.PureComponent {}
```
This will increase `a.foo` each time your component connect.
To fix it, we must use clone:
```
const initialState = {foo: 0};
@connect((state) => {
    let a = {...initialState}; // a = Clone of initialState  
    a.foo = a.foo++; // Intend to increase foo from 0 to 1 only. But this code will make foo has no-boundary
    
    return {a}
})
export default class ExampleComponent extends React.PureComponent {}
```


### Array
All basic here:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array

Loop over array basic with value base on index:
```
for (let i = 0, l = arr.length; i < l; i++) {
  const v = arr[i];
  break;
  continue;
}
```

Loop over array (breakable) to do something, no return anything.
```
let iterable = [10, 20, 30];
for (let value of iterable) {
  value += 1;
  console.log(value);
}

// Do not forget the:
for (var index in myArray) {}
```

 

Loop over array (non-breakable) to do something, no return anything.
```
arrayFoo.forEach((element, index) => {
    console.log(`Current index: ${index}`);
    console.log(element);
});
arr.forEach(function callback(currentValue, index, array) {
    //your iterator
}[, thisArg]);
```

transform an array into a new array with value make by callback :
```
const doubledArray = arr.map((v, i) => {
  return v * 2;
})
```

Filter: 
```
[{a:1}, {a:2}, {a:8}].filter(v => v.a < 6); // > [{a:1}, {a:2}]
```

Reduce:


Find by callback:
```
[{a:1}, {a:2}, {a:8}].pickBy(v => v.a > 7); // > {a:8}
[{a:1}, {a:2}, {a:8}].pickBy((v, k) => k > 1); // > {a:8}
```

Array to object: `mapToObject(getObjectKeyFn)`
Available at 
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

Lodash

### Object

Init object with list of key from array with values or fixed value.
```
{}.fillKeyFromArray([a,b,c,d], 6); > {{a:6}, {b:6}, {c:6}, {d:6}}
```

Loop over props object:
```
for (var prop in obj) {
  if (obj.hasOwnProperty(prop)) {
    console.log(`obj.${prop} = ${obj[prop]}`);
  } 
}
```

Lodash

### Seq:

### Sorted List

### xxx


# Debugging
### `debugger` keyword

### Reactotron

### Styling Console out put
https://developers.google.com/web/tools/chrome-devtools/console/console-write#styling_console_output_with_css


### How to modify SEO info for page:
Add new entry for `/pubic/seo.conf.json`
We might need to restart the webserver to reload `seo.conf.json`


# Typescript
### import lodash, moment into typescript
```
import * as moment from 'moment' // Import as module
import omit = require("lodash/omit") // Import as function, for more: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/13337
```


# TDD with React JS how to
How to develop React with Test Driven Development.
TBW