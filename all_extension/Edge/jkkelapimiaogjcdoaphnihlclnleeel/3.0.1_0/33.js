(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[33],{

/***/ 395:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(api, browser) {/* harmony import */ var _rest_SaaspassExtensionResource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(283);


const portalLogin = async () => {
  const path = await Object(_rest_SaaspassExtensionResource__WEBPACK_IMPORTED_MODULE_0__["generateTrackerForPortal"])();
  const url = `${api.baseURL}/#${path}`;
  const tab = await browser.tabs.create({
    url
  });
};

/* harmony default export */ __webpack_exports__["default"] = (portalLogin);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(105), __webpack_require__(2)))

/***/ })

}]);
//# sourceMappingURL=33.js.map