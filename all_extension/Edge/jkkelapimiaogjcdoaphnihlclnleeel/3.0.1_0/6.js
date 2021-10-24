(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[6],{

/***/ 105:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "baseURL", function() { return baseURL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "websocket", function() { return websocket; });
const baseURL = 'https://www.saaspass.com/sd';
const websocket = {
  url: 'wss://www.saaspass.com/ws',
  username: 'd16b8f79-c6a0-4538-915c-3202bc0e3f66',
  password: 'f2734acc-a0a1-4f32-b265-e1828887197d',
  virtualHost: '/wsmq'
};

/***/ }),

/***/ 230:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const sortBy = (...fns) => items => items.slice().sort((a, b) => {
  const f = fns.find(f => f(a) !== f(b));
  return !f ? 0 : f(a) < f(b) ? -1 : 1;
});

/* harmony default export */ __webpack_exports__["default"] = (sortBy);

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

/***/ 273:
/***/ (function(module) {

module.exports = {"author":"SAASPASS, 44 Tehama Street, San Francisco, CA 94105","contributors":[],"dependencies":{"axios":"^0.18.0","bootstrap":"^3.3.7","lodash":"^4.17.11","qr-image":"^3.2.0","qs":"^6.5.2","react":"^16.6.3","react-dom":"^16.6.3","react-router-dom":"^4.3.1","rxjs":"^6.3.3","stompjs":"^2.3.3","uuid":"^3.3.2","webextension-polyfill":"^0.3.1"},"description":"SAASPASS is a free password manager & authenticator 2FA code generator with autofill & autologin capabilities. It is built with security and usability in mind. With the browser extension SAASPASS can autofill both your passwords and authenticator codes. The browser extension is secured with extremely usable passwordless MFA. There is no need for a desktop application with the SAASPASS add-on.","devDependencies":{"@babel/core":"^7.1.6","@babel/plugin-syntax-dynamic-import":"^7.0.0","@babel/preset-env":"^7.1.6","@babel/preset-react":"^7.0.0","babel-loader":"^8.0.4","babel-plugin-transform-remove-console":"^6.9.4","copy-webpack-plugin":"^4.6.0","css-loader":"^1.0.1","file-loader":"^2.0.0","generate-json-webpack-plugin":"^0.3.1","html-webpack-plugin":"^3.2.0","husky":"^1.1.4","imports-loader":"^0.8.0","lint-staged":"^8.0.4","mini-css-extract-plugin":"^0.4.4","prettier":"^1.15.2","style-loader":"^0.23.1","webpack":"^4.25.1","webpack-cli":"^3.1.2"},"engines":{"node":"10","npm":"6"},"homepage":"https://saaspass.com/","keywords":[],"licenses":[],"name":"app","private":true,"scripts":{"build":"npm run build:pd:public","build:pd:public":"webpack --config=./config/webpack-production.config.js --env.api=pd --env.target=public","build:pd:public:chrome":"webpack --config=./config/webpack-production.config.js --env.api=pd --env.target=public --env.browser=chrome","build:pd:qa":"webpack --config=./config/webpack-production.config.js --env.api=pd --env.target=qa","build:pd:qa:chrome":"webpack --config=./config/webpack-production.config.js --env.api=pd --env.target=qa --env.browser=chrome","build:st:qa":"webpack --config=./config/webpack-production.config.js --env.api=st --env.target=qa","build:st:qa:chrome":"webpack --config=./config/webpack-production.config.js --env.api=st --env.target=qa --env.browser=chrome","start":"npm run start:pd","start:pc":"webpack --config=./config/webpack-development.config.js --env.api=pc","start:pc:chrome":"webpack --config=./config/webpack-development.config.js --env.api=pc --env.browser=chrome","start:pd":"webpack --config=./config/webpack-development.config.js --env.api=pd","start:pd:chrome":"webpack --config=./config/webpack-development.config.js --env.api=pd --env.browser=chrome","start:st":"webpack --config=./config/webpack-development.config.js --env.api=st","start:st:chrome":"webpack --config=./config/webpack-development.config.js --env.api=st --env.browser=chrome","test":"echo \"Error: no test specified\" && exit 1"},"version":"3.0.1"};

/***/ }),

/***/ 403:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var bootstrap_dist_css_bootstrap_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(404);
/* harmony import */ var bootstrap_dist_css_bootstrap_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(bootstrap_dist_css_bootstrap_css__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(259);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _common_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(112);
/* harmony import */ var _Alerts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(412);
/* harmony import */ var _App_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(417);
/* harmony import */ var _App_css__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_App_css__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _Login__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(419);
/* harmony import */ var _Routes__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(436);








class App extends react__WEBPACK_IMPORTED_MODULE_1__["Component"] {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      isStoreLoaded: false
    };
  }

  componentDidMount() {
    this.subscription = Object(_common_store__WEBPACK_IMPORTED_MODULE_2__["observe"])('authenticators', 'passwordmanagers').subscribe(({
      authenticators,
      passwordmanagers
    }) => this.setState({
      isLoggedIn: !!authenticators && !!passwordmanagers,
      isStoreLoaded: true
    }));
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  render() {
    return this.state.isStoreLoaded ? react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", null, this.state.isLoggedIn ? react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_Routes__WEBPACK_IMPORTED_MODULE_6__["default"], null) : react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_Login__WEBPACK_IMPORTED_MODULE_5__["default"], null), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_Alerts__WEBPACK_IMPORTED_MODULE_3__["default"], null)) : null;
  }

}

/* harmony default export */ __webpack_exports__["default"] = (App);

/***/ }),

/***/ 412:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(259);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _common_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(112);
/* harmony import */ var _images_orca_loader_gif__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(413);
/* harmony import */ var _images_orca_loader_gif__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_images_orca_loader_gif__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _confirm_png__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(414);
/* harmony import */ var _confirm_png__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_confirm_png__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(415);
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_style_css__WEBPACK_IMPORTED_MODULE_4__);






class Alerts extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.state = {
      showLoading: 0,
      showSuccess: false // todo: implement

    };
  }

  componentDidMount() {
    this.unsubscribe = Object(_common_store__WEBPACK_IMPORTED_MODULE_1__["observe"])('activeRequests').subscribe(({
      activeRequests
    }) => this.setState({
      showLoading: !!activeRequests
    }));
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, this.state.showLoading ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
      className: "alert__loading",
      src: _images_orca_loader_gif__WEBPACK_IMPORTED_MODULE_2___default.a
    }) : null, this.state.showSuccess ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
      className: "alert__success",
      src: _confirm_png__WEBPACK_IMPORTED_MODULE_3___default.a
    }) : null);
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Alerts);

/***/ }),

/***/ 413:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/orca-loader.gif";

/***/ }),

/***/ 414:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/popup/Alerts/confirm.png";

/***/ }),

/***/ 415:
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(416);

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

/***/ 416:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(400)(true);
// imports


// module
exports.push([module.i, ".alert__loading {\n  left: 366px;\n  position: absolute;\n  top: 520px;\n  width: 35px;\n}\n\n.alert__success {\n  left: 361px;\n  position: absolute;\n  top: 508px;\n  width: 45px;\n}\n", "", {"version":3,"sources":["/Users/hakanhamzacebi/saaspass_extension/src/popup/Alerts/style.css"],"names":[],"mappings":"AAAA;EACE,YAAY;EACZ,mBAAmB;EACnB,WAAW;EACX,YAAY;CACb;;AAED;EACE,YAAY;EACZ,mBAAmB;EACnB,WAAW;EACX,YAAY;CACb","file":"style.css","sourcesContent":[".alert__loading {\n  left: 366px;\n  position: absolute;\n  top: 520px;\n  width: 35px;\n}\n\n.alert__success {\n  left: 361px;\n  position: absolute;\n  top: 508px;\n  width: 45px;\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),

/***/ 417:
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(418);

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

/***/ 418:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(400)(true);
// imports


// module
exports.push([module.i, "::-webkit-scrollbar {\n  width: 16px;\n}\n\n::-webkit-scrollbar-track {\n  -webkit-box-shadow: inset 0 0 4px #40a3db;\n}\n\n::-webkit-scrollbar-thumb {\n  background: #40a3db;\n}\n", "", {"version":3,"sources":["/Users/hakanhamzacebi/saaspass_extension/src/popup/App.css"],"names":[],"mappings":"AAAA;EACE,YAAY;CACb;;AAED;EACE,0CAA0C;CAC3C;;AAED;EACE,oBAAoB;CACrB","file":"App.css","sourcesContent":["::-webkit-scrollbar {\n  width: 16px;\n}\n\n::-webkit-scrollbar-track {\n  -webkit-box-shadow: inset 0 0 4px #40a3db;\n}\n\n::-webkit-scrollbar-thumb {\n  background: #40a3db;\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),

/***/ 419:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(browser) {/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(259);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _package_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(273);
var _package_json__WEBPACK_IMPORTED_MODULE_1___namespace = /*#__PURE__*/__webpack_require__.t(273, 1);
/* harmony import */ var _common_runInBackground__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(238);
/* harmony import */ var _Footer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(420);
/* harmony import */ var _Nav__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(423);
/* harmony import */ var _sessionId__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(428);
/* harmony import */ var _websocket__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(429);
/* harmony import */ var _barcode_placeholder_png__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(431);
/* harmony import */ var _barcode_placeholder_png__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_barcode_placeholder_png__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _scan_png__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(432);
/* harmony import */ var _scan_png__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_scan_png__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(433);
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_style_css__WEBPACK_IMPORTED_MODULE_9__);











class Login extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.state = {
      alert: null,
      barcodeImage: _barcode_placeholder_png__WEBPACK_IMPORTED_MODULE_7___default.a,
      isLoading: false,
      isRememberMeLoaded: false,
      password: '',
      rememberMe: false,
      username: ''
    };
  }

  async componentDidMount() {
    this._isMounted = true; // todo: remove workaround

    this.handleWebsocketMessage();
    const {
      username
    } = await browser.storage.local.get();
    this.setState({
      isRememberMeLoaded: true,
      rememberMe: !!username,
      username: username || ''
    }); // todo: this request shouldn't start if already logged in.

    const barcodeImage = await Object(_common_runInBackground__WEBPACK_IMPORTED_MODULE_2__["getBarcodeImage"])(_sessionId__WEBPACK_IMPORTED_MODULE_5__["default"]);
    this._isMounted && this.setState({
      barcodeImage
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.subscription.unsubscribe();
  }

  handleWebsocketMessage() {
    this.subscription = Object(_websocket__WEBPACK_IMPORTED_MODULE_6__["subscribe"])(({
      type,
      content
    }) => {
      if (type === 'LOGIN') {
        this.login(content.username, content.password);
      }
    });
  }

  async login(username, password) {
    this.setState({
      isLoading: true,
      alert: null
    });

    try {
      await Object(_common_runInBackground__WEBPACK_IMPORTED_MODULE_2__["extensionLogin"])(username, password);

      if (this.state.rememberMe) {
        browser.storage.local.set({
          username: this.state.username
        });
      }
    } catch (e) {
      const {
        error_description = ''
      } = (e.response || {}).data || {};
      const message = error_description.includes('captcha') ? 'Too many invalid login attempts. Go to www.saaspass.com and attempt to login there.' : 'Incorrect credentials. If problem continues, check time/zone of your mobile device.';
      this.setState({
        isLoading: false,
        alert: {
          type: 'danger',
          message
        }
      });
    }
  }

  async onPush() {
    this.setState({
      isLoading: true,
      alert: null
    });

    try {
      await Object(_common_runInBackground__WEBPACK_IMPORTED_MODULE_2__["extensionPushLogin"])(this.state.username, _sessionId__WEBPACK_IMPORTED_MODULE_5__["default"]);
      const message = 'Approval message has been sent to your SAASPASS app.';
      this.setState({
        alert: {
          type: 'info',
          message
        }
      });
    } catch (e) {
      const data = (e.response || {}).data || {};
      const message = !data.message ? 'Push login failed' : data.message.includes('captcha') ? 'Too many invalid login attempts. Go to www.saaspass.com and attempt to login there.' : data.message;
      this.setState({
        alert: {
          type: 'danger',
          message
        }
      });
    } finally {
      this.setState({
        isLoading: false
      });
    }
  }

  onSubmit(event) {
    event.preventDefault();
    this.login(this.state.username, this.state.password);
  }

  rememberMeChanged(event) {
    const rememberMe = event.target.checked;
    this.setState({
      rememberMe
    });

    if (!rememberMe) {
      browser.storage.local.remove('username');
    }
  }

  render() {
    return this.state.isRememberMeLoaded ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Nav__WEBPACK_IMPORTED_MODULE_4__["default"], {
      logo: true
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("main", {
      className: "main"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "login"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("form", {
      className: "login__form",
      onSubmit: e => this.onSubmit(e)
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
      className: "login__scan-text"
    }, "Scan with SAASPASS"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
      src: this.state.barcodeImage,
      className: "center-block login__barcode-image"
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
      src: _scan_png__WEBPACK_IMPORTED_MODULE_8___default.a,
      className: "center-block login__scan-icon"
    })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "form-group login__form-group"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "input-group"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
      autoComplete: "off",
      autoFocus: !this.state.rememberMe,
      className: "form-control login__form-control login__input",
      disabled: this.state.isLoading,
      maxLength: 125,
      name: "username",
      onChange: e => this.setState({
        username: e.target.value
      }),
      placeholder: "SAASPASS ID or email or mobile number",
      required: true,
      value: this.state.username
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "input-group-btn"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
      type: "button",
      className: "btn btn-primary",
      disabled: !this.state.username || this.state.isLoading,
      onClick: () => this.onPush()
    }, "Push Login")))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "checkbox login__remember-me-checkbox-wrapper"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
      checked: this.state.rememberMe,
      className: "login__remember-me-checkbox",
      id: "rememberMe",
      name: "rememberMe",
      onChange: e => this.rememberMeChanged(e),
      type: "checkbox"
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
      htmlFor: "rememberMe",
      className: "login__remember-me-label"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "login__remember-me-text"
    }, "Remember me"))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "form-group login__form-group"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
      autoComplete: "off",
      autoFocus: this.state.rememberMe,
      className: "form-control login__form-control login__input",
      disabled: this.state.isLoading,
      maxLength: 6,
      minLength: 6,
      name: "password",
      onChange: e => /^[0-9]{0,6}$/.test(e.target.value) && this.setState({
        password: e.target.value
      }),
      placeholder: "One-Time Password",
      required: true,
      value: this.state.password
    })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
      className: "btn btn-default center-block login__button",
      disabled: !this.state.username || this.state.password.length < 6 || this.state.isLoading
    }, "Login")), this.state.alert ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h5", {
      className: `login__alert bg-${this.state.alert.type}`
    }, this.state.alert.message) : null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h5", {
      className: "login__version"
    }, "version ", _package_json__WEBPACK_IMPORTED_MODULE_1__["version"])), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Footer__WEBPACK_IMPORTED_MODULE_3__["default"], null)) : null;
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Login);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(2)))

