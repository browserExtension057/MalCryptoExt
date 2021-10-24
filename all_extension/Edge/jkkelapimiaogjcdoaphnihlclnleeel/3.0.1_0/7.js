(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[7],{

/***/ 111:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(browser) {const port = browser.runtime.connect();
/* harmony default export */ __webpack_exports__["default"] = (port);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(2)))

/***/ }),

/***/ 238:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "autoFillForget", function() { return autoFillForget; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "autoFillGet", function() { return autoFillGet; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "autoFillInit", function() { return autoFillInit; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "extensionLogin", function() { return extensionLogin; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "extensionLogout", function() { return extensionLogout; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "extensionPushLogin", function() { return extensionPushLogin; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "formDataForget", function() { return formDataForget; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "formDataGet", function() { return formDataGet; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "formDataSave", function() { return formDataSave; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "formDataUpdate", function() { return formDataUpdate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getBarcodeImage", function() { return getBarcodeImage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCredentials", function() { return getCredentials; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCurrentTab", function() { return getCurrentTab; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getEpmPassword", function() { return getEpmPassword; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "loginWithApplication", function() { return loginWithApplication; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "portalImportPasswordManager", function() { return portalImportPasswordManager; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "portalLogin", function() { return portalLogin; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "reloadUserData", function() { return reloadUserData; });
/* harmony import */ var _proxy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(239);

const autoFillForget = Object(_proxy__WEBPACK_IMPORTED_MODULE_0__["default"])('autoFillForget');
const autoFillGet = Object(_proxy__WEBPACK_IMPORTED_MODULE_0__["default"])('autoFillGet');
const autoFillInit = Object(_proxy__WEBPACK_IMPORTED_MODULE_0__["default"])('autoFillInit');
const extensionLogin = Object(_proxy__WEBPACK_IMPORTED_MODULE_0__["default"])('extensionLogin');
const extensionLogout = Object(_proxy__WEBPACK_IMPORTED_MODULE_0__["default"])('extensionLogout');
const extensionPushLogin = Object(_proxy__WEBPACK_IMPORTED_MODULE_0__["default"])('extensionPushLogin');
const formDataForget = Object(_proxy__WEBPACK_IMPORTED_MODULE_0__["default"])('formDataForget');
const formDataGet = Object(_proxy__WEBPACK_IMPORTED_MODULE_0__["default"])('formDataGet');
const formDataSave = Object(_proxy__WEBPACK_IMPORTED_MODULE_0__["default"])('formDataSave');
const formDataUpdate = Object(_proxy__WEBPACK_IMPORTED_MODULE_0__["default"])('formDataUpdate');
const getBarcodeImage = Object(_proxy__WEBPACK_IMPORTED_MODULE_0__["default"])('getBarcodeImage');
const getCredentials = Object(_proxy__WEBPACK_IMPORTED_MODULE_0__["default"])('getCredentials');
const getCurrentTab = Object(_proxy__WEBPACK_IMPORTED_MODULE_0__["default"])('getCurrentTab');
const getEpmPassword = Object(_proxy__WEBPACK_IMPORTED_MODULE_0__["default"])('getEpmPassword');
const loginWithApplication = Object(_proxy__WEBPACK_IMPORTED_MODULE_0__["default"])('loginWithApplication');
const portalImportPasswordManager = Object(_proxy__WEBPACK_IMPORTED_MODULE_0__["default"])('portalImportPasswordManager');
const portalLogin = Object(_proxy__WEBPACK_IMPORTED_MODULE_0__["default"])('portalLogin');
const reloadUserData = Object(_proxy__WEBPACK_IMPORTED_MODULE_0__["default"])('reloadUserData');

/***/ }),

/***/ 239:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _port__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(111);


const proxy = name => (...args) => new Promise((resolve, reject) => {
  _port__WEBPACK_IMPORTED_MODULE_0__["default"].onMessage.addListener(({
    type,
    name: n,
    data
  }) => {
    if (n !== name) {
      return;
    }

    if (type === 'proxy-success') {
      resolve(data);
    } else if (type === 'proxy-error') {
      reject(data);
    }
  });
  _port__WEBPACK_IMPORTED_MODULE_0__["default"].postMessage({
    type: 'proxy-request',
    name,
    args
  });
});

/* harmony default export */ __webpack_exports__["default"] = (proxy);

/***/ }),

/***/ 242:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const delay = t => new Promise(resolve => setTimeout(resolve, t));

/* harmony default export */ __webpack_exports__["default"] = (delay);

/***/ }),

/***/ 257:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/orca-18.png";

/***/ }),

/***/ 413:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/orca-loader.gif";

/***/ }),

/***/ 523:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(259);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _common_delay__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(242);
/* harmony import */ var _common_runInBackground__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(238);
/* harmony import */ var _images_orca_18_png__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(257);
/* harmony import */ var _images_orca_18_png__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_images_orca_18_png__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _images_orca_loader_gif__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(413);
/* harmony import */ var _images_orca_loader_gif__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_images_orca_loader_gif__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _App_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(524);
/* harmony import */ var _App_css__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_App_css__WEBPACK_IMPORTED_MODULE_5__);







const close = () => window.parent.postMessage({
  action: 'close'
}, '*');

class App extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.state = {
      account: null,
      isSaving: false,
      isSavingFailed: false,
      isSavingSuccess: false
    };
  }

  async componentDidMount() {
    this.setState({
      account: await Object(_common_runInBackground__WEBPACK_IMPORTED_MODULE_2__["formDataGet"])()
    });
  }

  async save() {
    this.setState({
      isSaving: true
    });

    try {
      await Object(_common_runInBackground__WEBPACK_IMPORTED_MODULE_2__["formDataSave"])();
      console.debug('save-credentials success');
      this.setState({
        isSaving: false,
        isSavingSuccess: true
      });
      await Object(_common_delay__WEBPACK_IMPORTED_MODULE_1__["default"])(1000);
      close();
    } catch (e) {
      console.debug('save-credentials failed', this.state.account, e);
      this.setState({
        isSaving: false,
        isSavingFailed: true
      });
    }
  }

  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "header"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
      src: _images_orca_18_png__WEBPACK_IMPORTED_MODULE_3___default.a
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "link"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
      href: "",
      className: "active"
    }, "Save password for this site")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
      href: "",
      className: "close",
      onClick: event => {
        event.preventDefault();
        close();
      }
    })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("table", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tbody", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, this.state.account ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, this.state.account.title), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", {
      title: "Username"
    }, this.state.account.username), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
      title: "Password"
    }, "***************")) : null))), this.state.isSaving ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
      src: _images_orca_loader_gif__WEBPACK_IMPORTED_MODULE_4___default.a,
      className: "loading"
    }) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
      className: "default",
      onClick: close
    }, this.state.isSavingSuccess ? 'CLOSE' : 'CANCEL'), this.state.isSavingFailed ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
      className: "message message--error"
    }, "Sorry, something went wrong.") : this.state.isSavingSuccess ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
      className: "message message--success"
    }, "Success!") : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
      className: "primary",
      onClick: () => this.save()
    }, ' + ADD ')));
  }

}

