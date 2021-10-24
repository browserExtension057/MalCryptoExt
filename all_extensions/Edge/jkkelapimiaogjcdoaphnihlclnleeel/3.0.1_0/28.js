(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[28],{

/***/ 390:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _rest_SaaspassExtensionResource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(283);


const getCredentials = async (type, accId, isShared) => {
  const {
    otp,
    password
  } = isShared ? await Object(_rest_SaaspassExtensionResource__WEBPACK_IMPORTED_MODULE_0__["getCorporateServiceAccountCredentials"])(accId, type) : await Object(_rest_SaaspassExtensionResource__WEBPACK_IMPORTED_MODULE_0__["getPublicUserAccountCredentials"])(accId, type);
  return otp || password;
};

/* harmony default export */ __webpack_exports__["default"] = (getCredentials);

/***/ })

}]);
//# sourceMappingURL=28.js.map