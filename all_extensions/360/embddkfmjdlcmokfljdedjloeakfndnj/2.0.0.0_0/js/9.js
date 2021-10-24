// [AIV_SHORT]  Build version: 0.14.0 - Tuesday, June 25th, 2019, 2:12:23 PM  
 webpackJsonp([9],{

/***/ 150:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = __webpack_require__(34);
var gOPS = __webpack_require__(82);
var pIE = __webpack_require__(60);
var toObject = __webpack_require__(47);
var IObject = __webpack_require__(58);
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(20)(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;


/***/ }),

/***/ 175:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(176);
module.exports = __webpack_require__(6).Object.assign;


/***/ }),

/***/ 176:
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(13);

$export($export.S + $export.F, 'Object', { assign: __webpack_require__(150) });


/***/ }),

/***/ 526:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_homeMenu_vue__ = __webpack_require__(571);
/* empty harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_9a178732_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_homeMenu_vue__ = __webpack_require__(607);
function injectStyle (ssrContext) {
  __webpack_require__(605)
}
var normalizeComponent = __webpack_require__(114)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-9a178732"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_homeMenu_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_9a178732_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_homeMenu_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 552:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BTM; });
var BTM = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

/***/ }),

/***/ 571:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_assign__ = __webpack_require__(90);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_assign___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_assign__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_constants__ = __webpack_require__(552);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
    name: "",
    data: function data() {
        return {
            accounts: [],
            selectedAccount: {}
        };
    },

    methods: {
        accountSelected: function accountSelected(accountInfo) {
            this.selectedAccount = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_assign___default()({}, accountInfo);
            this.$router.push({ name: 'home', params: { selectedAccount: this.selectedAccount } });
        },
        calculateBalance: function calculateBalance(balances) {
            if (balances.length > 0) {
                var balanceObject = balances.filter(function (b) {
                    return b.asset === __WEBPACK_IMPORTED_MODULE_1__utils_constants__["a" /* BTM */];
                })[0];
                var balance = balanceObject.balance / Math.pow(10, balanceObject.decimals);
                return balance;
            }
            return 0.00;
        }
    }, mounted: function mounted() {
        var params = this.$route.params;

        this.accounts = params.accounts;
        this.selectedAccount = params.selected;
    }
});

/***/ }),

/***/ 605:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(606);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(56)("01df9412", content, true, {});

/***/ }),

/***/ 606:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(55)(false);
// imports


// module
exports.push([module.i, ".accounts[data-v-9a178732]{width:100%;height:250px;overflow-x:hidden;overflow-y:scroll;margin-bottom:25px}.accounts .list-item[data-v-9a178732]{background:#3c3c3c;padding:10px;border-radius:4px;margin-bottom:16px}.accounts .list-item[data-v-9a178732]:active,.accounts .list-item[data-v-9a178732]:focus,.accounts .list-item[data-v-9a178732]:hover{background:#035bd4}.accounts[data-v-9a178732]::-webkit-scrollbar{display:none}.accounts i[data-v-9a178732]{margin-left:2px}.menu-panel[data-v-9a178732]{height:560px;width:260px;padding:20px}.menu-list[data-v-9a178732]{margin:0 -20px}.menu-list .list-item[data-v-9a178732]{color:#fff;padding:10px 20px}.menu-list .list-item[data-v-9a178732]:active,.menu-list .list-item[data-v-9a178732]:focus,.menu-list .list-item[data-v-9a178732]:hover{background:#3c3c3c}.account[data-v-9a178732]{width:200px;display:inline-block;vertical-align:middle}.account-alias[data-v-9a178732]{width:200px;font-size:18px;color:#fff;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.account-asset[data-v-9a178732]{font-size:12px;color:#9e9e9e}.wallet[data-v-9a178732]{width:25px;height:25px;background:hsla(0,0%,100%,.1);border-radius:50%;color:#fff;padding:8px;margin-right:15px}.list-item[data-v-9a178732]{display:flex}", ""]);

// exports


/***/ }),

/***/ 607:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"bg-sideBar menu-panel warp-chlid"},[_c('div',[_c('i',{staticClass:"iconfont btn-close",on:{"click":function($event){_vm.$router.go(-1)}}},[_vm._v("")]),_vm._v(" "),_c('div',{staticClass:"menu-title"},[_vm._v(_vm._s(_vm.$t('menu.title')))])]),_vm._v(" "),_c('div',{staticClass:"menu-content"},[_c('div',{staticClass:"list accounts"},_vm._l((_vm.accounts),function(account,index){return _c('div',{key:index,on:{"click":function($event){_vm.accountSelected(account)}}},[_c('div',{class:(_vm.selectedAccount != undefined && account.address == _vm.selectedAccount.address) ? 'list-item active': 'list-item'},[_vm._m(0,true),_vm._v(" "),_c('div',{staticClass:"account"},[_c('div',{staticClass:"account-alias"},[_vm._v(_vm._s(account.alias))]),_vm._v(" "),_c('div',{staticClass:"account-asset"},[_vm._v(_vm._s(_vm.calculateBalance(account.balances))+" BTM")])])])])})),_vm._v(" "),_c('div',[_c('div',{staticClass:"menu-title"},[_vm._v(_vm._s(_vm.$t('menu.setting')))])]),_vm._v(" "),_c('div',{staticClass:"list menu-list"},[_c('router-link',{attrs:{"to":{name: 'menu-account-creation'}}},[_c('div',{staticClass:"list-item"},[_c('i',{staticClass:"iconfont icon-create"}),_vm._v(_vm._s(_vm.$t('menu.createAccount'))+"\n                ")])]),_vm._v(" "),_c('router-link',{attrs:{"to":{name: 'menu-backup'}}},[_c('div',{staticClass:"list-item"},[_c('i',{staticClass:"iconfont icon-backup"}),_vm._v(_vm._s(_vm.$t('menu.backup'))+"\n                ")])]),_vm._v(" "),_c('router-link',{attrs:{"to":{name: 'menu-help'}}},[_c('div',{staticClass:"list-item"},[_c('i',{staticClass:"iconfont icon-support"}),_vm._v(_vm._s(_vm.$t('menu.help'))+"\n                ")])]),_vm._v(" "),_c('router-link',{attrs:{"to":{name: 'menu-settings'}}},[_c('div',{staticClass:"list-item"},[_c('i',{staticClass:"iconfont icon-setting"}),_vm._v(_vm._s(_vm.$t('menu.setting'))+"\n                ")])])],1)]),_vm._v(" "),_c('router-view')],1)}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"wallet"},[_c('i',{staticClass:"iconfont icon-wallet"})])}]
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),

/***/ 90:
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(175), __esModule: true };

/***/ })

});
//# sourceMappingURL=9.js.map 