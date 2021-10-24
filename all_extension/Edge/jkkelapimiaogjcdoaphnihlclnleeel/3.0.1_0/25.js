(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[25],{

/***/ 329:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _reloadUserData__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(330);
/* harmony import */ var _rest_SaaspassExtensionResource__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(283);
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);




const formDataSave = async port => {
  const tab = port.sender.tab;
  const form = _store__WEBPACK_IMPORTED_MODULE_2__["store"].formData.tabId === tab.id ? _store__WEBPACK_IMPORTED_MODULE_2__["store"].formData : {};
  const {
    username,
    password
  } = form;
  const [urlWithoutHash] = tab.url.split('#');

  try {
    await Object(_rest_SaaspassExtensionResource__WEBPACK_IMPORTED_MODULE_1__["addLoginItem"])(urlWithoutHash, username, password);
    await Object(_reloadUserData__WEBPACK_IMPORTED_MODULE_0__["default"])();
    return;
  } catch (e) {} // todo: check backend. why failed?


  console.debug('addLoginItem with url params failed.', urlWithoutHash);
  const [urlWithoutParams] = tab.url.split('?');
  console.debug('trying without url params', urlWithoutParams);

  try {
    await Object(_rest_SaaspassExtensionResource__WEBPACK_IMPORTED_MODULE_1__["addLoginItem"])(urlWithoutParams, username, password);
    await Object(_reloadUserData__WEBPACK_IMPORTED_MODULE_0__["default"])();
    return;
  } catch (e) {}

  console.debug('addLoginItem without params failed.', urlWithoutParams);
  const host = new URL(tab.url).host;
  console.debug('trying with host', host);

  try {
    await Object(_rest_SaaspassExtensionResource__WEBPACK_IMPORTED_MODULE_1__["addLoginItem"])(`https://${host}`, username, password);
    await Object(_reloadUserData__WEBPACK_IMPORTED_MODULE_0__["default"])();
    return;
  } catch (e) {}

  console.debug('addLoginItem with host failed.', host);
  const rootHost = host.split('.').slice(-2).join('.');
  console.debug('trying with root host', rootHost);
  await Object(_rest_SaaspassExtensionResource__WEBPACK_IMPORTED_MODULE_1__["addLoginItem"])(`https://${rootHost}`, username, password);
  await Object(_reloadUserData__WEBPACK_IMPORTED_MODULE_0__["default"])();
};

/* harmony default export */ __webpack_exports__["default"] = (formDataSave);

/***/ }),

/***/ 330:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _rest_SaaspassExtensionResource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(283);
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);



const reloadUserData = async () => Object(_store__WEBPACK_IMPORTED_MODULE_1__["publish"])((await Object(_rest_SaaspassExtensionResource__WEBPACK_IMPORTED_MODULE_0__["getUserExtensionData"])()));

/* harmony default export */ __webpack_exports__["default"] = (reloadUserData);

/***/ })

}]);
//# sourceMappingURL=25.js.map