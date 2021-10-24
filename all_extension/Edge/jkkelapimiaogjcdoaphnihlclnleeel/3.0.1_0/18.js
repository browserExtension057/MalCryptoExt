(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[18],{

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

/***/ 332:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _qr_encode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(333);
/* harmony import */ var _rest_SaaspassBarcodeResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(389);



const getBarcodeImage = async sessionId => {
  const {
    barcodeimage
  } = await Object(_rest_SaaspassBarcodeResource__WEBPACK_IMPORTED_MODULE_1__["getBarcode"])(sessionId);
  return Object(_qr_encode__WEBPACK_IMPORTED_MODULE_0__["default"])(barcodeimage);
};

/* harmony default export */ __webpack_exports__["default"] = (getBarcodeImage);

/***/ }),

/***/ 333:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var qr_image__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(334);
/* harmony import */ var qr_image__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(qr_image__WEBPACK_IMPORTED_MODULE_0__);


const qrEncode = text => {
  const options = {
    ec_level: 'L',
    size: 3,
    margin: 3
  };
  const buffer = Object(qr_image__WEBPACK_IMPORTED_MODULE_0__["imageSync"])(text, options);
  const base64 = buffer.toString('base64');
  return `data:image/png;base64,${base64}`;
};

/* harmony default export */ __webpack_exports__["default"] = (qrEncode);

/***/ }),

/***/ 349:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 351:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 389:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getBarcode", function() { return getBarcode; });
/* harmony import */ var _axios_createInstance__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(284);

const axios = Object(_axios_createInstance__WEBPACK_IMPORTED_MODULE_0__["default"])();
const getBarcode = async uuid => {
  const url = `app/rest/barcode/${uuid}`;
  const response = await axios.get(url);
  return response.data;
};

/***/ })

}]);
//# sourceMappingURL=18.js.map