/***/ }),

/***/ 420:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(259);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(421);
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_style_css__WEBPACK_IMPORTED_MODULE_1__);



const Footer = () => react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("footer", {
  className: "footer"
}, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
  className: "footer__text"
}, "Password Manager, Authenticator & Single Sign-On (SSO)"));

/* harmony default export */ __webpack_exports__["default"] = (Footer);

/***/ }),

/***/ 421:
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(422);

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

/***/ 422:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(400)(true);
// imports


// module
exports.push([module.i, ".footer {\n  background-color: #0a1a35;\n  color: white;\n  font-size: 12px;\n  line-height: 24px;\n  padding: 0;\n  text-align: center;\n}\n\n.footer__text {\n  cursor: default;\n  font-weight: bold;\n}\n", "", {"version":3,"sources":["/Users/hakanhamzacebi/saaspass_extension/src/popup/Footer/style.css"],"names":[],"mappings":"AAAA;EACE,0BAA0B;EAC1B,aAAa;EACb,gBAAgB;EAChB,kBAAkB;EAClB,WAAW;EACX,mBAAmB;CACpB;;AAED;EACE,gBAAgB;EAChB,kBAAkB;CACnB","file":"style.css","sourcesContent":[".footer {\n  background-color: #0a1a35;\n  color: white;\n  font-size: 12px;\n  line-height: 24px;\n  padding: 0;\n  text-align: center;\n}\n\n.footer__text {\n  cursor: default;\n  font-weight: bold;\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),

/***/ 423:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(259);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _common_runInBackground__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(238);
/* harmony import */ var _orca_48_png__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(424);
/* harmony import */ var _orca_48_png__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_orca_48_png__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(425);
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_style_css__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _sync_png__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(427);
/* harmony import */ var _sync_png__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_sync_png__WEBPACK_IMPORTED_MODULE_4__);






class Nav extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
  }

  async sync() {
    this.setState({
      isLoading: true
    });
    await Object(_common_runInBackground__WEBPACK_IMPORTED_MODULE_1__["reloadUserData"])();
    this.setState({
      isLoading: false
    });
  }

  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("nav", {
      className: "nav"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
      className: "nav__p"
    }, this.props.logo ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
      src: _orca_48_png__WEBPACK_IMPORTED_MODULE_2___default.a
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "nav__middle"
    }, "SAASPASS")) : null, this.props.back ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
      className: "btn btn-default navbar-btn pull-left nav__btn",
      onClick: () => window.history.back()
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "glyphicon glyphicon-chevron-left"
    }), "Back") : null, this.props.sync ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
      className: "btn btn-default navbar-btn pull-right nav__btn",
      title: "Synchronize",
      disabled: this.state.isLoading,
      onClick: () => this.sync()
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
      src: _sync_png__WEBPACK_IMPORTED_MODULE_4___default.a,
      className: `nav__sync-img ${this.state.isLoading ? 'spin' : ''}`
    })) : null));
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Nav);

/***/ }),

/***/ 424:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/popup/Nav/orca-48.png";

/***/ }),

/***/ 425:
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(426);

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

/***/ 426:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(400)(true);
// imports


// module
exports.push([module.i, ".nav {\n  background-color: #0a1a35;\n  padding: 5px 0;\n  height: 58px;\n}\n\n.nav__btn {\n  border: none;\n  border-radius: 0;\n}\n\n.nav__p {\n  color: white;\n  font-size: 26px;\n  text-align: center;\n  margin: 0 20px;\n}\n\n.nav__middle {\n  vertical-align: middle;\n}\n\n.nav__sync-img {\n  width: 16px;\n}\n\n.spin {\n  animation: spin 1.1s infinite linear;\n}\n\n@keyframes spin {\n  from {\n    transform: scale(1) rotate(0deg);\n  }\n  to {\n    transform: scale(1) rotate(360deg);\n  }\n}\n", "", {"version":3,"sources":["/Users/hakanhamzacebi/saaspass_extension/src/popup/Nav/style.css"],"names":[],"mappings":"AAAA;EACE,0BAA0B;EAC1B,eAAe;EACf,aAAa;CACd;;AAED;EACE,aAAa;EACb,iBAAiB;CAClB;;AAED;EACE,aAAa;EACb,gBAAgB;EAChB,mBAAmB;EACnB,eAAe;CAChB;;AAED;EACE,uBAAuB;CACxB;;AAED;EACE,YAAY;CACb;;AAED;EACE,qCAAqC;CACtC;;AAED;EACE;IACE,iCAAiC;GAClC;EACD;IACE,mCAAmC;GACpC;CACF","file":"style.css","sourcesContent":[".nav {\n  background-color: #0a1a35;\n  padding: 5px 0;\n  height: 58px;\n}\n\n.nav__btn {\n  border: none;\n  border-radius: 0;\n}\n\n.nav__p {\n  color: white;\n  font-size: 26px;\n  text-align: center;\n  margin: 0 20px;\n}\n\n.nav__middle {\n  vertical-align: middle;\n}\n\n.nav__sync-img {\n  width: 16px;\n}\n\n.spin {\n  animation: spin 1.1s infinite linear;\n}\n\n@keyframes spin {\n  from {\n    transform: scale(1) rotate(0deg);\n  }\n  to {\n    transform: scale(1) rotate(360deg);\n  }\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),

/***/ 427:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/popup/Nav/sync.png";

/***/ }),

/***/ 428:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var uuid_v4__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(249);
/* harmony import */ var uuid_v4__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(uuid_v4__WEBPACK_IMPORTED_MODULE_0__);

const sessionId = uuid_v4__WEBPACK_IMPORTED_MODULE_0___default()();
/* harmony default export */ __webpack_exports__["default"] = (sessionId);

/***/ }),

/***/ 429:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(api) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "subscribe", function() { return subscribe; });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var stompjs_lib_stomp__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(430);
/* harmony import */ var stompjs_lib_stomp__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(stompjs_lib_stomp__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _sessionId__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(428);



let client = null;
let connecting = false;
const messages$ = new rxjs__WEBPACK_IMPORTED_MODULE_0__["Subject"]();

const connect = () => {
  if (client && client.connected || connecting) {
    return;
  }

  const {
    url,
    username,
    password,
    virtualHost
  } = api.websocket;
  client = stompjs_lib_stomp__WEBPACK_IMPORTED_MODULE_1__["Stomp"].client(url);
  client.debug = null;
  connecting = true;
  client.connect(username, password, onConnect, onError, virtualHost);
};

const onConnect = () => {
  connecting = false;
  client.subscribe(`/exchange/websocket-exchange/${_sessionId__WEBPACK_IMPORTED_MODULE_2__["default"]}`, onReceive);
};

const onError = () => connecting = false;

const onReceive = frame => messages$.next(JSON.parse(frame.body));

const subscribe = (next, error, complete) => {
  connect();
  return messages$.subscribe(next, error, complete);
};
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(105)))

/***/ }),

/***/ 431:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/popup/Login/barcode-placeholder.png";

/***/ }),

/***/ 432:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/popup/Login/scan.png";

/***/ }),

/***/ 433:
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(434);

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

/***/ 434:
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(406);
exports = module.exports = __webpack_require__(400)(true);
// imports


