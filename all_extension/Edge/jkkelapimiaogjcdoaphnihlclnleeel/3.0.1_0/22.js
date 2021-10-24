(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[22],{

/***/ 322:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _cryptography__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(321);
/* harmony import */ var _rest_SaaspassExtensionResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(283);
/* harmony import */ var _rest_SaaspassUserResource__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(323);
/* harmony import */ var _rest_TokenEndpoint__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(317);
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(3);






const extensionLogin = async (username, password) => {
  const {
    publicKey,
    privateKey
  } = await Object(_cryptography__WEBPACK_IMPORTED_MODULE_0__["generateKey"])();
  const {
    access_token,
    refresh_token,
    server_public_key
  } = await Object(_rest_TokenEndpoint__WEBPACK_IMPORTED_MODULE_3__["getAccessToken"])(username, password, publicKey);
  Object(_store__WEBPACK_IMPORTED_MODULE_4__["publish"])({
    access_token,
    refresh_token,
    privateKey: btoa((await Object(_cryptography__WEBPACK_IMPORTED_MODULE_0__["getServerPublicKey"])(server_public_key, privateKey)))
  });
  const account = await Object(_rest_SaaspassUserResource__WEBPACK_IMPORTED_MODULE_2__["getAccount"])();
  Object(_store__WEBPACK_IMPORTED_MODULE_4__["publish"])({
    isHardTokenUser: account.roles.includes('ROLE_HARD_TOKEN_USER'),
    saaspassId: account.login
  });
  Object(_store__WEBPACK_IMPORTED_MODULE_4__["publish"])((await Object(_rest_SaaspassExtensionResource__WEBPACK_IMPORTED_MODULE_1__["getUserExtensionData"])()));
};

/* harmony default export */ __webpack_exports__["default"] = (extensionLogin);

/***/ }),

/***/ 323:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getAccount", function() { return getAccount; });
/* harmony import */ var _axios_createInstance__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(284);
/* harmony import */ var _axios_refreshTokenMiddleware__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(313);
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);



const axios = Object(_axios_createInstance__WEBPACK_IMPORTED_MODULE_0__["default"])(_axios_refreshTokenMiddleware__WEBPACK_IMPORTED_MODULE_1__["default"]);
const getAccount = async () => {
  const url = `app/rest/account`;
  const headers = {
    Authorization: `Bearer ${_store__WEBPACK_IMPORTED_MODULE_2__["store"].access_token}`
  };
  const response = await axios.get(url, {
    headers
  });
  return response.data;
};

/***/ })

}]);
//# sourceMappingURL=22.js.map