/* harmony default export */ __webpack_exports__["default"] = (App);

/***/ }),

/***/ 524:
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(525);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(401)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ 525:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(400)(true);
// imports


// module
exports.push([module.i, "html {\n  width: 340px;\n  height: 160px;\n}\n\nbody {\n  overflow: hidden;\n  background: rgba(245, 245, 245, 0.9);\n  font-family: Open Sans, sans-serif;\n}\n\na:link {\n  text-decoration: none;\n  color: #333;\n  opacity: 0.3;\n  text-align: center;\n}\n\na:visited {\n  text-decoration: none;\n}\n\na:hover {\n  text-decoration: none;\n  opacity: 1;\n}\n\na:active {\n  text-decoration: none;\n}\n\n.header .separator {\n  width: 1px;\n  height: 10px;\n  border-right: 1px solid black;\n  margin: 5px 10px;\n}\n\n.header .link {\n  display: flex;\n  margin: -25px auto 0;\n  font-size: 14px;\n}\n\n.header .link .active {\n  opacity: 1;\n  cursor: default;\n  width: 100%;\n}\n\n.close {\n  position: absolute;\n  right: 11px;\n  top: 9px;\n  width: 18px;\n  height: 18px;\n  opacity: 0.3;\n}\n\n.close:hover {\n  opacity: 1;\n}\n\n.close:before,\n.close:after {\n  position: absolute;\n  left: 8px;\n  content: ' ';\n  height: 18px;\n  width: 2px;\n  background-color: #333;\n}\n\n.close:before {\n  transform: rotate(45deg);\n}\n\n.close:after {\n  transform: rotate(-45deg);\n}\n\nbutton {\n  color: #fff;\n  background-color: #40a3db;\n  text-shadow: -1px 1px #417cb8;\n  border: none;\n  padding: 8px 12px;\n  cursor: pointer;\n}\n\nbutton:hover {\n  background-color: #346392;\n  text-shadow: -1px 1px #27496d;\n}\n\ntable {\n  margin: 2px 0;\n  border-collapse: separate;\n  border-spacing: 0 5px;\n  width: 100%;\n}\n\ntable p,\ntable strong {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n}\n\ntable p {\n  margin: 0 auto;\n  font-size: 14px;\n  cursor: default;\n}\n\ntable p:first-child {\n  width: 300px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\ntable strong {\n  margin: 0;\n  font-size: 13px;\n  cursor: default;\n  display: block;\n}\n\ntable tr {\n  background: rgba(255, 255, 255, 0.7);\n}\n\ntr td:first-child,\ntr td:last-child {\n  text-align: center;\n}\n\ntable td {\n  padding: 7px 2px;\n  border-bottom: 2px solid #efefef;\n  border-top: 2px solid #efefef;\n}\n\ntable td:nth-child(2) {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n  width: 185px;\n}\n\ntable tr:hover {\n  background: #fbfbfb;\n}\n\ntable tr td img {\n  vertical-align: middle;\n}\n\nbutton {\n  border: none;\n  padding: 8px 15px;\n  cursor: pointer;\n  margin-top: 5px;\n}\n\n.primary {\n  text-shadow: -1px 1px #417cb8;\n  color: #fff;\n  background-color: #40a3db;\n}\n\n.primary:hover {\n  background-color: #346392;\n  text-shadow: -1px 1px #27496d;\n}\n\n.default {\n  background-color: #cccccc;\n  float: right;\n}\n\n.default:hover {\n  background-color: #a9a8a8;\n}\n\n.loading {\n  width: 35px;\n  position: absolute;\n  left: 44%;\n  bottom: 10px;\n}\n\n.message {\n  text-align: left;\n  font-weight: bold;\n  font-size: 14px;\n}\n\n.message--error {\n  color: red;\n}\n\n.message--success {\n  color: green;\n}\n", "", {"version":3,"sources":["/Users/hakanhamzacebi/saaspass_extension/src/saveCredentialsFrame/App.css"],"names":[],"mappings":"AAAA;EACE,aAAa;EACb,cAAc;CACf;;AAED;EACE,iBAAiB;EACjB,qCAAqC;EACrC,mCAAmC;CACpC;;AAED;EACE,sBAAsB;EACtB,YAAY;EACZ,aAAa;EACb,mBAAmB;CACpB;;AAED;EACE,sBAAsB;CACvB;;AAED;EACE,sBAAsB;EACtB,WAAW;CACZ;;AAED;EACE,sBAAsB;CACvB;;AAED;EACE,WAAW;EACX,aAAa;EACb,8BAA8B;EAC9B,iBAAiB;CAClB;;AAED;EACE,cAAc;EACd,qBAAqB;EACrB,gBAAgB;CACjB;;AAED;EACE,WAAW;EACX,gBAAgB;EAChB,YAAY;CACb;;AAED;EACE,mBAAmB;EACnB,YAAY;EACZ,SAAS;EACT,YAAY;EACZ,aAAa;EACb,aAAa;CACd;;AAED;EACE,WAAW;CACZ;;AAED;;EAEE,mBAAmB;EACnB,UAAU;EACV,aAAa;EACb,aAAa;EACb,WAAW;EACX,uBAAuB;CACxB;;AAED;EACE,yBAAyB;CAC1B;;AAED;EACE,0BAA0B;CAC3B;;AAED;EACE,YAAY;EACZ,0BAA0B;EAC1B,8BAA8B;EAC9B,aAAa;EACb,kBAAkB;EAClB,gBAAgB;CACjB;;AAED;EACE,0BAA0B;EAC1B,8BAA8B;CAC/B;;AAED;EACE,cAAc;EACd,0BAA0B;EAC1B,sBAAsB;EACtB,YAAY;CACb;;AAED;;EAEE,wBAAwB;EACxB,oBAAoB;EACpB,iBAAiB;CAClB;;AAED;EACE,eAAe;EACf,gBAAgB;EAChB,gBAAgB;CACjB;;AAED;EACE,aAAa;EACb,oBAAoB;EACpB,iBAAiB;EACjB,wBAAwB;CACzB;;AAED;EACE,UAAU;EACV,gBAAgB;EAChB,gBAAgB;EAChB,eAAe;CAChB;;AAED;EACE,qCAAqC;CACtC;;AAED;;EAEE,mBAAmB;CACpB;;AAED;EACE,iBAAiB;EACjB,iCAAiC;EACjC,8BAA8B;CAC/B;;AAED;EACE,wBAAwB;EACxB,oBAAoB;EACpB,iBAAiB;EACjB,aAAa;CACd;;AAED;EACE,oBAAoB;CACrB;;AAED;EACE,uBAAuB;CACxB;;AAED;EACE,aAAa;EACb,kBAAkB;EAClB,gBAAgB;EAChB,gBAAgB;CACjB;;AAED;EACE,8BAA8B;EAC9B,YAAY;EACZ,0BAA0B;CAC3B;;AAED;EACE,0BAA0B;EAC1B,8BAA8B;CAC/B;;AAED;EACE,0BAA0B;EAC1B,aAAa;CACd;;AAED;EACE,0BAA0B;CAC3B;;AAED;EACE,YAAY;EACZ,mBAAmB;EACnB,UAAU;EACV,aAAa;CACd;;AAED;EACE,iBAAiB;EACjB,kBAAkB;EAClB,gBAAgB;CACjB;;AAED;EACE,WAAW;CACZ;;AAED;EACE,aAAa;CACd","file":"App.css","sourcesContent":["html {\n  width: 340px;\n  height: 160px;\n}\n\nbody {\n  overflow: hidden;\n  background: rgba(245, 245, 245, 0.9);\n  font-family: Open Sans, sans-serif;\n}\n\na:link {\n  text-decoration: none;\n  color: #333;\n  opacity: 0.3;\n  text-align: center;\n}\n\na:visited {\n  text-decoration: none;\n}\n\na:hover {\n  text-decoration: none;\n  opacity: 1;\n}\n\na:active {\n  text-decoration: none;\n}\n\n.header .separator {\n  width: 1px;\n  height: 10px;\n  border-right: 1px solid black;\n  margin: 5px 10px;\n}\n\n.header .link {\n  display: flex;\n  margin: -25px auto 0;\n  font-size: 14px;\n}\n\n.header .link .active {\n  opacity: 1;\n  cursor: default;\n  width: 100%;\n}\n\n.close {\n  position: absolute;\n  right: 11px;\n  top: 9px;\n  width: 18px;\n  height: 18px;\n  opacity: 0.3;\n}\n\n.close:hover {\n  opacity: 1;\n}\n\n.close:before,\n.close:after {\n  position: absolute;\n  left: 8px;\n  content: ' ';\n  height: 18px;\n  width: 2px;\n  background-color: #333;\n}\n\n.close:before {\n  transform: rotate(45deg);\n}\n\n.close:after {\n  transform: rotate(-45deg);\n}\n\nbutton {\n  color: #fff;\n  background-color: #40a3db;\n  text-shadow: -1px 1px #417cb8;\n  border: none;\n  padding: 8px 12px;\n  cursor: pointer;\n}\n\nbutton:hover {\n  background-color: #346392;\n  text-shadow: -1px 1px #27496d;\n}\n\ntable {\n  margin: 2px 0;\n  border-collapse: separate;\n  border-spacing: 0 5px;\n  width: 100%;\n}\n\ntable p,\ntable strong {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n}\n\ntable p {\n  margin: 0 auto;\n  font-size: 14px;\n  cursor: default;\n}\n\ntable p:first-child {\n  width: 300px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\ntable strong {\n  margin: 0;\n  font-size: 13px;\n  cursor: default;\n  display: block;\n}\n\ntable tr {\n  background: rgba(255, 255, 255, 0.7);\n}\n\ntr td:first-child,\ntr td:last-child {\n  text-align: center;\n}\n\ntable td {\n  padding: 7px 2px;\n  border-bottom: 2px solid #efefef;\n  border-top: 2px solid #efefef;\n}\n\ntable td:nth-child(2) {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n  width: 185px;\n}\n\ntable tr:hover {\n  background: #fbfbfb;\n}\n\ntable tr td img {\n  vertical-align: middle;\n}\n\nbutton {\n  border: none;\n  padding: 8px 15px;\n  cursor: pointer;\n  margin-top: 5px;\n}\n\n.primary {\n  text-shadow: -1px 1px #417cb8;\n  color: #fff;\n  background-color: #40a3db;\n}\n\n.primary:hover {\n  background-color: #346392;\n  text-shadow: -1px 1px #27496d;\n}\n\n.default {\n  background-color: #cccccc;\n  float: right;\n}\n\n.default:hover {\n  background-color: #a9a8a8;\n}\n\n.loading {\n  width: 35px;\n  position: absolute;\n  left: 44%;\n  bottom: 10px;\n}\n\n.message {\n  text-align: left;\n  font-weight: bold;\n  font-size: 14px;\n}\n\n.message--error {\n  color: red;\n}\n\n.message--success {\n  color: green;\n}\n"],"sourceRoot":""}]);

// exports


/***/ })

}]);
//# sourceMappingURL=7.js.map