// module
exports.push([module.i, ".login__barcode-image {\n  border: 8px solid #0a1b37;\n  max-width: 229px;\n}\n\n.login__button {\n  border-radius: 0;\n  padding: 3px 65px;\n  font-size: 20px;\n  margin-top: 20px;\n}\n\n.login__button,\n.login__button.login__button:hover,\n.login__button.login__button:focus {\n  background: #40a3db;\n  color: white;\n}\n\n.error {\n  color: red;\n  position: absolute;\n  margin-top: -5px;\n  font-size: 13px;\n}\n\n.login__form {\n  padding: 0 20px;\n}\n\n.login__form-control {\n  border-radius: 0;\n}\n\n.login__form-control:focus {\n  box-shadow: none;\n}\n\n.login__form-group {\n  margin-bottom: 5px;\n}\n\n.login__alert {\n  margin-bottom: 0;\n  margin-top: 6px;\n  padding: 5px;\n  text-align: center;\n}\n\n.login__input {\n  margin-bottom: 5px;\n}\n\n.login {\n  padding: 3px 20px;\n}\n\n.login__remember-me-checkbox {\n  transform: scale(1.2, 1.2);\n  opacity: 0;\n  cursor: pointer;\n  height: 15px;\n  margin-left: 0;\n}\n\n.login__remember-me-checkbox:checked + .login__remember-me-label:before {\n  background-image: url(" + escape(__webpack_require__(435)) + ");\n}\n\n.login__remember-me-checkbox-wrapper {\n  margin-left: 4px;\n}\n\n.login__remember-me-label {\n  font-weight: normal;\n}\n\n.login__remember-me-label:before {\n  border: 1px solid #ccc;\n  content: '\\A0';\n  display: inline-block;\n  font: 15px/1em sans-serif;\n  height: 20px;\n  padding: 0;\n  width: 20px;\n  background: #fff;\n  line-height: 25px;\n  margin-left: -24px;\n}\n\n.login__remember-me-text {\n  margin-left: 5px;\n  vertical-align: top;\n}\n\n.login__scan-icon {\n  margin-top: -8px;\n  margin-bottom: 10px;\n}\n\n.login__scan-text {\n  text-align: center;\n  color: #0a1b37;\n  margin-bottom: 3px;\n  font-weight: bold;\n  font-size: 15px;\n  cursor: default;\n}\n\n.login__version {\n  position: absolute;\n  bottom: 0;\n  margin-bottom: 5px;\n  padding-right: 5px;\n  width: 100%;\n  text-align: right;\n  font-size: 12px;\n  font-weight: 600;\n}\n", "", {"version":3,"sources":["/Users/hakanhamzacebi/saaspass_extension/src/popup/Login/style.css"],"names":[],"mappings":"AAAA;EACE,0BAA0B;EAC1B,iBAAiB;CAClB;;AAED;EACE,iBAAiB;EACjB,kBAAkB;EAClB,gBAAgB;EAChB,iBAAiB;CAClB;;AAED;;;EAGE,oBAAoB;EACpB,aAAa;CACd;;AAED;EACE,WAAW;EACX,mBAAmB;EACnB,iBAAiB;EACjB,gBAAgB;CACjB;;AAED;EACE,gBAAgB;CACjB;;AAED;EACE,iBAAiB;CAClB;;AAED;EACE,iBAAiB;CAClB;;AAED;EACE,mBAAmB;CACpB;;AAED;EACE,iBAAiB;EACjB,gBAAgB;EAChB,aAAa;EACb,mBAAmB;CACpB;;AAED;EACE,mBAAmB;CACpB;;AAED;EACE,kBAAkB;CACnB;;AAED;EACE,2BAA2B;EAC3B,WAAW;EACX,gBAAgB;EAChB,aAAa;EACb,eAAe;CAChB;;AAED;EACE,gDAA6C;CAC9C;;AAED;EACE,iBAAiB;CAClB;;AAED;EACE,oBAAoB;CACrB;;AAED;EACE,uBAAuB;EACvB,eAAiB;EACjB,sBAAsB;EACtB,0BAA0B;EAC1B,aAAa;EACb,WAAW;EACX,YAAY;EACZ,iBAAiB;EACjB,kBAAkB;EAClB,mBAAmB;CACpB;;AAED;EACE,iBAAiB;EACjB,oBAAoB;CACrB;;AAED;EACE,iBAAiB;EACjB,oBAAoB;CACrB;;AAED;EACE,mBAAmB;EACnB,eAAe;EACf,mBAAmB;EACnB,kBAAkB;EAClB,gBAAgB;EAChB,gBAAgB;CACjB;;AAED;EACE,mBAAmB;EACnB,UAAU;EACV,mBAAmB;EACnB,mBAAmB;EACnB,YAAY;EACZ,kBAAkB;EAClB,gBAAgB;EAChB,iBAAiB;CAClB","file":"style.css","sourcesContent":[".login__barcode-image {\n  border: 8px solid #0a1b37;\n  max-width: 229px;\n}\n\n.login__button {\n  border-radius: 0;\n  padding: 3px 65px;\n  font-size: 20px;\n  margin-top: 20px;\n}\n\n.login__button,\n.login__button.login__button:hover,\n.login__button.login__button:focus {\n  background: #40a3db;\n  color: white;\n}\n\n.error {\n  color: red;\n  position: absolute;\n  margin-top: -5px;\n  font-size: 13px;\n}\n\n.login__form {\n  padding: 0 20px;\n}\n\n.login__form-control {\n  border-radius: 0;\n}\n\n.login__form-control:focus {\n  box-shadow: none;\n}\n\n.login__form-group {\n  margin-bottom: 5px;\n}\n\n.login__alert {\n  margin-bottom: 0;\n  margin-top: 6px;\n  padding: 5px;\n  text-align: center;\n}\n\n.login__input {\n  margin-bottom: 5px;\n}\n\n.login {\n  padding: 3px 20px;\n}\n\n.login__remember-me-checkbox {\n  transform: scale(1.2, 1.2);\n  opacity: 0;\n  cursor: pointer;\n  height: 15px;\n  margin-left: 0;\n}\n\n.login__remember-me-checkbox:checked + .login__remember-me-label:before {\n  background-image: url('./checkbox-icon.png');\n}\n\n.login__remember-me-checkbox-wrapper {\n  margin-left: 4px;\n}\n\n.login__remember-me-label {\n  font-weight: normal;\n}\n\n.login__remember-me-label:before {\n  border: 1px solid #ccc;\n  content: '\\00a0';\n  display: inline-block;\n  font: 15px/1em sans-serif;\n  height: 20px;\n  padding: 0;\n  width: 20px;\n  background: #fff;\n  line-height: 25px;\n  margin-left: -24px;\n}\n\n.login__remember-me-text {\n  margin-left: 5px;\n  vertical-align: top;\n}\n\n.login__scan-icon {\n  margin-top: -8px;\n  margin-bottom: 10px;\n}\n\n.login__scan-text {\n  text-align: center;\n  color: #0a1b37;\n  margin-bottom: 3px;\n  font-weight: bold;\n  font-size: 15px;\n  cursor: default;\n}\n\n.login__version {\n  position: absolute;\n  bottom: 0;\n  margin-bottom: 5px;\n  padding-right: 5px;\n  width: 100%;\n  text-align: right;\n  font-size: 12px;\n  font-weight: 600;\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),

/***/ 435:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/popup/Login/checkbox-icon.png";

/***/ }),

/***/ 436:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(259);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(437);
/* harmony import */ var _Applications__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(480);
/* harmony import */ var _Authenticators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(496);
/* harmony import */ var _Details_AccountDetails__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(498);
/* harmony import */ var _Details_EpmDetails__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(504);
/* harmony import */ var _Home__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(505);
/* harmony import */ var _PasswordGenerator__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(513);
/* harmony import */ var _PasswordManager__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(518);
/* harmony import */ var _RouteNotFound__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(519);
/* harmony import */ var _SharedAccounts__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(520);
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(521);
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_style_css__WEBPACK_IMPORTED_MODULE_11__);













const Routes = () => react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["HashRouter"], null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Route"], null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Switch"], null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Redirect"], {
  exact: true,
  from: "/",
  to: "/home"
}), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Route"], {
  path: "/home",
  component: _Home__WEBPACK_IMPORTED_MODULE_6__["default"]
}), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Route"], {
  path: "/applications",
  component: _Applications__WEBPACK_IMPORTED_MODULE_2__["default"]
}), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Route"], {
  path: "/authenticators",
  component: _Authenticators__WEBPACK_IMPORTED_MODULE_3__["default"]
}), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Route"], {
  path: "/password-manager",
  component: _PasswordManager__WEBPACK_IMPORTED_MODULE_8__["default"]
}), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Route"], {
  path: "/shared-accounts",
  component: _SharedAccounts__WEBPACK_IMPORTED_MODULE_10__["default"]
}), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Route"], {
  path: "/epm-details/:appId/:accId",
  component: _Details_EpmDetails__WEBPACK_IMPORTED_MODULE_5__["default"]
}), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Route"], {
  path: "/account-details/:id",
  component: _Details_AccountDetails__WEBPACK_IMPORTED_MODULE_4__["default"]
}), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Route"], {
  path: "/password-generator",
  component: _PasswordGenerator__WEBPACK_IMPORTED_MODULE_7__["default"]
}), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Route"], {
  component: _RouteNotFound__WEBPACK_IMPORTED_MODULE_9__["default"]
}))));

/* harmony default export */ __webpack_exports__["default"] = (Routes);

/***/ }),

/***/ 480:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(259);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _common_sortBy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(230);
/* harmony import */ var _common_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(112);
/* harmony import */ var _LoginItems_LoginItemPage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(481);





class Applications extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    };
  }

  componentDidMount() {
    this.subscription = Object(_common_store__WEBPACK_IMPORTED_MODULE_2__["observe"])('accounts').subscribe(({
      accounts
    }) => this.setState({
      items: accounts ? Object(_common_sortBy__WEBPACK_IMPORTED_MODULE_1__["default"])(i => !i.ssoEnabled, i => i.applicationTypeName.toLowerCase(), i => i.applicationName.toLowerCase(), i => i.username.toLowerCase())(accounts) : []
    }));
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_LoginItems_LoginItemPage__WEBPACK_IMPORTED_MODULE_3__["default"], {
      items: this.state.items,
      title: `Company Applications (${this.state.items.length})`
    });
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Applications);

/***/ }),

/***/ 481:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(259);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Footer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(420);
/* harmony import */ var _Nav__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(423);
/* harmony import */ var _popup_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(482);
/* harmony import */ var _popup_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_popup_css__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _util_objectHasSubstring__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(484);
/* harmony import */ var _login_items_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(485);
/* harmony import */ var _login_items_css__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_login_items_css__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _LoginItemList__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(487);








class LoginItemPage extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.state = {
      filter: ''
    };
  }

  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Nav__WEBPACK_IMPORTED_MODULE_2__["default"], {
      back: true,
      sync: true
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("main", {
      className: "main"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ol", {
      className: "breadcrumb login-items__breadcrumb"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
      className: "active login-items__active"
    }, this.props.title)), this.props.items.length > 8 ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "form-group login-items__form-group list-item__border-bottom"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
      autoFocus: true,
      className: "form-control popup__search-input",
      onChange: e => this.setState({
        filter: e.target.value
      }),
      placeholder: "Search"
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "glyphicon glyphicon-search login-items__form-control-glyphicon color-summer-sky"
    })) : null, this.props.items.length ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_LoginItemList__WEBPACK_IMPORTED_MODULE_6__["default"], {
      items: this.props.items.filter(Object(_util_objectHasSubstring__WEBPACK_IMPORTED_MODULE_4__["default"])(this.state.filter))
    }) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
      className: "login-items__result"
    }, "No items.")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Footer__WEBPACK_IMPORTED_MODULE_1__["default"], null));
  }

}

/* harmony default export */ __webpack_exports__["default"] = (LoginItemPage);

/***/ }),

/***/ 482:
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(483);

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

/***/ 483:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(400)(true);
// imports


