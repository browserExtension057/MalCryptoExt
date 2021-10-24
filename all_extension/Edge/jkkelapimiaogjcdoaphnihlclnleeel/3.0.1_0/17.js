(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[17],{

/***/ 284:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(api) {/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(285);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _isLoadingMiddleware__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(312);



const createInstance = (...middlewares) => {
  const instance = axios__WEBPACK_IMPORTED_MODULE_0___default.a.create({
    baseURL: api.baseURL
  });
  Object(_isLoadingMiddleware__WEBPACK_IMPORTED_MODULE_1__["default"])(instance);
  middlewares.forEach(middleware => middleware(instance));
  return instance;
};

/* harmony default export */ __webpack_exports__["default"] = (createInstance);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(105)))

/***/ }),

/***/ 312:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);

let activeRequests = 0;

const notify = type => {
  activeRequests += type === 'request-start' ? 1 : -1;

  if ([0, 1].includes(activeRequests)) {
    Object(_store__WEBPACK_IMPORTED_MODULE_0__["publish"])({
      activeRequests
    });
  }
};

const requestFulfilled = config => {
  notify('request-start', config);
  return config;
};

const requestRejected = error => {
  notify('request-error', error);
  return Promise.reject(error);
};

const responseFulfilled = response => {
  notify('response-success', response);
  return response;
};

const responseRejected = error => {
  notify('response-error', error);
  return Promise.reject(error);
};

const isLoadingMiddleware = instance => {
  instance.interceptors.request.use(requestFulfilled, requestRejected);
  instance.interceptors.response.use(responseFulfilled, responseRejected);
};

/* harmony default export */ __webpack_exports__["default"] = (isLoadingMiddleware);

/***/ }),

/***/ 325:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _rest_PushLoginRestController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(326);


const extensionPushLogin = (username, sessionId) => Object(_rest_PushLoginRestController__WEBPACK_IMPORTED_MODULE_0__["initiateSaaspassWebPushLogin"])(username, sessionId);

/* harmony default export */ __webpack_exports__["default"] = (extensionPushLogin);

/***/ }),

/***/ 326:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initiateSaaspassWebPushLogin", function() { return initiateSaaspassWebPushLogin; });
/* harmony import */ var _axios_createInstance__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(284);

const axios = Object(_axios_createInstance__WEBPACK_IMPORTED_MODULE_0__["default"])();
const initiateSaaspassWebPushLogin = async (username, sessionId) => {
  const url = `app/rest/pushlogin/saaspass`;
  const params = {
    username,
    sessionid: sessionId
  };
  const response = await axios.get(url, {
    params
  });
  return response.data;
};

/***/ })

}]);
//# sourceMappingURL=17.js.map