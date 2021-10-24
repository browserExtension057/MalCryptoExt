(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[30],{

/***/ 392:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _rest_SaaspassExtensionResource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(283);


const getEpmPassword = async (appId, accId) => {
  const credentials = await Object(_rest_SaaspassExtensionResource__WEBPACK_IMPORTED_MODULE_0__["getPublicUserCredentialsForEpmAccount"])(appId, accId);
  return credentials.password;
};

/* harmony default export */ __webpack_exports__["default"] = (getEpmPassword);

/***/ })

}]);
//# sourceMappingURL=30.js.map