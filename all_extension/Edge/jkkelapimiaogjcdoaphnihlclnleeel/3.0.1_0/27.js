(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[27],{

/***/ 331:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);


const formDataUpdate = (username, password, port) => {
  const tab = port.sender.tab;
  const savedForm = _store__WEBPACK_IMPORTED_MODULE_0__["store"].formData.tabId === tab.id ? _store__WEBPACK_IMPORTED_MODULE_0__["store"].formData : {};

  if (username === savedForm.username && password === savedForm.password) {
    return;
  }

  Object(_store__WEBPACK_IMPORTED_MODULE_0__["publish"])({
    formData: {
      tabId: tab.id,
      username: username || savedForm.username,
      password: password || savedForm.password,
      title: savedForm.title || tab.title
    }
  });
};

/* harmony default export */ __webpack_exports__["default"] = (formDataUpdate);

/***/ })

}]);
//# sourceMappingURL=27.js.map