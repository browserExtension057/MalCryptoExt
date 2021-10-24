(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[24],{

/***/ 328:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);


const formDataGet = port => {
  if (_store__WEBPACK_IMPORTED_MODULE_0__["store"].formData.tabId === port.sender.tab.id) {
    return _store__WEBPACK_IMPORTED_MODULE_0__["store"].formData;
  }
};

/* harmony default export */ __webpack_exports__["default"] = (formDataGet);

/***/ })

}]);
//# sourceMappingURL=24.js.map