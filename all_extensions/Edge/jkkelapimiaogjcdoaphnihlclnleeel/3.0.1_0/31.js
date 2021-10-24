(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[31],{

/***/ 393:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(api, browser) {/* harmony import */ var _rest_SaaspassExtensionResource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(283);


const loginWithApplication = async (appId, accId) => {
  const tracker = await Object(_rest_SaaspassExtensionResource__WEBPACK_IMPORTED_MODULE_0__["generateTrackerForAppAccount"])(accId, appId);
  const url = `${api.baseURL}/rest/loginSAML/extension/sso/${tracker}`;
  await browser.tabs.create({
    url
  });
};

/* harmony default export */ __webpack_exports__["default"] = (loginWithApplication);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(105), __webpack_require__(2)))

/***/ })

}]);
//# sourceMappingURL=31.js.map