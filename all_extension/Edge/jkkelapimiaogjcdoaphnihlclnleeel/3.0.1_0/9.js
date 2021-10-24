(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[9],{

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

/***/ 237:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const uniq = items => [...new Set(items)]; // 'www.sub.domain.com' ->
// ['www.sub.domain.com', 'sub.domain.com', 'domain.com', 'domain']
// fixme:
//   'www.sub.domain.co.uk' ->
//   ['www.sub.domain.co.uk', 'sub.domain.co.uk', 'domain.co.uk', 'co.uk', 'co']
//   https://palant.de/2018/11/30


const extractPossibleServiceNamesFromHost = host => host.split('.').reduce((r, v, i, a) => [...r, a.slice(i)], []).map(parts => parts.join('.')).slice(0, -1) // exclude 'com'
.concat(host.split('.').slice(-2)[0]) // include 'domain'
.map(name => name.toLowerCase());

const hostAccountSimilarity = host => account => {
  const hostServiceNames = extractPossibleServiceNamesFromHost(host);
  const {
    serviceUrl,
    serviceName
  } = account.publicService;
  const [, emailHost] = account.username.split('@');
  const itemServiceNames = [serviceUrl, serviceName, emailHost].filter(Boolean).map(extractPossibleServiceNamesFromHost).reduce((a, b) => [...a, ...b], []);
  const names = [...hostServiceNames, ...uniq(itemServiceNames)];
  return names.length - uniq(names).length;
};

/* harmony default export */ __webpack_exports__["default"] = (hostAccountSimilarity);

/***/ }),

/***/ 257:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "src/images/orca-18.png";

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

/***/ 497:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _sortBy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(230);

const sortAuthenticators = Object(_sortBy__WEBPACK_IMPORTED_MODULE_0__["default"])(i => !i.ssoEnabled, i => i.publicService.serviceName.toLowerCase(), i => i.username.toLowerCase());
/* harmony default export */ __webpack_exports__["default"] = (sortAuthenticators);

/***/ }),

/***/ 526:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(259);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _common_hostAccountSimilarity__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(237);
/* harmony import */ var _common_normalizeItem__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(488);
/* harmony import */ var _common_onLogoError__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(494);
/* harmony import */ var _common_sortAuthenticators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(497);
/* harmony import */ var _common_sortBy__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(230);
/* harmony import */ var _common_store__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(112);
/* harmony import */ var _images_orca_18_png__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(257);
/* harmony import */ var _images_orca_18_png__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_images_orca_18_png__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _App_css__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(527);
/* harmony import */ var _App_css__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_App_css__WEBPACK_IMPORTED_MODULE_8__);









const hostSimilarity = Object(_common_hostAccountSimilarity__WEBPACK_IMPORTED_MODULE_1__["default"])(new URL(location.href).searchParams.get('host'));

const handleCloseClick = event => {
  event.preventDefault();
  window.parent.postMessage({
    action: 'close'
  }, '*');
};

const login = ({
  id,
  isShared
}) => window.parent.postMessage({
  action: 'login',
  id,
  isShared
}, '*');