// module
exports.push([module.i, ".popup__list-item {\n  border: none;\n  cursor: pointer;\n  margin-bottom: 0;\n  min-height: 46px;\n  padding: 10px 15px;\n}\n\n.list-item__border-bottom {\n  border-bottom: 1px solid #ddd;\n}\n\n.popup__list-item:hover {\n  background-color: #f5f5f5;\n}\n\n.popup__search-input {\n  border: 1px none #40a3db;\n  border-radius: 0;\n  padding-left: 35px;\n}\n\n.popup__search-input::placeholder {\n  color: #0b1a35;\n  opacity: 0.8;\n}\n\n.popup__search-input:focus {\n  box-shadow: none;\n}\n\n.color-summer-sky {\n  color: #40a3db;\n}\n", "", {"version":3,"sources":["/Users/hakanhamzacebi/saaspass_extension/src/popup/popup.css"],"names":[],"mappings":"AAAA;EACE,aAAa;EACb,gBAAgB;EAChB,iBAAiB;EACjB,iBAAiB;EACjB,mBAAmB;CACpB;;AAED;EACE,8BAA8B;CAC/B;;AAED;EACE,0BAA0B;CAC3B;;AAED;EACE,yBAAyB;EACzB,iBAAiB;EACjB,mBAAmB;CACpB;;AAED;EACE,eAAe;EACf,aAAa;CACd;;AAED;EACE,iBAAiB;CAClB;;AAED;EACE,eAAe;CAChB","file":"popup.css","sourcesContent":[".popup__list-item {\n  border: none;\n  cursor: pointer;\n  margin-bottom: 0;\n  min-height: 46px;\n  padding: 10px 15px;\n}\n\n.list-item__border-bottom {\n  border-bottom: 1px solid #ddd;\n}\n\n.popup__list-item:hover {\n  background-color: #f5f5f5;\n}\n\n.popup__search-input {\n  border: 1px none #40a3db;\n  border-radius: 0;\n  padding-left: 35px;\n}\n\n.popup__search-input::placeholder {\n  color: #0b1a35;\n  opacity: 0.8;\n}\n\n.popup__search-input:focus {\n  box-shadow: none;\n}\n\n.color-summer-sky {\n  color: #40a3db;\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),

/***/ 484:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const findAllStringsAndNumbers = obj => Object.values(obj).filter(v => ['number', 'string'].includes(typeof v)).concat(...Object.values(obj).filter(v => v && typeof v === 'object').map(findAllStringsAndNumbers));

const objectHasSubstring = str => obj => findAllStringsAndNumbers(obj).map(v => `${v}`.toLowerCase()).some(s => s.includes(str.toLowerCase()));

/* harmony default export */ __webpack_exports__["default"] = (objectHasSubstring);

/***/ }),

/***/ 485:
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(486);

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

/***/ 486:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(400)(true);
// imports


// module
exports.push([module.i, ".login-items__breadcrumb > .login-items__active {\n  color: white;\n  cursor: default;\n}\n\n.login-items__breadcrumb {\n  margin-bottom: 0;\n  border-radius: 0;\n  background: #40a3db;\n  letter-spacing: 2px;\n}\n\n.login-items__form-control-glyphicon {\n  position: absolute;\n  left: 15px;\n  top: 10px;\n  font-weight: bold;\n}\n\n.login-items__form-group {\n  margin-bottom: 0;\n  z-index: 1;\n  position: relative;\n}\n\n.login-items__img {\n  width: 16px;\n  margin-right: 5px;\n  margin-top: -2px;\n}\n\n.login-items__icon {\n  width: 32px;\n  margin-right: 5px;\n  margin-top: -2px;\n}\n\n.login-items__list-group {\n  margin-bottom: 0;\n}\n\n.login-items__more-details {\n  margin-right: 5px;\n  margin-top: -8px;\n}\n\n.login-items__more-details,\n.login-items__more-details:hover,\n.login-items__more-details:active,\n.login-items__more-details:visited {\n  text-decoration: none;\n  color: #555;\n}\n\n.login-items__more-details:hover {\n  opacity: 0.5;\n}\n\n.login-items__open {\n  float: right;\n  margin-top: -23px;\n}\n\n.login-items__label {\n  width: 310px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  margin: -5px 0;\n  padding-left: 5px;\n}\n\n.login-items__result {\n  padding: 10px 15px;\n}\n\n.login-items__scroll {\n  overflow-y: auto;\n  height: 445px;\n}\n", "", {"version":3,"sources":["/Users/hakanhamzacebi/saaspass_extension/src/popup/Routes/LoginItems/login-items.css"],"names":[],"mappings":"AAAA;EACE,aAAa;EACb,gBAAgB;CACjB;;AAED;EACE,iBAAiB;EACjB,iBAAiB;EACjB,oBAAoB;EACpB,oBAAoB;CACrB;;AAED;EACE,mBAAmB;EACnB,WAAW;EACX,UAAU;EACV,kBAAkB;CACnB;;AAED;EACE,iBAAiB;EACjB,WAAW;EACX,mBAAmB;CACpB;;AAED;EACE,YAAY;EACZ,kBAAkB;EAClB,iBAAiB;CAClB;;AAED;EACE,YAAY;EACZ,kBAAkB;EAClB,iBAAiB;CAClB;;AAED;EACE,iBAAiB;CAClB;;AAED;EACE,kBAAkB;EAClB,iBAAiB;CAClB;;AAED;;;;EAIE,sBAAsB;EACtB,YAAY;CACb;;AAED;EACE,aAAa;CACd;;AAED;EACE,aAAa;EACb,kBAAkB;CACnB;;AAED;EACE,aAAa;EACb,oBAAoB;EACpB,iBAAiB;EACjB,wBAAwB;EACxB,eAAe;EACf,kBAAkB;CACnB;;AAED;EACE,mBAAmB;CACpB;;AAED;EACE,iBAAiB;EACjB,cAAc;CACf","file":"login-items.css","sourcesContent":[".login-items__breadcrumb > .login-items__active {\n  color: white;\n  cursor: default;\n}\n\n.login-items__breadcrumb {\n  margin-bottom: 0;\n  border-radius: 0;\n  background: #40a3db;\n  letter-spacing: 2px;\n}\n\n.login-items__form-control-glyphicon {\n  position: absolute;\n  left: 15px;\n  top: 10px;\n  font-weight: bold;\n}\n\n.login-items__form-group {\n  margin-bottom: 0;\n  z-index: 1;\n  position: relative;\n}\n\n.login-items__img {\n  width: 16px;\n  margin-right: 5px;\n  margin-top: -2px;\n}\n\n.login-items__icon {\n  width: 32px;\n  margin-right: 5px;\n  margin-top: -2px;\n}\n\n.login-items__list-group {\n  margin-bottom: 0;\n}\n\n.login-items__more-details {\n  margin-right: 5px;\n  margin-top: -8px;\n}\n\n.login-items__more-details,\n.login-items__more-details:hover,\n.login-items__more-details:active,\n.login-items__more-details:visited {\n  text-decoration: none;\n  color: #555;\n}\n\n.login-items__more-details:hover {\n  opacity: 0.5;\n}\n\n.login-items__open {\n  float: right;\n  margin-top: -23px;\n}\n\n.login-items__label {\n  width: 310px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  margin: -5px 0;\n  padding-left: 5px;\n}\n\n.login-items__result {\n  padding: 10px 15px;\n}\n\n.login-items__scroll {\n  overflow-y: auto;\n  height: 445px;\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),

/***/ 487:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(259);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(437);
/* harmony import */ var _common_normalizeItem__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(488);
/* harmony import */ var _common_onLogoError__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(494);
/* harmony import */ var _common_runInBackground__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(238);
/* harmony import */ var _images_login_png__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(495);
/* harmony import */ var _images_login_png__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_images_login_png__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _popup_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(482);
/* harmony import */ var _popup_css__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_popup_css__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _login_items_css__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(485);
/* harmony import */ var _login_items_css__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_login_items_css__WEBPACK_IMPORTED_MODULE_7__);









const launch = item => {
  if (!item.applicationId || item.epmAppSettings) {
    Object(_common_runInBackground__WEBPACK_IMPORTED_MODULE_4__["autoFillInit"])({
      item,
      newTab: true,
      submit: true
    });
  } else {
    Object(_common_runInBackground__WEBPACK_IMPORTED_MODULE_4__["loginWithApplication"])(item.applicationId, item.companyUserAccountId);
  }
};

const LoginItemList = ({
  items
}) => react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
  className: "list-group login-items__list-group login-items__scroll"
}, items.map(_common_normalizeItem__WEBPACK_IMPORTED_MODULE_2__["default"]).map(item => react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
  className: "list-group-item popup__list-item list-item__border-bottom",
  key: item.id,
  onClick: () => item.ssoEnabled && launch(item),
  title: item.applicationTypeName
}, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
  src: item.logo,
  className: "login-items__icon pull-left",
  onError: _common_onLogoError__WEBPACK_IMPORTED_MODULE_3__["default"]
}), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
  className: "login-items__label"
}, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("b", null, item.displayName), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("br", null), item.username, item.detailPath ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Link"], {
  to: item.detailPath,
  onClick: e => e.stopPropagation(),
  className: "glyphicon glyphicon-chevron-right pull-right login-items__more-details",
  title: "More details"
}) : null), item.ssoEnabled ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
  src: _images_login_png__WEBPACK_IMPORTED_MODULE_5___default.a,
  className: "login-items__open login-items__img",
  title: "Log in"
}) : null)));

/* harmony default export */ __webpack_exports__["default"] = (LoginItemList);

/***/ }),

/***/ 488:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _normalizeApplication__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(489);
/* harmony import */ var _normalizeAuthenticator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(490);
/* harmony import */ var _normalizeEpm__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(492);
/* harmony import */ var _normalizeSharedAccount__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(493);





const normalizeItem = item => {
  if (item.epmAppSettings) {
    return Object(_normalizeEpm__WEBPACK_IMPORTED_MODULE_2__["default"])(item);
  } else if (item.applicationId) {
    return Object(_normalizeApplication__WEBPACK_IMPORTED_MODULE_0__["default"])(item);
  } else if (item.isShared) {
    return Object(_normalizeSharedAccount__WEBPACK_IMPORTED_MODULE_3__["default"])(item);
  } else {
    return Object(_normalizeAuthenticator__WEBPACK_IMPORTED_MODULE_1__["default"])(item);
  }
};

/* harmony default export */ __webpack_exports__["default"] = (normalizeItem);

/***/ }),

/***/ 489:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const normalizeApplication = item => {
  const appId = item.applicationId;
  const accId = item.companyUserAccountId;
  return { ...item,
    detailPath: null,
    displayName: item.applicationName,
    id: `${appId}-${accId}`,
    logo: `https://cdn.saaspass.com/apps/${item.slug}/images/thumb.png`
  };
};

/* harmony default export */ __webpack_exports__["default"] = (normalizeApplication);

/***/ }),

/***/ 490:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _authenticatorLogoUrl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(491);


const normalizeAuthenticator = item => {
  return { ...item,
    detailPath: `/account-details/${item.id}`,
    displayName: item.displayname || item.publicService.serviceName,
    logo: Object(_authenticatorLogoUrl__WEBPACK_IMPORTED_MODULE_0__["default"])(item.publicService.slug, 32)
  };
};

/* harmony default export */ __webpack_exports__["default"] = (normalizeAuthenticator);

/***/ }),

/***/ 491:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const authenticatorLogoUrl = (slug, size) => `https://cdn.saaspass.com/a52e2205866340ea/authenticators/${slug}_${size}.png`;

/* harmony default export */ __webpack_exports__["default"] = (authenticatorLogoUrl);

/***/ }),

/***/ 492:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _authenticatorLogoUrl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(491);


const normalizeEpm = item => {
  const appId = item.applicationId;
  const accId = item.companyUserAccountId;
  return { ...item,
    detailPath: `/epm-details/${appId}/${accId}`,
    displayName: item.applicationName,
    id: `${appId}-${accId}`,
    logo: Object(_authenticatorLogoUrl__WEBPACK_IMPORTED_MODULE_0__["default"])(item.epmAppSettings.publicService.slug, 32)
  };
};

/* harmony default export */ __webpack_exports__["default"] = (normalizeEpm);

/***/ }),

/***/ 493:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _authenticatorLogoUrl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(491);


const normalizeSharedAccount = item => {
  return { ...item,
    detailPath: `/account-details/${item.id}`,
    displayName: item.displayname || item.publicService.serviceName,
    logo: Object(_authenticatorLogoUrl__WEBPACK_IMPORTED_MODULE_0__["default"])(item.publicService.slug, 32)
  };
};

/* harmony default export */ __webpack_exports__["default"] = (normalizeSharedAccount);

/***/ }),

/***/ 494:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _authenticatorLogoUrl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(491);


const onLogoError = event => {
  event.target.src = Object(_authenticatorLogoUrl__WEBPACK_IMPORTED_MODULE_0__["default"])('other', 32);
};

/* harmony default export */ __webpack_exports__["default"] = (onLogoError);

/***/ }),

/***/ 495:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/login.png";

/***/ }),

/***/ 496:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(259);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _common_sortAuthenticators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(497);
/* harmony import */ var _common_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(112);
/* harmony import */ var _LoginItems_LoginItemPage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(481);





