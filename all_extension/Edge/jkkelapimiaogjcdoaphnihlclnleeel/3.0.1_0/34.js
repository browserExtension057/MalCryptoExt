(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[34],{

/***/ 397:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(browser) {/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(259);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _App_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(398);
/* harmony import */ var _App_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_App_css__WEBPACK_IMPORTED_MODULE_1__);



class App extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.state = {
      autoFillOnLoad: false
    };
  }

  async componentDidMount() {
    this.setState((await browser.storage.local.get('autoFillOnLoad')));
  }

  handleChange(event) {
    const autoFillOnLoad = event.target.checked;
    this.setState({
      autoFillOnLoad
    });
    browser.storage.local.set({
      autoFillOnLoad
    });
  }

  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, "Automatically fill login information:"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("label", {
      className: "switch"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", {
      checked: this.state.autoFillOnLoad,
      onChange: e => this.handleChange(e),
      type: "checkbox"
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "slider round"
    })));
  }

}

/* harmony default export */ __webpack_exports__["default"] = (App);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(2)))

/***/ }),

/***/ 398:
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(399);

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

/***/ 399:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(400)(true);
// imports


// module
exports.push([module.i, "body {\n  padding: 10px;\n}\n\n.switch {\n  position: relative;\n  display: inline-block;\n  width: 60px;\n  height: 34px;\n  margin-bottom: 0;\n}\n\n.switch input {\n  display: none;\n}\n\n.slider {\n  position: absolute;\n  cursor: pointer;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background-color: #ccc;\n  -webkit-transition: 0.4s;\n  transition: 0.4s;\n}\n\n.slider:before {\n  position: absolute;\n  content: '';\n  height: 26px;\n  width: 26px;\n  left: 4px;\n  bottom: 4px;\n  background-color: white;\n  -webkit-transition: 0.4s;\n  transition: 0.4s;\n}\n\ninput:checked + .slider {\n  background-color: #40a3db;\n}\n\ninput:focus + .slider {\n  box-shadow: 0 0 1px #40a3db;\n}\n\ninput:checked + .slider:before {\n  -webkit-transform: translateX(26px);\n  -ms-transform: translateX(26px);\n  transform: translateX(26px);\n}\n\n.slider.round {\n  border-radius: 34px;\n}\n\n.slider.round:before {\n  border-radius: 50%;\n}\n\n.border-right {\n  border-right: 1px solid #ddd;\n}\n", "", {"version":3,"sources":["/Users/hakanhamzacebi/saaspass_extension/src/options/App.css"],"names":[],"mappings":"AAAA;EACE,cAAc;CACf;;AAED;EACE,mBAAmB;EACnB,sBAAsB;EACtB,YAAY;EACZ,aAAa;EACb,iBAAiB;CAClB;;AAED;EACE,cAAc;CACf;;AAED;EACE,mBAAmB;EACnB,gBAAgB;EAChB,OAAO;EACP,QAAQ;EACR,SAAS;EACT,UAAU;EACV,uBAAuB;EACvB,yBAAyB;EACzB,iBAAiB;CAClB;;AAED;EACE,mBAAmB;EACnB,YAAY;EACZ,aAAa;EACb,YAAY;EACZ,UAAU;EACV,YAAY;EACZ,wBAAwB;EACxB,yBAAyB;EACzB,iBAAiB;CAClB;;AAED;EACE,0BAA0B;CAC3B;;AAED;EACE,4BAA4B;CAC7B;;AAED;EACE,oCAAoC;EACpC,gCAAgC;EAChC,4BAA4B;CAC7B;;AAED;EACE,oBAAoB;CACrB;;AAED;EACE,mBAAmB;CACpB;;AAED;EACE,6BAA6B;CAC9B","file":"App.css","sourcesContent":["body {\n  padding: 10px;\n}\n\n.switch {\n  position: relative;\n  display: inline-block;\n  width: 60px;\n  height: 34px;\n  margin-bottom: 0;\n}\n\n.switch input {\n  display: none;\n}\n\n.slider {\n  position: absolute;\n  cursor: pointer;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background-color: #ccc;\n  -webkit-transition: 0.4s;\n  transition: 0.4s;\n}\n\n.slider:before {\n  position: absolute;\n  content: '';\n  height: 26px;\n  width: 26px;\n  left: 4px;\n  bottom: 4px;\n  background-color: white;\n  -webkit-transition: 0.4s;\n  transition: 0.4s;\n}\n\ninput:checked + .slider {\n  background-color: #40a3db;\n}\n\ninput:focus + .slider {\n  box-shadow: 0 0 1px #40a3db;\n}\n\ninput:checked + .slider:before {\n  -webkit-transform: translateX(26px);\n  -ms-transform: translateX(26px);\n  transform: translateX(26px);\n}\n\n.slider.round {\n  border-radius: 34px;\n}\n\n.slider.round:before {\n  border-radius: 50%;\n}\n\n.border-right {\n  border-right: 1px solid #ddd;\n}\n"],"sourceRoot":""}]);

// exports


/***/ })

}]);
//# sourceMappingURL=34.js.map