class App extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  constructor(props) {
    super(props);
    this.state = {
      items: null,
      showAll: false
    };
  }

  componentDidMount() {
    this.subscription = Object(_common_store__WEBPACK_IMPORTED_MODULE_6__["observe"])('authenticators', 'passwordmanagers').subscribe(({
      authenticators,
      passwordmanagers
    }) => this.setState({
      items: authenticators && passwordmanagers && Object(_common_sortAuthenticators__WEBPACK_IMPORTED_MODULE_4__["default"])([...authenticators, ...passwordmanagers]).filter(i => i.ssoEnabled).map(_common_normalizeItem__WEBPACK_IMPORTED_MODULE_2__["default"])
    }));
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  getFilteredItems() {
    if (!this.state.items) return [];
    const items = Object(_common_sortBy__WEBPACK_IMPORTED_MODULE_5__["default"])(hostSimilarity)(this.state.items).reverse();
    return this.state.showAll ? items : items.filter(hostSimilarity);
  }

  render() {
    const filteredItems = this.getFilteredItems();
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "header"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
      src: _images_orca_18_png__WEBPACK_IMPORTED_MODULE_7___default.a
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "link"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
      href: "",
      className: "active"
    }, this.state.showAll ? 'Login with another account' : 'Login as')), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
      href: "",
      className: "close",
      onClick: handleCloseClick
    })), this.state.items ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, filteredItems.length ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("table", {
      className: "table"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tbody", {
      className: "tbody"
    }, filteredItems.map(i => react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
      key: i.id,
      className: "table__row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
      className: "table__cell"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
      src: i.logo,
      onError: _common_onLogoError__WEBPACK_IMPORTED_MODULE_3__["default"],
      className: "table__img"
    })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
      className: "table__cell"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
      className: "table__p"
    }, i.displayName), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("strong", {
      className: "table__strong"
    }, i.username)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
      className: "table__cell"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
      onClick: () => login(i),
      className: "table__button"
    }, "LOGIN")))), this.state.showAll ? null : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
      className: "table__row"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
      className: "table__cell"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
      onClick: () => this.setState({
        showAll: true
      }),
      className: "table__button"
    }, "More"))))) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "info"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
      className: "info__p"
    }, "You have not added this website yet to SAASPASS."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
      className: "info__p"
    }, "You can add this after you login."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
      className: "info__p"
    }, "Or you can use some of your", ' ', react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
      onClick: () => this.setState({
        showAll: true
      })
    }, "Other"), ' ', "accounts"))) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "info"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
      className: "info__p"
    }, "You are not logged in."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
      className: "info__p"
    }, "Please log in and try again.")));
  }

}

/* harmony default export */ __webpack_exports__["default"] = (App);

/***/ }),

/***/ 527:
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(528);

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

/***/ 528:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(400)(true);
// imports