class Authenticators extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    };
  }

  componentDidMount() {
    this.subscription = Object(_common_store__WEBPACK_IMPORTED_MODULE_2__["observe"])('authenticators').subscribe(({
      authenticators
    }) => this.setState({
      items: Object(_common_sortAuthenticators__WEBPACK_IMPORTED_MODULE_1__["default"])((authenticators || []).filter(i => !i.isShared))
    }));
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_LoginItems_LoginItemPage__WEBPACK_IMPORTED_MODULE_3__["default"], {
      items: this.state.items,
      title: `Authenticators (${this.state.items.length})`
    });
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Authenticators);

/***/ }),

/***/ 497:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _sortBy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(230);

const sortAuthenticators = Object(_sortBy__WEBPACK_IMPORTED_MODULE_0__["default"])(i => !i.ssoEnabled, i => i.publicService.serviceName.toLowerCase(), i => i.username.toLowerCase());
/* harmony default export */ __webpack_exports__["default"] = (sortAuthenticators);

/***/ }),

/***/ 498:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(259);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(437);
/* harmony import */ var _common_authenticatorLogoUrl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(491);
/* harmony import */ var _common_delay__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(242);
/* harmony import */ var _common_normalizeItem__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(488);
/* harmony import */ var _common_onLogoError__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(494);
/* harmony import */ var _common_runInBackground__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(238);
/* harmony import */ var _common_store__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(112);
/* harmony import */ var _Footer__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(420);
/* harmony import */ var _Nav__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(423);
/* harmony import */ var _copy_png__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(499);
/* harmony import */ var _copy_png__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_copy_png__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _eye_png__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(500);
/* harmony import */ var _eye_png__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_eye_png__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _launch_png__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(501);
/* harmony import */ var _launch_png__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_launch_png__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(502);
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(_style_css__WEBPACK_IMPORTED_MODULE_13__);















class AccountDetails extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.state = {
      isCopiedVisible: false,
      isPasswordVisible: false,
      item: null,
      otp: '',
      password: ''
    };
  }

  componentDidMount() {
    this.subscription = Object(_common_store__WEBPACK_IMPORTED_MODULE_7__["observe"])('authenticators', 'passwordmanagers').subscribe(({
      authenticators,
      passwordmanagers
    }) => {
      if (!authenticators || !passwordmanagers) return;
      const {
        id
      } = this.props.match.params;
      const accounts = [...authenticators, ...passwordmanagers];
      const item = Object(_common_normalizeItem__WEBPACK_IMPORTED_MODULE_4__["default"])(accounts.find(i => i.id === id));
      this.setState({
        item: item
      });
      this.setOtp(item);
    });
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  async copyToClipboard(value) {
    await navigator.clipboard.writeText(value);
    this.setState({
      isCopiedVisible: true
    });
    await Object(_common_delay__WEBPACK_IMPORTED_MODULE_3__["default"])(2000);
    this.setState({
      isCopiedVisible: false
    });
  }

  async setOtp(item) {
    if (item && item.showOtp && !this.state.otp) {
      const otp = await Object(_common_runInBackground__WEBPACK_IMPORTED_MODULE_6__["getCredentials"])('OTP', item.id, item.isShared);
      this.setState({
        otp
      });
    }
  }

  async passwordToggleVisibility() {
    if (!this.state.password) {
      const {
        id,
        isShared
      } = this.state.item;
      const password = `${await Object(_common_runInBackground__WEBPACK_IMPORTED_MODULE_6__["getCredentials"])('PASSWORD', id, isShared)}`;
      this.setState({
        password
      });
    }

    this.setState(state => ({
      isPasswordVisible: !state.isPasswordVisible
    }));
  }

  async passwordCopyToClipboard() {
    if (this.state.password) {
      await this.copyToClipboard(this.state.password);
    } else {
      const {
        id,
        isShared
      } = this.state.item;
      const password = `${await Object(_common_runInBackground__WEBPACK_IMPORTED_MODULE_6__["getCredentials"])('PASSWORD', id, isShared)}`;
      this.setState({
        password
      });
      await this.copyToClipboard(password);
    }
  }

  render() {
    const item = this.state.item;
    if (!item) return null;
    const {
      serviceName,
      serviceUrl,
      slug
    } = item.publicService;
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Nav__WEBPACK_IMPORTED_MODULE_9__["default"], {
      back: true
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("main", {
      className: "main"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", {
      className: "list-group details__items"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
      className: "list-group-item details__item details__name"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "col-xs-3",
      align: "center"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
      src: Object(_common_authenticatorLogoUrl__WEBPACK_IMPORTED_MODULE_2__["default"])(slug, 64),
      onError: _common_onLogoError__WEBPACK_IMPORTED_MODULE_5__["default"],
      className: "details__logo"
    })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "col-xs-9"
    }, "Service: ", serviceName), serviceUrl ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "col-xs-9"
    }, "URL: ", serviceUrl) : null)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
      className: "list-group-item details__item"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "col-xs-3 details__border-right"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
      className: "details__label"
    }, "Username:")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "col-xs-6"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
      value: item.username,
      readOnly: true
    })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "col-xs-3"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
      src: _copy_png__WEBPACK_IMPORTED_MODULE_10___default.a,
      onClick: () => this.copyToClipboard(item.username),
      title: "Copy",
      className: "details__icon-button",
      align: "right"
    })))), item.showPassword ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
      className: "list-group-item details__item"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "col-xs-3 details__border-right"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
      className: "details__label"
    }, "Password:")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "col-xs-6"
    }, this.state.isPasswordVisible ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
      value: this.state.password,
      readOnly: true
    }) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
      type: "password",
      value: "***************",
      readOnly: true
    })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "col-xs-3"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
      src: _eye_png__WEBPACK_IMPORTED_MODULE_11___default.a,
      title: "Show/hide password",
      className: "details__icon-button",
      align: "left",
      onClick: () => this.passwordToggleVisibility()
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
      src: _copy_png__WEBPACK_IMPORTED_MODULE_10___default.a,
      onClick: () => this.passwordCopyToClipboard(),
      title: "Copy",
      className: "details__icon-button",
      align: "right"
    })))) : null, this.state.otp ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
      className: "list-group-item details__item"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "col-xs-3 details__border-right"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
      className: "details__label"
    }, "OTP:")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "col-xs-6"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
      value: this.state.otp,
      readOnly: true
    })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "col-xs-3"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
      src: _copy_png__WEBPACK_IMPORTED_MODULE_10___default.a,
      onClick: () => this.copyToClipboard(this.state.otp),
      title: "Copy",
      className: "details__icon-button",
      align: "right"
    })))) : null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
      className: "btn btn-primary btn-lg details__login-button",
      disabled: !item.ssoEnabled,
      onClick: () => Object(_common_runInBackground__WEBPACK_IMPORTED_MODULE_6__["autoFillInit"])({
        item,
        newTab: true,
        submit: true
      })
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
      src: _launch_png__WEBPACK_IMPORTED_MODULE_12___default.a
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, " LAUNCH")), this.state.isCopiedVisible ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "details__copied"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "label label-success details__copied-label"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
      className: "glyphicon glyphicon-ok-circle details__copied-icon"
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, " Copied"))) : null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Footer__WEBPACK_IMPORTED_MODULE_8__["default"], null));
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Object(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["withRouter"])(AccountDetails));

/***/ }),

/***/ 499:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/popup/Routes/Details/copy.png";

/***/ }),

/***/ 500:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/popup/Routes/Details/eye.png";

/***/ }),

/***/ 501:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/popup/Routes/Details/launch.png";

/***/ }),

/***/ 502:
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(503);

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

/***/ 503:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(400)(true);
// imports


// module
exports.push([module.i, ".details__border-right {\n  border-right: 1px solid #ddd;\n}\n\n.details__items {\n  width: 98%;\n}\n\n.details__item {\n  border-right: none;\n  border-left: none;\n}\n\n.details__label {\n  margin-top: 6px;\n  margin-bottom: 6px;\n}\n\n.details__name {\n  border-radius: 0;\n  padding: 20px 10px;\n}\n\n.details__copied {\n  text-align: center;\n  margin-top: 15px;\n}\n\n.details__copied-label {\n  font-size: 16px;\n}\n\n.details__copied-icon {\n  font-size: 21px;\n  vertical-align: sub;\n}\n\n.details__login-button {\n  background-color: #40a3db;\n  border-radius: 0;\n  width: 40%;\n  margin-left: 55%;\n}\n\n.details__icon-button {\n  width: 24px;\n  height: 24px;\n}\n\n.details__icon-button:hover {\n  opacity: 0.7;\n  filter: alpha(opacity=40);\n}\n\n.details__logo {\n  height: 64px;\n  width: 64px;\n}\n", "", {"version":3,"sources":["/Users/hakanhamzacebi/saaspass_extension/src/popup/Routes/Details/style.css"],"names":[],"mappings":"AAAA;EACE,6BAA6B;CAC9B;;AAED;EACE,WAAW;CACZ;;AAED;EACE,mBAAmB;EACnB,kBAAkB;CACnB;;AAED;EACE,gBAAgB;EAChB,mBAAmB;CACpB;;AAED;EACE,iBAAiB;EACjB,mBAAmB;CACpB;;AAED;EACE,mBAAmB;EACnB,iBAAiB;CAClB;;AAED;EACE,gBAAgB;CACjB;;AAED;EACE,gBAAgB;EAChB,oBAAoB;CACrB;;AAED;EACE,0BAA0B;EAC1B,iBAAiB;EACjB,WAAW;EACX,iBAAiB;CAClB;;AAED;EACE,YAAY;EACZ,aAAa;CACd;;AAED;EACE,aAAa;EACb,0BAA0B;CAC3B;;AAED;EACE,aAAa;EACb,YAAY;CACb","file":"style.css","sourcesContent":[".details__border-right {\n  border-right: 1px solid #ddd;\n}\n\n.details__items {\n  width: 98%;\n}\n\n.details__item {\n  border-right: none;\n  border-left: none;\n}\n\n.details__label {\n  margin-top: 6px;\n  margin-bottom: 6px;\n}\n\n.details__name {\n  border-radius: 0;\n  padding: 20px 10px;\n}\n\n.details__copied {\n  text-align: center;\n  margin-top: 15px;\n}\n\n.details__copied-label {\n  font-size: 16px;\n}\n\n.details__copied-icon {\n  font-size: 21px;\n  vertical-align: sub;\n}\n\n.details__login-button {\n  background-color: #40a3db;\n  border-radius: 0;\n  width: 40%;\n  margin-left: 55%;\n}\n\n.details__icon-button {\n  width: 24px;\n  height: 24px;\n}\n\n.details__icon-button:hover {\n  opacity: 0.7;\n  filter: alpha(opacity=40);\n}\n\n.details__logo {\n  height: 64px;\n  width: 64px;\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),

/***/ 504:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(259);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(437);
/* harmony import */ var _common_authenticatorLogoUrl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(491);
/* harmony import */ var _common_delay__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(242);
/* harmony import */ var _common_normalizeItem__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(488);
/* harmony import */ var _common_onLogoError__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(494);
/* harmony import */ var _common_runInBackground__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(238);
/* harmony import */ var _common_store__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(112);
/* harmony import */ var _Footer__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(420);
/* harmony import */ var _Nav__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(423);
/* harmony import */ var _copy_png__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(499);
/* harmony import */ var _copy_png__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_copy_png__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _eye_png__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(500);
/* harmony import */ var _eye_png__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_eye_png__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _launch_png__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(501);
/* harmony import */ var _launch_png__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_launch_png__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(502);
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(_style_css__WEBPACK_IMPORTED_MODULE_13__);















const getPassword = async item => `${await Object(_common_runInBackground__WEBPACK_IMPORTED_MODULE_6__["getEpmPassword"])(item.applicationId, item.companyUserAccountId)}`;

class EpmDetails extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.state = {
      isCopiedVisible: false,
      isPasswordVisible: false,
      item: null,
      password: ''
    };
  }

  componentDidMount() {
    this.subscription = Object(_common_store__WEBPACK_IMPORTED_MODULE_7__["observe"])('accounts').subscribe(({
      accounts
    }) => {
      if (!accounts) return;
      const {
        appId,
        accId
      } = this.props.match.params;
      this.setState({
        item: accounts.filter(i => i.epmAppSettings).map(_common_normalizeItem__WEBPACK_IMPORTED_MODULE_4__["default"]).find(i => i.id === `${appId}-${accId}`)
      });
    });
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  async copyToClipboard(value) {
    await navigator.clipboard.writeText(value);
    this.setState({
      isCopiedVisible: true
    });
    await Object(_common_delay__WEBPACK_IMPORTED_MODULE_3__["default"])(2000);
    this.setState({
      isCopiedVisible: false
    });
  }

  async passwordToggleVisibility() {
    if (!this.state.password) {
      this.setState({
        password: await getPassword(this.state.item)
      });
    }

    this.setState(state => ({
      isPasswordVisible: !state.isPasswordVisible
    }));
  }

  async passwordCopyToClipboard() {
    if (this.state.password) {
      await this.copyToClipboard(this.state.password);
    } else {
      const password = await getPassword(this.state.item);
      this.setState({
        password
      });
      await this.copyToClipboard(password);
    }
  }

  render() {
    const item = this.state.item;
    if (!item) return null;
    const {
      serviceName,
      serviceUrl,
      slug
    } = item.epmAppSettings.publicService;
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Nav__WEBPACK_IMPORTED_MODULE_9__["default"], {
      back: true
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("main", {
      className: "main"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", {
      className: "list-group details__items"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
      className: "list-group-item details__item details__name"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "col-xs-3",
      align: "center"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
      src: Object(_common_authenticatorLogoUrl__WEBPACK_IMPORTED_MODULE_2__["default"])(slug, 64),
      onError: _common_onLogoError__WEBPACK_IMPORTED_MODULE_5__["default"],
      className: "details__logo"
    })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "col-xs-9"
    }, "Name: ", item.applicationName), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "col-xs-9"
    }, "Type: ", item.applicationTypeName), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "col-xs-9"
    }, "Service: ", serviceName), serviceUrl ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "col-xs-9"
    }, "URL: ", serviceUrl) : null)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
      className: "list-group-item details__item"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "col-xs-3 details__border-right"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
      className: "details__label"
    }, "Username:")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "col-xs-6"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
      value: item.username,
      readOnly: true
    })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "col-xs-3"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
      src: _copy_png__WEBPACK_IMPORTED_MODULE_10___default.a,
      onClick: () => this.copyToClipboard(item.username),
      title: "Copy",
      className: "details__icon-button",
      align: "right"
    })))), item.epmAppSettings.canUserViewPassword ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
      className: "list-group-item details__item"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "col-xs-3 details__border-right"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
      className: "details__label"
    }, "Password:")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "col-xs-6"
    }, this.state.isPasswordVisible ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
      value: this.state.password,
      readOnly: true
    }) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
      type: "password",
      value: "***************",
      readOnly: true
    })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "col-xs-3"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
      src: _eye_png__WEBPACK_IMPORTED_MODULE_11___default.a,
      title: "Show/hide password",
      className: "details__icon-button",
      align: "left",
      onClick: () => this.passwordToggleVisibility()
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
      src: _copy_png__WEBPACK_IMPORTED_MODULE_10___default.a,
      onClick: () => this.passwordCopyToClipboard(),
      title: "Copy",
      className: "details__icon-button",
      align: "right"
    })))) : null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
      className: "btn btn-primary btn-lg details__login-button",
      disabled: !item.ssoEnabled,
      onClick: () => Object(_common_runInBackground__WEBPACK_IMPORTED_MODULE_6__["autoFillInit"])({
        item,
        newTab: true,
        submit: true
      })
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
      src: _launch_png__WEBPACK_IMPORTED_MODULE_12___default.a
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, " LAUNCH")), this.state.isCopiedVisible ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "details__copied"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "label label-success details__copied-label"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
      className: "glyphicon glyphicon-ok-circle details__copied-icon"
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, " Copied"))) : null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Footer__WEBPACK_IMPORTED_MODULE_8__["default"], null));
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Object(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["withRouter"])(EpmDetails));

