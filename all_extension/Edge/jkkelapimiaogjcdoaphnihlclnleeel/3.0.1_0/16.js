(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[16],{

/***/ 242:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const delay = t => new Promise(resolve => setTimeout(resolve, t));

/* harmony default export */ __webpack_exports__["default"] = (delay);

/***/ }),

/***/ 279:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(browser) {/* harmony import */ var _executeInstructions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(280);
/* harmony import */ var _getCredentialsFromInstructions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(281);
/* harmony import */ var _getSsoInstructionsForItem__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(282);
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3);





const autoFillInit = async ({
  item,
  newTab,
  submit
}, port) => {
  if (!submit && _store__WEBPACK_IMPORTED_MODULE_3__["store"].autoFill.tabId === port.sender.tab.id) {
    console.debug('auto-login already in progress. will not override.');
    return;
  }

  const data = await Object(_getSsoInstructionsForItem__WEBPACK_IMPORTED_MODULE_2__["default"])(item); // firefox and opera do not allow executing js coming from server.
  // this block will only be included in chrome build. it will be dropped from
  // non-chrome builds because it evaluates to `if (false)`.

  if (undefined === 'chrome' && submit && data.instructions) {
    const {
      instructions,
      url
    } = JSON.parse(data.instructions);
    const tab = newTab === true ? await browser.tabs.create({
      url
    }) : port.sender.tab;
    await Object(_executeInstructions__WEBPACK_IMPORTED_MODULE_0__["default"])(instructions, tab.id);
    return;
  }

  const {
    url,
    username,
    password,
    otp
  } = Object(_getCredentialsFromInstructions__WEBPACK_IMPORTED_MODULE_1__["default"])(data);
  const tab = newTab === true ? await browser.tabs.create({
    url
  }) : port.sender.tab;
  if (newTab === 'redirect') await browser.tabs.update(tab.id, {
    url
  });
  Object(_store__WEBPACK_IMPORTED_MODULE_3__["publish"])({
    autoFill: {
      otp,
      password,
      submit,
      tabId: tab.id,
      timeout: Date.now() + 60 * 1000,
      username
    }
  });
};

/* harmony default export */ __webpack_exports__["default"] = (autoFillInit);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(2)))

/***/ }),

/***/ 280:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(browser) {/* harmony import */ var _common_delay__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(242);
// fixme:
//   firefox and opera users will not benefit from this script because this file
//   is included only in chrome build.
//   browser.tabs.executeScript is executing js coming from server, and
//   considered insecure. that makes sense, because if we could execute
//   arbitrary scripts, then there would be no point in reviewing extensions.
// todo:
//   it is possible to make all instructions like REDIRECT, REMOVE_COOKIE, and
//   TIME_OUT which come with params instead of arbitrary scripts.


const executeInstruction = async (type, data, tabId, frameId) => {
  switch (type) {
    case 'REDIRECT':
      return browser.tabs.update(tabId, {
        url: data.url
      });

    case 'REMOVE_COOKIE':
      return browser.cookies.remove({
        url: data.url,
        name: data.name
      });

    case 'POPULATE_ELEMENT':
      await Object(_common_delay__WEBPACK_IMPORTED_MODULE_0__["default"])(500);
      return browser.tabs.executeScript(tabId, {
        code: data.code,
        frameId
      });

    case 'SUBMIT':
      return browser.tabs.executeScript(tabId, {
        code: data.code,
        frameId
      });

    case 'REMEMBER_ME':
      return browser.tabs.executeScript(tabId, {
        code: data.code,
        frameId
      });

    case 'TIME_OUT':
      return Object(_common_delay__WEBPACK_IMPORTED_MODULE_0__["default"])(data.time);

    default:
      throw {
        message: 'Unknown instruction type',
        type,
        tabId,
        data
      };
  }
};

const executeInstructions = async (instructions, tabId, frameId) => {
  for (const {
    type,
    data
  } of instructions) {
    await executeInstruction(type, data, tabId, frameId);
  }
};

/* harmony default export */ __webpack_exports__["default"] = (executeInstructions);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(2)))

/***/ }),

/***/ 281:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// com.saaspass.web.rest.extension.dto.AuthenticatorInstructionsDTO
const getCredentialsFromInstructions = dto => {
  if (!dto.instructions) {
    return dto;
  }

  const {
    instructions,
    url
  } = JSON.parse(dto.instructions);
  const [redirectUrl] = instructions.filter(i => i.type === 'REDIRECT').map(i => i.data.url);
  const [username, password, otp] = instructions.filter(i => i.type === 'POPULATE_ELEMENT').map(i => i.data.code).filter(code => /\.value\s*=/.test(code)).map(code => code.split(/\.value\s*=\s*/)[1].split(/'/)[1]);
  return {
    url: redirectUrl || url,
    username,
    password,
    otp
  };
};

/* harmony default export */ __webpack_exports__["default"] = (getCredentialsFromInstructions);

/***/ }),

/***/ 282:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _rest_SaaspassExtensionResource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(283);


const getSsoInstructionsForItem = item => {
  if (item.tracker && item.isShared) {
    return Object(_rest_SaaspassExtensionResource__WEBPACK_IMPORTED_MODULE_0__["checkTrackerForSharedAccount"])(item.tracker);
  } else if (item.tracker) {
    return Object(_rest_SaaspassExtensionResource__WEBPACK_IMPORTED_MODULE_0__["checkTrackerForPublicUserAccount"])(item.tracker);
  } else if (item.isShared) {
    return Object(_rest_SaaspassExtensionResource__WEBPACK_IMPORTED_MODULE_0__["getSsoInstructionsForSharedItem"])(item.id);
  } else if (item.epmAppSettings) {
    const {
      applicationId: appId,
      companyUserAccountId: accId
    } = item;
    return Object(_rest_SaaspassExtensionResource__WEBPACK_IMPORTED_MODULE_0__["getSsoInstructionsForEpmAccount"])(appId, accId);
  } else {
    return Object(_rest_SaaspassExtensionResource__WEBPACK_IMPORTED_MODULE_0__["getSsoInstructions"])(item.id);
  }
};

/* harmony default export */ __webpack_exports__["default"] = (getSsoInstructionsForItem);

/***/ })

}]);
//# sourceMappingURL=16.js.map