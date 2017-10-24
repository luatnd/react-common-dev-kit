//import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
//import 'react-hot-loader/patch';
//import { AppContainer } from 'react-hot-loader';
import { store, rehydrationPromise } from './base/redux/configureStore';
import AppRoute from './base/router/AppRoute';

import './index.css';
import registerServiceWorker from './registerServiceWorker';


// Async persist store ...
rehydrationPromise.then(() => {});

// While we render the app immediately
ReactDOM.render(
  <Provider store={store}>
    {/*<SocketWrapper>*/}
    <AppRoute/>
    {/*</SocketWrapper>*/}
  </Provider>
  , document.querySelector('#root')
);

registerServiceWorker();
