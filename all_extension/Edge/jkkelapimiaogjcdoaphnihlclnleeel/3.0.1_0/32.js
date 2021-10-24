(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[32],{

/***/ 242:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const delay = t => new Promise(resolve => setTimeout(resolve, t));

/* harmony default export */ __webpack_exports__["default"] = (delay);

/***/ }),

/***/ 394:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(browser, api) {/* harmony import */ var _common_delay__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(242);
/* harmony import */ var _rest_SaaspassExtensionResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(283);



const portalImportPasswordManager = async () => {
  const path = await Object(_rest_SaaspassExtensionResource__WEBPACK_IMPORTED_MODULE_1__["generateTrackerForPortal"])();
  const tab = await browser.tabs.create({
    url: `${api.baseURL}/#${path}`
  });
  await Object(_common_delay__WEBPACK_IMPORTED_MODULE_0__["default"])(4000);
  const url = `${api.baseURL}/#/public-user-accounts/import`;
  await browser.tabs.update(tab.id, {
    url
  });
};

/* harmony default export */ __webpack_exports__["default"] = (portalImportPasswordManager);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(2), __webpack_require__(105)))

/***/ })

}]);
//# sourceMappingURL=32.js.map