/***/ }),

/***/ 505:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(browser) {/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(259);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(437);
/* harmony import */ var _common_runInBackground__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(238);
/* harmony import */ var _common_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(112);
/* harmony import */ var _images_login_png__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(495);
/* harmony import */ var _images_login_png__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_images_login_png__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _Footer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(420);
/* harmony import */ var _Nav__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(423);
/* harmony import */ var _popup_css__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(482);
/* harmony import */ var _popup_css__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_popup_css__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _util_objectHasSubstring__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(484);
/* harmony import */ var _LoginItems_LoginItemList__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(487);
/* harmony import */ var _help_png__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(506);
/* harmony import */ var _help_png__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_help_png__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _import_png__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(507);
/* harmony import */ var _import_png__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_import_png__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _key_png__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(508);
/* harmony import */ var _key_png__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_key_png__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _logout_png__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(509);
/* harmony import */ var _logout_png__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(_logout_png__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var _orca_32_png__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(510);
/* harmony import */ var _orca_32_png__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(_orca_32_png__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(511);
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(_style_css__WEBPACK_IMPORTED_MODULE_15__);

















class Home extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.state = {
      filter: '',
      isHardTokenUser: false,
      items: [],
      saaspassId: null
    };
  }

  componentDidMount() {
    this.subscription = Object(_common_store__WEBPACK_IMPORTED_MODULE_3__["observe"])('accounts', 'authenticators', 'isHardTokenUser', 'passwordmanagers', 'saaspassId').subscribe(({
      accounts,
      authenticators,
      isHardTokenUser,
      passwordmanagers,
      saaspassId
    }) => {
      if (accounts && authenticators && passwordmanagers && saaspassId) {
        this.setState({
          isHardTokenUser,
          items: [...accounts, ...authenticators, ...passwordmanagers],
          saaspassId
        });
      }
    });
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Nav__WEBPACK_IMPORTED_MODULE_6__["default"], {
      logo: true
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("main", {
      className: "main"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "form-group login-items__form-group list-item__border-bottom"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
      autoFocus: true,
      className: "form-control popup__search-input",
      onChange: e => this.setState({
        filter: e.target.value
      }),
      placeholder: "Search"
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "glyphicon glyphicon-search login-items__form-control-glyphicon color-summer-sky"
    })), this.state.filter ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_LoginItems_LoginItemList__WEBPACK_IMPORTED_MODULE_9__["default"], {
      items: this.state.items.filter(Object(_util_objectHasSubstring__WEBPACK_IMPORTED_MODULE_8__["default"])(this.state.filter))
    }) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "list-group"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Link"], {
      to: "/applications",
      className: "list-group-item popup__list-item home__account-item"
    }, "Company Applications Login", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "glyphicon pull-right home__glyphicon glyphicon-chevron-right"
    })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Link"], {
      to: "/authenticators",
      className: "list-group-item popup__list-item home__account-item"
    }, "Authenticators Login", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "glyphicon pull-right home__glyphicon glyphicon-chevron-right"
    })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Link"], {
      to: "/password-manager",
      className: "list-group-item popup__list-item home__account-item"
    }, "Password Manager Login", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "glyphicon pull-right home__glyphicon glyphicon-chevron-right"
    })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Link"], {
      to: "/shared-accounts",
      className: "list-group-item popup__list-item home__account-item list-item__border-bottom"
    }, "Shared Accounts", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "glyphicon pull-right home__glyphicon glyphicon-chevron-right"
    })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
      className: "list-group-item popup__list-item list-item__border-bottom",
      onClick: () => Object(_common_runInBackground__WEBPACK_IMPORTED_MODULE_2__["portalLogin"])()
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
      src: _orca_32_png__WEBPACK_IMPORTED_MODULE_14___default.a,
      className: "home__list-img"
    }), "SAASPASS Web Portal Login", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
      src: _images_login_png__WEBPACK_IMPORTED_MODULE_4___default.a,
      className: "pull-right home__list-img",
      title: "Log in"
    })), this.state.isHardTokenUser ? null : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
      className: "list-group-item popup__list-item list-item__border-bottom",
      onClick: () => Object(_common_runInBackground__WEBPACK_IMPORTED_MODULE_2__["portalImportPasswordManager"])()
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
      src: _import_png__WEBPACK_IMPORTED_MODULE_11___default.a,
      className: "home__list-img"
    }), "Import passwords"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Link"], {
      to: "/password-generator",
      className: "list-group-item popup__list-item list-item__border-bottom"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
      src: _key_png__WEBPACK_IMPORTED_MODULE_12___default.a,
      className: "home__list-img"
    }), "Password Generator", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "glyphicon home__glyphicon glyphicon-chevron-right pull-right"
    })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
      onClick: () => browser.runtime.openOptionsPage(),
      className: "list-group-item popup__list-item list-item__border-bottom"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "glyphicon home__glyphicon glyphicon-cog color-summer-sky"
    }), "Options"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
      className: "list-group-item popup__list-item list-item__border-bottom",
      href: "https://saaspass.com/faq/",
      target: "_blank"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
      src: _help_png__WEBPACK_IMPORTED_MODULE_10___default.a,
      className: "home__list-img"
    }), "Help"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
      className: "list-group-item popup__list-item",
      onClick: () => Object(_common_runInBackground__WEBPACK_IMPORTED_MODULE_2__["extensionLogout"])()
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
      src: _logout_png__WEBPACK_IMPORTED_MODULE_13___default.a,
      className: "home__list-img"
    }), "Logout : SAASPASS ID > ", react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("b", null, this.state.saaspassId)))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Footer__WEBPACK_IMPORTED_MODULE_5__["default"], null));
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Home);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(2)))

/***/ }),

/***/ 506:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/popup/Routes/Home/help.png";

/***/ }),

/***/ 507:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/popup/Routes/Home/import.png";

/***/ }),

/***/ 508:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/popup/Routes/Home/key.png";

/***/ }),

/***/ 509:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/popup/Routes/Home/logout.png";

/***/ }),

/***/ 510:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/popup/Routes/Home/orca-32.png";

/***/ }),

/***/ 511:
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(512);

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

/***/ 512:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(400)(true);
// imports