// module
exports.push([module.i, "html {\n  width: 340px;\n  height: 160px;\n}\n\nbody {\n  overflow: hidden;\n  background: rgba(245, 245, 245, 0.9);\n  font-family: Open Sans, sans-serif;\n}\n\na:link {\n  text-decoration: none;\n  color: #333;\n  opacity: 0.3;\n  text-align: center;\n}\n\na:visited {\n  text-decoration: none;\n}\n\na:hover {\n  text-decoration: none;\n  opacity: 1;\n}\n\na:active {\n  text-decoration: none;\n}\n\n.header .separator {\n  width: 1px;\n  height: 10px;\n  border-right: 1px solid black;\n  margin: 5px 10px;\n}\n\n.header .link {\n  display: flex;\n  margin: -25px auto 0;\n  font-size: 14px;\n}\n\n.header .link .active {\n  opacity: 1;\n  cursor: default;\n  width: 100%;\n}\n\n.close {\n  position: absolute;\n  right: 11px;\n  top: 9px;\n  width: 18px;\n  height: 18px;\n  opacity: 0.3;\n}\n\n.close:hover {\n  opacity: 1;\n}\n\n.close:before,\n.close:after {\n  position: absolute;\n  left: 8px;\n  content: ' ';\n  height: 18px;\n  width: 2px;\n  background-color: #333;\n}\n\n.close:before {\n  transform: rotate(45deg);\n}\n\n.close:after {\n  transform: rotate(-45deg);\n}\n\nbutton {\n  color: #fff;\n  background-color: #40a3db;\n  text-shadow: -1px 1px #417cb8;\n  border: none;\n  padding: 8px 12px;\n  cursor: pointer;\n}\n\nbutton:hover {\n  background-color: #346392;\n  text-shadow: -1px 1px #27496d;\n}\n\n.info {\n  font-size: 13px;\n  margin-top: 40px;\n  text-align: center;\n}\n\n.info__p {\n  margin: 2px;\n}\n\n.table {\n  margin: 2px 0;\n  border-collapse: separate;\n  border-spacing: 0 5px;\n  width: 100%;\n}\n\n.table__button {\n  color: #fff;\n  background-color: #40a3db;\n  text-shadow: -1px 1px #417cb8;\n  border: none;\n  padding: 8px 15px;\n  cursor: pointer;\n}\n\n.table__button:hover {\n  background-color: #346392;\n  text-shadow: -1px 1px #27496d;\n}\n\n.table__cell {\n  padding: 2px 4px;\n  border-bottom: 2px solid #efefef;\n  border-top: 2px solid #efefef;\n}\n\n.table__cell:first-child,\n.table__cell:last-child {\n  text-align: center;\n}\n\n.table__cell:nth-child(2) {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n  width: 185px;\n}\n\n.table__img {\n  vertical-align: middle;\n}\n\n.table__p {\n  margin: 0;\n  font-size: 14px;\n  cursor: default;\n}\n\n.table__p,\n.table__strong {\n  width: 185px;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n}\n\n.table__row {\n  background: rgba(255, 255, 255, 0.7);\n}\n\n.table__row:hover {\n  background: #fbfbfb;\n}\n\n.table__strong {\n  margin: 0;\n  font-size: 13px;\n  cursor: default;\n  display: block;\n}\n\n.tbody {\n  height: 10em;\n  overflow-y: auto;\n  display: block;\n  position: fixed;\n}\n\n.tbody::-webkit-scrollbar {\n  width: 12px;\n}\n\n.tbody::-webkit-scrollbar-thumb {\n  background: #40a3db;\n}\n", "", {"version":3,"sources":["/Users/hakanhamzacebi/saaspass_extension/src/selectAccountFrame/App.css"],"names":[],"mappings":"AAAA;EACE,aAAa;EACb,cAAc;CACf;;AAED;EACE,iBAAiB;EACjB,qCAAqC;EACrC,mCAAmC;CACpC;;AAED;EACE,sBAAsB;EACtB,YAAY;EACZ,aAAa;EACb,mBAAmB;CACpB;;AAED;EACE,sBAAsB;CACvB;;AAED;EACE,sBAAsB;EACtB,WAAW;CACZ;;AAED;EACE,sBAAsB;CACvB;;AAED;EACE,WAAW;EACX,aAAa;EACb,8BAA8B;EAC9B,iBAAiB;CAClB;;AAED;EACE,cAAc;EACd,qBAAqB;EACrB,gBAAgB;CACjB;;AAED;EACE,WAAW;EACX,gBAAgB;EAChB,YAAY;CACb;;AAED;EACE,mBAAmB;EACnB,YAAY;EACZ,SAAS;EACT,YAAY;EACZ,aAAa;EACb,aAAa;CACd;;AAED;EACE,WAAW;CACZ;;AAED;;EAEE,mBAAmB;EACnB,UAAU;EACV,aAAa;EACb,aAAa;EACb,WAAW;EACX,uBAAuB;CACxB;;AAED;EACE,yBAAyB;CAC1B;;AAED;EACE,0BAA0B;CAC3B;;AAED;EACE,YAAY;EACZ,0BAA0B;EAC1B,8BAA8B;EAC9B,aAAa;EACb,kBAAkB;EAClB,gBAAgB;CACjB;;AAED;EACE,0BAA0B;EAC1B,8BAA8B;CAC/B;;AAED;EACE,gBAAgB;EAChB,iBAAiB;EACjB,mBAAmB;CACpB;;AAED;EACE,YAAY;CACb;;AAED;EACE,cAAc;EACd,0BAA0B;EAC1B,sBAAsB;EACtB,YAAY;CACb;;AAED;EACE,YAAY;EACZ,0BAA0B;EAC1B,8BAA8B;EAC9B,aAAa;EACb,kBAAkB;EAClB,gBAAgB;CACjB;;AAED;EACE,0BAA0B;EAC1B,8BAA8B;CAC/B;;AAED;EACE,iBAAiB;EACjB,iCAAiC;EACjC,8BAA8B;CAC/B;;AAED;;EAEE,mBAAmB;CACpB;;AAED;EACE,wBAAwB;EACxB,oBAAoB;EACpB,iBAAiB;EACjB,aAAa;CACd;;AAED;EACE,uBAAuB;CACxB;;AAED;EACE,UAAU;EACV,gBAAgB;EAChB,gBAAgB;CACjB;;AAED;;EAEE,aAAa;EACb,wBAAwB;EACxB,oBAAoB;EACpB,iBAAiB;CAClB;;AAED;EACE,qCAAqC;CACtC;;AAED;EACE,oBAAoB;CACrB;;AAED;EACE,UAAU;EACV,gBAAgB;EAChB,gBAAgB;EAChB,eAAe;CAChB;;AAED;EACE,aAAa;EACb,iBAAiB;EACjB,eAAe;EACf,gBAAgB;CACjB;;AAED;EACE,YAAY;CACb;;AAED;EACE,oBAAoB;CACrB","file":"App.css","sourcesContent":["html {\n  width: 340px;\n  height: 160px;\n}\n\nbody {\n  overflow: hidden;\n  background: rgba(245, 245, 245, 0.9);\n  font-family: Open Sans, sans-serif;\n}\n\na:link {\n  text-decoration: none;\n  color: #333;\n  opacity: 0.3;\n  text-align: center;\n}\n\na:visited {\n  text-decoration: none;\n}\n\na:hover {\n  text-decoration: none;\n  opacity: 1;\n}\n\na:active {\n  text-decoration: none;\n}\n\n.header .separator {\n  width: 1px;\n  height: 10px;\n  border-right: 1px solid black;\n  margin: 5px 10px;\n}\n\n.header .link {\n  display: flex;\n  margin: -25px auto 0;\n  font-size: 14px;\n}\n\n.header .link .active {\n  opacity: 1;\n  cursor: default;\n  width: 100%;\n}\n\n.close {\n  position: absolute;\n  right: 11px;\n  top: 9px;\n  width: 18px;\n  height: 18px;\n  opacity: 0.3;\n}\n\n.close:hover {\n  opacity: 1;\n}\n\n.close:before,\n.close:after {\n  position: absolute;\n  left: 8px;\n  content: ' ';\n  height: 18px;\n  width: 2px;\n  background-color: #333;\n}\n\n.close:before {\n  transform: rotate(45deg);\n}\n\n.close:after {\n  transform: rotate(-45deg);\n}\n\nbutton {\n  color: #fff;\n  background-color: #40a3db;\n  text-shadow: -1px 1px #417cb8;\n  border: none;\n  padding: 8px 12px;\n  cursor: pointer;\n}\n\nbutton:hover {\n  background-color: #346392;\n  text-shadow: -1px 1px #27496d;\n}\n\n.info {\n  font-size: 13px;\n  margin-top: 40px;\n  text-align: center;\n}\n\n.info__p {\n  margin: 2px;\n}\n\n.table {\n  margin: 2px 0;\n  border-collapse: separate;\n  border-spacing: 0 5px;\n  width: 100%;\n}\n\n.table__button {\n  color: #fff;\n  background-color: #40a3db;\n  text-shadow: -1px 1px #417cb8;\n  border: none;\n  padding: 8px 15px;\n  cursor: pointer;\n}\n\n.table__button:hover {\n  background-color: #346392;\n  text-shadow: -1px 1px #27496d;\n}\n\n.table__cell {\n  padding: 2px 4px;\n  border-bottom: 2px solid #efefef;\n  border-top: 2px solid #efefef;\n}\n\n.table__cell:first-child,\n.table__cell:last-child {\n  text-align: center;\n}\n\n.table__cell:nth-child(2) {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n  width: 185px;\n}\n\n.table__img {\n  vertical-align: middle;\n}\n\n.table__p {\n  margin: 0;\n  font-size: 14px;\n  cursor: default;\n}\n\n.table__p,\n.table__strong {\n  width: 185px;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n}\n\n.table__row {\n  background: rgba(255, 255, 255, 0.7);\n}\n\n.table__row:hover {\n  background: #fbfbfb;\n}\n\n.table__strong {\n  margin: 0;\n  font-size: 13px;\n  cursor: default;\n  display: block;\n}\n\n.tbody {\n  height: 10em;\n  overflow-y: auto;\n  display: block;\n  position: fixed;\n}\n\n.tbody::-webkit-scrollbar {\n  width: 12px;\n}\n\n.tbody::-webkit-scrollbar-thumb {\n  background: #40a3db;\n}\n"],"sourceRoot":""}]);

// exports


/***/ })

}]);
//# sourceMappingURL=9.js.map