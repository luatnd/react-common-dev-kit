import { API_HOST } from 'config';
import 'whatwg-fetch'
import queryString from 'query-string';
import objectToFormData from 'object-to-formdata';
import { store, rehydrationPromise } from '../redux/configureStore'
import pickBy from 'lodash/pickBy';
import identity from 'lodash/identity';

export class HttpServiceFetch {
  
  store = store;

  tradeshow_pk = 1;

  get state() {
    return store.getState();
  }

  constructor() {

  }

  get(url, body = {}, requestOptions, toJson) {
    return this.fetch(this.buildQueryString(url, body), requestOptions);
  }

  postAsJson(url, body = {}, requestOptions = {}, toJson) {
    requestOptions.body = JSON.stringify(body);
    requestOptions.method = requestOptions.method || 'POST';
    return this.fetch(url, requestOptions);
  }

  postAsForm(url, body = {}, requestOptions, toJson) {
    let formData = objectToFormData(pickBy(body, identity));
    return this.postForm(url, formData, requestOptions, toJson);
  }

  postForm(url, formData, requestOptions = {}, toJson) {
    requestOptions.body = formData;
    requestOptions.method = requestOptions.method || 'POST';
    return this.fetch(url, requestOptions);
  }

  fetch(url, requestOptions, toJson = true) {
    const promise = this.makeRequestOptions(requestOptions)
      .then(this.rawFetch(url));
    if (toJson) {
      return promise.then(this.toJson);
    } else {
      return promise;
    }
  }

  fetchUrl(url, requestOptions, toJson = true) {
    const promise = this.makeRequestOptions(requestOptions)
      .then(this.pureFetch(url))
    if (toJson) {
      return promise.then(this.toJson);
    } else {
      return promise;
    }
  }

  buildQueryString = (url, body = {}) => {
    return url + '?' + queryString.stringify(body, {arrayFormat: 'bracket'})
  };
  toJson = response => response.json();
  rawFetch = url => this.pureFetch(`${API_HOST}${url}`);
  pureFetch = url => requestOptions => {
    return fetch(url, requestOptions).then(this.handleError);
  };

  handleError = (response) => {
    if (!response.ok) {
      return Promise.reject(response);
    }
    return response;
  }

  makeRequestOptions = (requestOptions = {}) => {
    const token = this.state.auth.data.token;
    const headers = requestOptions.headers || new Headers();
    if (token) {
      headers.append('Authorization', `Token ${token}`);
      console.log(token, headers);
    }
    return Promise.resolve({
      ...requestOptions,
      mode: 'cors',
      headers
    });
  }
}