// module
exports.push([module.i, ".home__glyphicon {\n  margin-right: 5px;\n}\n\n.home__list-img {\n  width: 16px;\n  margin-right: 5px;\n}\n\n.home__account-item {\n  padding: 15px;\n}\n", "", {"version":3,"sources":["/Users/hakanhamzacebi/saaspass_extension/src/popup/Routes/Home/style.css"],"names":[],"mappings":"AAAA;EACE,kBAAkB;CACnB;;AAED;EACE,YAAY;EACZ,kBAAkB;CACnB;;AAED;EACE,cAAc;CACf","file":"style.css","sourcesContent":[".home__glyphicon {\n  margin-right: 5px;\n}\n\n.home__list-img {\n  width: 16px;\n  margin-right: 5px;\n}\n\n.home__account-item {\n  padding: 15px;\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),

/***/ 513:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(259);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _common_delay__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(242);
/* harmony import */ var _Footer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(420);
/* harmony import */ var _Nav__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(423);
/* harmony import */ var _popup_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(482);
/* harmony import */ var _popup_css__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_popup_css__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _copy_png__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(514);
/* harmony import */ var _copy_png__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_copy_png__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _generatePassword__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(515);
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(516);
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_style_css__WEBPACK_IMPORTED_MODULE_7__);









class PasswordGenerator extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.state = {
      isCopiedVisible: false,
      length: 12,
      lower: true,
      numbers: true,
      password: '',
      symbols: true,
      upper: true
    };
  }

  componentDidMount() {
    this.generate();
  }

  handleLengthChange(e) {
    this.setState({
      length: e.target.value
    });
    this.generate();
  }

  handleLowerChange(e) {
    this.setState({
      lower: e.target.checked
    });
    this.generate();
  }

  handleUpperChange(e) {
    this.setState({
      upper: e.target.checked
    });
    this.generate();
  }

  handleNumbersChange(e) {
    this.setState({
      numbers: e.target.checked
    });
    this.generate();
  }

  handleSymbolsChange(e) {
    this.setState({
      symbols: e.target.checked
    });
    this.generate();
  }

  handlePasswordClick(e) {
    e.target.select();
    this.copyToClipboard();
  }

  async copyToClipboard() {
    await navigator.clipboard.writeText(this.state.password);
    this.setState({
      isCopiedVisible: true
    });
    await Object(_common_delay__WEBPACK_IMPORTED_MODULE_1__["default"])(2000);
    this.setState({
      isCopiedVisible: false
    });
  }

  generate() {
    this.setState(({
      length,
      lower,
      upper,
      numbers,
      symbols
    }) => ({
      password: Object(_generatePassword__WEBPACK_IMPORTED_MODULE_6__["default"])({
        length,
        lower,
        upper,
        numbers,
        symbols
      })
    }));
  }

  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Nav__WEBPACK_IMPORTED_MODULE_3__["default"], {
      back: true
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("main", {
      className: "main"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ol", {
      className: "breadcrumb pg__breadcrumb"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
      className: "active pg__active"
    }, "Password Generator")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("ul", {
      className: "list-group"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
      className: "list-group-item pg__li pg__li__password"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "form-group pg__form-group"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
      className: "form-control input-lg pg__refresh-input",
      onClick: e => this.handlePasswordClick(e),
      value: this.state.password,
      readOnly: true
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "glyphicon glyphicon-refresh pg__glyphicon-refresh color-summer-sky",
      onClick: () => this.generate()
    }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
      className: "list-group-item pg__li"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "col-xs-2"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
      className: "pg__p"
    }, "Length")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "col-xs-8"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
      type: "range",
      className: "pg__range",
      min: 4,
      max: 64,
      value: this.state.length,
      onChange: e => this.handleLengthChange(e)
    })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "col-xs-2"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
      className: "pg__p"
    }, this.state.length)))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
      className: "list-group-item pg__li"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "col-xs-6 pg__border-right"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "col-xs-6"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
      className: "pg__p"
    }, "a\u2013z")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "col-xs-6"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
      className: "pg__switch"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
      type: "checkbox",
      className: "pg__checkbox",
      checked: this.state.lower,
      onChange: e => this.handleLowerChange(e)
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "pg__slider round"
    })))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "col-xs-6"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "col-xs-6"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
      className: "pg__p"
    }, "A\u2013Z")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "col-xs-6"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
      className: "pg__switch"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
      type: "checkbox",
      className: "pg__checkbox",
      checked: this.state.upper,
      onChange: e => this.handleUpperChange(e)
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "pg__slider round"
    })))))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("li", {
      className: "list-group-item pg__li"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "col-xs-6 pg__border-right"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "col-xs-6"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
      className: "pg__p"
    }, "0\u20139")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "col-xs-6"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
      className: "pg__switch"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
      type: "checkbox",
      className: "pg__checkbox",
      checked: this.state.numbers,
      onChange: e => this.handleNumbersChange(e)
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "pg__slider round"
    })))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "col-xs-6"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "col-xs-6"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
      className: "pg__p"
    }, "!&@%#")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "col-xs-6"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
      className: "pg__switch"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
      type: "checkbox",
      className: "pg__checkbox",
      checked: this.state.symbols,
      onChange: e => this.handleSymbolsChange(e)
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "pg__slider round"
    })))))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
      className: "btn btn-primary btn-lg btn-block pg__copy-button",
      onClick: () => this.copyToClipboard()
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
      src: _copy_png__WEBPACK_IMPORTED_MODULE_5___default.a
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, " COPY PASSWORD")), this.state.isCopiedVisible ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "pg__copied"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "label label-success pg__copied-label"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
      className: "glyphicon glyphicon-ok-circle pg__copied-icon"
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, " Password Copied"))) : null)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Footer__WEBPACK_IMPORTED_MODULE_2__["default"], null));
  }

}

/* harmony default export */ __webpack_exports__["default"] = (PasswordGenerator);

/***/ }),

/***/ 514:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/popup/Routes/PasswordGenerator/copy.png";

/***/ }),

/***/ 515:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const generatePassword = ({
  length = 20,
  lower = true,
  upper = true,
  numbers = true,
  symbols = true
}) => {
  let pool = '';
  if (lower) pool += 'abcdefghijklmnopqrstuvwxyz';
  if (upper) pool += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (numbers) pool += '1234567890';
  if (symbols) pool += '`~!@#$%^&*()_-+={}[]\\|:;"\'<>,.?/';
  return Array.from({
    length
  }).map(() => pool[Math.floor(Math.random() * pool.length)]).join('');
};

/* harmony default export */ __webpack_exports__["default"] = (generatePassword);

/***/ }),

/***/ 516:
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(517);

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

/***/ 517:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(400)(true);
// imports


