(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[14],{

/***/ 277:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);


const autoFillForget = types => {
  const autoFill = { ..._store__WEBPACK_IMPORTED_MODULE_0__["store"].autoFill
  };
  types.forEach(type => delete autoFill[type]);
  const {
    username,
    password,
    otp
  } = autoFill;
  Object(_store__WEBPACK_IMPORTED_MODULE_0__["publish"])({
    autoFill: username || password || otp ? autoFill : {}
  });
};

/* harmony default export */ __webpack_exports__["default"] = (autoFillForget);

/***/ })

}]);
//# sourceMappingURL=14.js.map