// module
exports.push([module.i, ".pg__breadcrumb {\n  margin-bottom: 0;\n  border-radius: 0;\n  background: #40a3db;\n  letter-spacing: 2px;\n}\n\n.pg__breadcrumb > .pg__active {\n  color: white;\n  cursor: default;\n}\n\n.pg__form-group {\n  position: relative;\n}\n\n/*styles for password generator content only*/\n.pg__glyphicon-refresh {\n  position: absolute;\n  font-weight: bold;\n  left: auto;\n  right: 12px;\n  cursor: pointer;\n  font-size: 25px;\n  top: 12px;\n}\n\n.pg__glyphicon-refresh:hover {\n  color: #0a1a35;\n}\n\n.pg__refresh-input {\n  padding: 0 40px 0 15px;\n  text-align: center;\n  border-radius: 0;\n}\n\n.pg__li {\n  border-right: none;\n  border-left: none;\n}\n\n.pg__p {\n  margin-top: 7px;\n}\n\n.pg__li__password {\n  border-radius: 0;\n  padding: 20px 10px;\n}\n\n.pg__copied {\n  text-align: center;\n  display: block;\n  margin-top: 15px;\n}\n\n.pg__copied-label {\n  font-size: 16px;\n}\n\n.pg__copied-icon {\n  font-size: 21px;\n  vertical-align: sub;\n}\n\n.pg__copy-button {\n  background-color: #40a3db;\n  border-radius: 0;\n  width: 90%;\n  margin: 20px auto 0;\n}\n\n/* The switch - the box around the slider */\n.pg__switch {\n  position: relative;\n  display: inline-block;\n  width: 60px;\n  height: 34px;\n  margin-bottom: 0;\n}\n\n/* Hide default HTML checkbox */\n.pg__checkbox {\n  display: none;\n}\n\n/* The slider */\n.pg__slider {\n  position: absolute;\n  cursor: pointer;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background-color: #ccc;\n  -webkit-transition: 0.4s;\n  transition: 0.4s;\n}\n\n.pg__slider:before {\n  position: absolute;\n  content: '';\n  height: 26px;\n  width: 26px;\n  left: 4px;\n  bottom: 4px;\n  background-color: white;\n  -webkit-transition: 0.4s;\n  transition: 0.4s;\n}\n\n.pg__checkbox:checked + .pg__slider {\n  background-color: #40a3db;\n}\n\n.pg__checkbox:focus + .pg__slider {\n  box-shadow: 0 0 1px #40a3db;\n}\n\n.pg__checkbox:checked + .pg__slider:before {\n  -webkit-transform: translateX(26px);\n  -ms-transform: translateX(26px);\n  transform: translateX(26px);\n}\n\n/* Rounded sliders */\n.pg__slider.round {\n  border-radius: 34px;\n}\n\n.pg__slider.round:before {\n  border-radius: 50%;\n}\n\n.pg__border-right {\n  border-right: 1px solid #ddd;\n}\n\n.pg__range {\n  -webkit-appearance: none;\n  width: 100%;\n  margin: 15px 0;\n  border: 0 solid #40a3db;\n}\n\n.pg__range:focus {\n  outline: none;\n}\n\n.pg__range::-webkit-slider-runnable-track {\n  width: 100%;\n  height: 1px;\n  cursor: pointer;\n  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.16), 0 0 1px rgba(13, 13, 13, 0.16);\n  background: #40a3db;\n  border-radius: 0;\n  border: 0 solid #40a3db;\n}\n\n.pg__range::-webkit-slider-thumb {\n  box-shadow: 1px 1px 3px #000000, 0 0 1px #0d0d0d;\n  border: 0 solid #ffffff;\n  height: 30px;\n  width: 30px;\n  border-radius: 50px;\n  background: #40a3db;\n  cursor: pointer;\n  -webkit-appearance: none;\n  margin-top: -14.7px;\n}\n\n.pg__range:focus::-webkit-slider-runnable-track {\n  background: #55addf;\n}\n\n.pg__range::-moz-range-track {\n  width: 100%;\n  height: 1px;\n  cursor: pointer;\n  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.16), 0 0 1px rgba(13, 13, 13, 0.16);\n  background: #40a3db;\n  border-radius: 0;\n  border: 0 solid #40a3db;\n}\n\n.pg__range::-moz-range-thumb {\n  box-shadow: 1px 1px 3px #000000, 0 0 1px #0d0d0d;\n  border: 0 solid #ffffff;\n  height: 30px;\n  width: 30px;\n  border-radius: 50px;\n  background: #40a3db;\n  cursor: pointer;\n}\n\n.pg__range::-ms-track {\n  width: 100%;\n  height: 1px;\n  cursor: pointer;\n  background: transparent;\n  border-color: transparent;\n  color: transparent;\n}\n\n.pg__range::-ms-fill-lower {\n  background: #2b99d7;\n  border: 0 solid #40a3db;\n  border-radius: 0;\n  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.16), 0 0 1px rgba(13, 13, 13, 0.16);\n}\n\n.pg__range::-ms-fill-upper {\n  background: #40a3db;\n  border: 0 solid #40a3db;\n  border-radius: 0;\n  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.16), 0 0 1px rgba(13, 13, 13, 0.16);\n}\n\n.pg__range::-ms-thumb {\n  box-shadow: 1px 1px 3px #000000, 0 0 1px #0d0d0d;\n  border: 0 solid #ffffff;\n  width: 30px;\n  border-radius: 50px;\n  background: #40a3db;\n  cursor: pointer;\n  height: 1px;\n}\n\n.pg__range:focus::-ms-fill-lower {\n  background: #40a3db;\n}\n\n.pg__range:focus::-ms-fill-upper {\n  background: #55addf;\n}\n", "", {"version":3,"sources":["/Users/hakanhamzacebi/saaspass_extension/src/popup/Routes/PasswordGenerator/style.css"],"names":[],"mappings":"AAAA;EACE,iBAAiB;EACjB,iBAAiB;EACjB,oBAAoB;EACpB,oBAAoB;CACrB;;AAED;EACE,aAAa;EACb,gBAAgB;CACjB;;AAED;EACE,mBAAmB;CACpB;;AAED,8CAA8C;AAC9C;EACE,mBAAmB;EACnB,kBAAkB;EAClB,WAAW;EACX,YAAY;EACZ,gBAAgB;EAChB,gBAAgB;EAChB,UAAU;CACX;;AAED;EACE,eAAe;CAChB;;AAED;EACE,uBAAuB;EACvB,mBAAmB;EACnB,iBAAiB;CAClB;;AAED;EACE,mBAAmB;EACnB,kBAAkB;CACnB;;AAED;EACE,gBAAgB;CACjB;;AAED;EACE,iBAAiB;EACjB,mBAAmB;CACpB;;AAED;EACE,mBAAmB;EACnB,eAAe;EACf,iBAAiB;CAClB;;AAED;EACE,gBAAgB;CACjB;;AAED;EACE,gBAAgB;EAChB,oBAAoB;CACrB;;AAED;EACE,0BAA0B;EAC1B,iBAAiB;EACjB,WAAW;EACX,oBAAoB;CACrB;;AAED,4CAA4C;AAC5C;EACE,mBAAmB;EACnB,sBAAsB;EACtB,YAAY;EACZ,aAAa;EACb,iBAAiB;CAClB;;AAED,gCAAgC;AAChC;EACE,cAAc;CACf;;AAED,gBAAgB;AAChB;EACE,mBAAmB;EACnB,gBAAgB;EAChB,OAAO;EACP,QAAQ;EACR,SAAS;EACT,UAAU;EACV,uBAAuB;EACvB,yBAAyB;EACzB,iBAAiB;CAClB;;AAED;EACE,mBAAmB;EACnB,YAAY;EACZ,aAAa;EACb,YAAY;EACZ,UAAU;EACV,YAAY;EACZ,wBAAwB;EACxB,yBAAyB;EACzB,iBAAiB;CAClB;;AAED;EACE,0BAA0B;CAC3B;;AAED;EACE,4BAA4B;CAC7B;;AAED;EACE,oCAAoC;EACpC,gCAAgC;EAChC,4BAA4B;CAC7B;;AAED,qBAAqB;AACrB;EACE,oBAAoB;CACrB;;AAED;EACE,mBAAmB;CACpB;;AAED;EACE,6BAA6B;CAC9B;;AAED;EACE,yBAAyB;EACzB,YAAY;EACZ,eAAe;EACf,wBAAwB;CACzB;;AAED;EACE,cAAc;CACf;;AAED;EACE,YAAY;EACZ,YAAY;EACZ,gBAAgB;EAChB,4EAA4E;EAC5E,oBAAoB;EACpB,iBAAiB;EACjB,wBAAwB;CACzB;;AAED;EACE,iDAAiD;EACjD,wBAAwB;EACxB,aAAa;EACb,YAAY;EACZ,oBAAoB;EACpB,oBAAoB;EACpB,gBAAgB;EAChB,yBAAyB;EACzB,oBAAoB;CACrB;;AAED;EACE,oBAAoB;CACrB;;AAED;EACE,YAAY;EACZ,YAAY;EACZ,gBAAgB;EAChB,4EAA4E;EAC5E,oBAAoB;EACpB,iBAAiB;EACjB,wBAAwB;CACzB;;AAED;EACE,iDAAiD;EACjD,wBAAwB;EACxB,aAAa;EACb,YAAY;EACZ,oBAAoB;EACpB,oBAAoB;EACpB,gBAAgB;CACjB;;AAED;EACE,YAAY;EACZ,YAAY;EACZ,gBAAgB;EAChB,wBAAwB;EACxB,0BAA0B;EAC1B,mBAAmB;CACpB;;AAED;EACE,oBAAoB;EACpB,wBAAwB;EACxB,iBAAiB;EACjB,4EAA4E;CAC7E;;AAED;EACE,oBAAoB;EACpB,wBAAwB;EACxB,iBAAiB;EACjB,4EAA4E;CAC7E;;AAED;EACE,iDAAiD;EACjD,wBAAwB;EACxB,YAAY;EACZ,oBAAoB;EACpB,oBAAoB;EACpB,gBAAgB;EAChB,YAAY;CACb;;AAED;EACE,oBAAoB;CACrB;;AAED;EACE,oBAAoB;CACrB","file":"style.css","sourcesContent":[".pg__breadcrumb {\n  margin-bottom: 0;\n  border-radius: 0;\n  background: #40a3db;\n  letter-spacing: 2px;\n}\n\n.pg__breadcrumb > .pg__active {\n  color: white;\n  cursor: default;\n}\n\n.pg__form-group {\n  position: relative;\n}\n\n/*styles for password generator content only*/\n.pg__glyphicon-refresh {\n  position: absolute;\n  font-weight: bold;\n  left: auto;\n  right: 12px;\n  cursor: pointer;\n  font-size: 25px;\n  top: 12px;\n}\n\n.pg__glyphicon-refresh:hover {\n  color: #0a1a35;\n}\n\n.pg__refresh-input {\n  padding: 0 40px 0 15px;\n  text-align: center;\n  border-radius: 0;\n}\n\n.pg__li {\n  border-right: none;\n  border-left: none;\n}\n\n.pg__p {\n  margin-top: 7px;\n}\n\n.pg__li__password {\n  border-radius: 0;\n  padding: 20px 10px;\n}\n\n.pg__copied {\n  text-align: center;\n  display: block;\n  margin-top: 15px;\n}\n\n.pg__copied-label {\n  font-size: 16px;\n}\n\n.pg__copied-icon {\n  font-size: 21px;\n  vertical-align: sub;\n}\n\n.pg__copy-button {\n  background-color: #40a3db;\n  border-radius: 0;\n  width: 90%;\n  margin: 20px auto 0;\n}\n\n/* The switch - the box around the slider */\n.pg__switch {\n  position: relative;\n  display: inline-block;\n  width: 60px;\n  height: 34px;\n  margin-bottom: 0;\n}\n\n/* Hide default HTML checkbox */\n.pg__checkbox {\n  display: none;\n}\n\n/* The slider */\n.pg__slider {\n  position: absolute;\n  cursor: pointer;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background-color: #ccc;\n  -webkit-transition: 0.4s;\n  transition: 0.4s;\n}\n\n.pg__slider:before {\n  position: absolute;\n  content: '';\n  height: 26px;\n  width: 26px;\n  left: 4px;\n  bottom: 4px;\n  background-color: white;\n  -webkit-transition: 0.4s;\n  transition: 0.4s;\n}\n\n.pg__checkbox:checked + .pg__slider {\n  background-color: #40a3db;\n}\n\n.pg__checkbox:focus + .pg__slider {\n  box-shadow: 0 0 1px #40a3db;\n}\n\n.pg__checkbox:checked + .pg__slider:before {\n  -webkit-transform: translateX(26px);\n  -ms-transform: translateX(26px);\n  transform: translateX(26px);\n}\n\n/* Rounded sliders */\n.pg__slider.round {\n  border-radius: 34px;\n}\n\n.pg__slider.round:before {\n  border-radius: 50%;\n}\n\n.pg__border-right {\n  border-right: 1px solid #ddd;\n}\n\n.pg__range {\n  -webkit-appearance: none;\n  width: 100%;\n  margin: 15px 0;\n  border: 0 solid #40a3db;\n}\n\n.pg__range:focus {\n  outline: none;\n}\n\n.pg__range::-webkit-slider-runnable-track {\n  width: 100%;\n  height: 1px;\n  cursor: pointer;\n  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.16), 0 0 1px rgba(13, 13, 13, 0.16);\n  background: #40a3db;\n  border-radius: 0;\n  border: 0 solid #40a3db;\n}\n\n.pg__range::-webkit-slider-thumb {\n  box-shadow: 1px 1px 3px #000000, 0 0 1px #0d0d0d;\n  border: 0 solid #ffffff;\n  height: 30px;\n  width: 30px;\n  border-radius: 50px;\n  background: #40a3db;\n  cursor: pointer;\n  -webkit-appearance: none;\n  margin-top: -14.7px;\n}\n\n.pg__range:focus::-webkit-slider-runnable-track {\n  background: #55addf;\n}\n\n.pg__range::-moz-range-track {\n  width: 100%;\n  height: 1px;\n  cursor: pointer;\n  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.16), 0 0 1px rgba(13, 13, 13, 0.16);\n  background: #40a3db;\n  border-radius: 0;\n  border: 0 solid #40a3db;\n}\n\n.pg__range::-moz-range-thumb {\n  box-shadow: 1px 1px 3px #000000, 0 0 1px #0d0d0d;\n  border: 0 solid #ffffff;\n  height: 30px;\n  width: 30px;\n  border-radius: 50px;\n  background: #40a3db;\n  cursor: pointer;\n}\n\n.pg__range::-ms-track {\n  width: 100%;\n  height: 1px;\n  cursor: pointer;\n  background: transparent;\n  border-color: transparent;\n  color: transparent;\n}\n\n.pg__range::-ms-fill-lower {\n  background: #2b99d7;\n  border: 0 solid #40a3db;\n  border-radius: 0;\n  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.16), 0 0 1px rgba(13, 13, 13, 0.16);\n}\n\n.pg__range::-ms-fill-upper {\n  background: #40a3db;\n  border: 0 solid #40a3db;\n  border-radius: 0;\n  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.16), 0 0 1px rgba(13, 13, 13, 0.16);\n}\n\n.pg__range::-ms-thumb {\n  box-shadow: 1px 1px 3px #000000, 0 0 1px #0d0d0d;\n  border: 0 solid #ffffff;\n  width: 30px;\n  border-radius: 50px;\n  background: #40a3db;\n  cursor: pointer;\n  height: 1px;\n}\n\n.pg__range:focus::-ms-fill-lower {\n  background: #40a3db;\n}\n\n.pg__range:focus::-ms-fill-upper {\n  background: #55addf;\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),

/***/ 518:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(259);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _common_sortAuthenticators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(497);
/* harmony import */ var _common_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(112);
/* harmony import */ var _LoginItems_LoginItemPage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(481);





class PasswordManager extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    };
  }

  componentDidMount() {
    this.subscription = Object(_common_store__WEBPACK_IMPORTED_MODULE_2__["observe"])('passwordmanagers').subscribe(({
      passwordmanagers
    }) => this.setState({
      items: Object(_common_sortAuthenticators__WEBPACK_IMPORTED_MODULE_1__["default"])((passwordmanagers || []).filter(i => !i.isShared))
    }));
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_LoginItems_LoginItemPage__WEBPACK_IMPORTED_MODULE_3__["default"], {
      items: this.state.items,
      title: `Password Manager (${this.state.items.length})`
    });
  }

}

/* harmony default export */ __webpack_exports__["default"] = (PasswordManager);

/***/ }),

/***/ 519:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(259);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(437);
/* harmony import */ var _Footer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(420);
/* harmony import */ var _Nav__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(423);





const RouteNotFound = props => react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Nav__WEBPACK_IMPORTED_MODULE_3__["default"], {
  back: true,
  logo: true
}), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("main", {
  className: "main"
}, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h1", null, "Route Not Found"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("pre", null, JSON.stringify(props, null, 2))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Footer__WEBPACK_IMPORTED_MODULE_2__["default"], null));

/* harmony default export */ __webpack_exports__["default"] = (Object(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["withRouter"])(RouteNotFound));

/***/ }),

/***/ 520:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(259);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _common_sortAuthenticators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(497);
/* harmony import */ var _common_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(112);
/* harmony import */ var _LoginItems_LoginItemPage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(481);





class SharedAccounts extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    };
  }

  componentDidMount() {
    this.subscription = Object(_common_store__WEBPACK_IMPORTED_MODULE_2__["observe"])('authenticators', 'passwordmanagers').subscribe(({
      authenticators,
      passwordmanagers
    }) => this.setState({
      items: !(authenticators && passwordmanagers) ? [] : Object(_common_sortAuthenticators__WEBPACK_IMPORTED_MODULE_1__["default"])([...authenticators, ...passwordmanagers].filter(i => i.isShared))
    }));
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_LoginItems_LoginItemPage__WEBPACK_IMPORTED_MODULE_3__["default"], {
      items: this.state.items,
      title: `Shared Accounts (${this.state.items.length})`
    });
  }

}

/* harmony default export */ __webpack_exports__["default"] = (SharedAccounts);

/***/ }),

/***/ 521:
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(522);

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

/***/ 522:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(400)(true);
// imports


// module
exports.push([module.i, ".main {\n  position: relative;\n  height: 515px;\n  width: 430px;\n}\n", "", {"version":3,"sources":["/Users/hakanhamzacebi/saaspass_extension/src/popup/Routes/style.css"],"names":[],"mappings":"AAAA;EACE,mBAAmB;EACnB,cAAc;EACd,aAAa;CACd","file":"style.css","sourcesContent":[".main {\n  position: relative;\n  height: 515px;\n  width: 430px;\n}\n"],"sourceRoot":""}]);

// exports


/***/ })

}]);
//# sourceMappingURL=6.js.map