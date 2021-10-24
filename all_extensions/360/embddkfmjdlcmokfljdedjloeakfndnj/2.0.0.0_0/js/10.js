// [AIV_SHORT]  Build version: 0.14.0 - Tuesday, June 25th, 2019, 2:12:23 PM  
 webpackJsonp([10],{

/***/ 525:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_transferDetail_vue__ = __webpack_require__(570);
/* empty harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7f3580f0_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_transferDetail_vue__ = __webpack_require__(604);
function injectStyle (ssrContext) {
  __webpack_require__(599)
}
var normalizeComponent = __webpack_require__(114)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-7f3580f0"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_transferDetail_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7f3580f0_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_transferDetail_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 570:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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
            selfAddress: "",
            transaction: {
                guid: "",
                to: "",
                amount: 0,
                fee: ""
            }
        };
    },

    methods: {},
    computed: {
        classObject: function classObject() {
            return {
                'success-header': !this.transaction.status_fail && this.transaction.hasOwnProperty('block_timestamp'),
                'pending-header': !this.transaction.status_fail && !this.transaction.hasOwnProperty('block_timestamp'),
                'fail-header': this.transaction.status_fail
            };
        }
    },
    mounted: function mounted() {
        var params = this.$route.params;

        this.transaction = params.transaction;
        this.selfAddress = params.address;
        console.log(params.transaction);
    }
});

/***/ }),

/***/ 599:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(600);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(56)("a852eea4", content, true, {});

/***/ }),

/***/ 600:
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(263);
exports = module.exports = __webpack_require__(55)(false);
// imports


// module
exports.push([module.i, ".header[data-v-7f3580f0]{display:flex}.header p[data-v-7f3580f0]{text-align:center;width:280px;padding-top:17px}.preview i[data-v-7f3580f0]{width:100px;margin:0 auto;display:block;width:45px;font-size:45px;margin-bottom:25px}.preview .value[data-v-7f3580f0]{font-size:30px;width:300px;margin:0 auto;text-align:center}.preview .value span[data-v-7f3580f0]{font-size:18px}.title[data-v-7f3580f0]{font-size:18px;font-weight:inherit;color:#cacaca;text-align:center;padding:5px 0}.transaction[data-v-7f3580f0]{padding:0 20px;font-size:14px;word-break:break-all;height:380px;width:275px;margin-top:20px}.transaction .label[data-v-7f3580f0]{width:35%;vertical-align:top;word-break:break-word}.transaction .value[data-v-7f3580f0]{width:65%;color:#282828;font-weight:500;word-break:break-word}.panel[data-v-7f3580f0]{padding:0}.tx-header[data-v-7f3580f0]{height:40px;width:280px;text-align:center;padding:20px}.tx-header .value[data-v-7f3580f0]{color:#fff;font-size:18px;font-weight:500}.success-header[data-v-7f3580f0]{background-image:url(" + escape(__webpack_require__(601)) + ");background-size:320px 80px}.pending-header[data-v-7f3580f0]{background-image:url(" + escape(__webpack_require__(602)) + ");background-size:320px 80px}.fail-header[data-v-7f3580f0]{background-image:url(" + escape(__webpack_require__(603)) + ");background-size:320px 80px}.header-text[data-v-7f3580f0]{color:hsla(0,0%,100%,.5)}.asset[data-v-7f3580f0]{margin-left:3px}.divider[data-v-7f3580f0]{margin:10px 0}.footer[data-v-7f3580f0]{text-align:center;position:absolute;bottom:10px;width:100%;font-size:12px}", ""]);

// exports


/***/ }),

/***/ 601:
/***/ (function(module, exports) {

module.exports = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzIwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMzIwIDgwIj4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLmNscy0xIHsKICAgICAgICBmaWxsOiB1cmwoI2xpbmVhci1ncmFkaWVudCk7CiAgICAgIH0KCiAgICAgIC5jbHMtMiB7CiAgICAgICAgZmlsbDogIzAzNWJkNDsKICAgICAgfQoKICAgICAgLmNscy0zIHsKICAgICAgICBvcGFjaXR5OiAwLjM3MjsKICAgICAgICBjbGlwLXBhdGg6IHVybCgjY2xpcC1wYXRoKTsKICAgICAgfQoKICAgICAgLmNscy00IHsKICAgICAgICBmaWxsOiAjNDI3ZmQzOwogICAgICB9CiAgICA8L3N0eWxlPgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJsaW5lYXItZ3JhZGllbnQiIHkxPSIxIiB4Mj0iMSIgZ3JhZGllbnRVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMwMzViZDQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjM2NmZmRhIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGNsaXBQYXRoIGlkPSJjbGlwLXBhdGgiPgogICAgICA8cGF0aCBpZD0iUmVjdGFuZ2xlXzUzMDciIGRhdGEtbmFtZT0iUmVjdGFuZ2xlIDUzMDciIGNsYXNzPSJjbHMtMSIgZD0iTTQsMEgzMTZhNCw0LDAsMCwxLDQsNFY4MGEwLDAsMCwwLDEsMCwwSDBhMCwwLDAsMCwxLDAsMFY0QTQsNCwwLDAsMSw0LDBaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMCAyMCkiLz4KICAgIDwvY2xpcFBhdGg+CiAgPC9kZWZzPgogIDxnIGlkPSJiYWNrZ3JvdW5kLWhlYWQtc3VjY2VlZCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTIwIC0yMCkiPgogICAgPHBhdGggaWQ9IlJlY3RhbmdsZV81MzA4IiBkYXRhLW5hbWU9IlJlY3RhbmdsZSA1MzA4IiBjbGFzcz0iY2xzLTIiIGQ9Ik00LDBIMzE2YTQsNCwwLDAsMSw0LDRWODBhMCwwLDAsMCwxLDAsMEgwYTAsMCwwLDAsMSwwLDBWNEE0LDQsMCwwLDEsNCwwWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjAgMjApIi8+CiAgICA8ZyBpZD0iTWFza19Hcm91cF8xMDciIGRhdGEtbmFtZT0iTWFzayBHcm91cCAxMDciIGNsYXNzPSJjbHMtMyI+CiAgICAgIDxlbGxpcHNlIGlkPSJFbGxpcHNlXzEzMCIgZGF0YS1uYW1lPSJFbGxpcHNlIDEzMCIgY2xhc3M9ImNscy00IiBjeD0iMjA0LjUiIGN5PSIxNTEuNDgxIiByeD0iMjA0LjUiIHJ5PSIxNTEuNDgxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtODQgLTE2OC40NjYpIi8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K"

/***/ }),

/***/ 602:
/***/ (function(module, exports) {

module.exports = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzIwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMzIwIDgwIj4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLmNscy0xIHsKICAgICAgICBmaWxsOiB1cmwoI2xpbmVhci1ncmFkaWVudCk7CiAgICAgIH0KCiAgICAgIC5jbHMtMiB7CiAgICAgICAgZmlsbDogI2Y0OGQwMDsKICAgICAgfQoKICAgICAgLmNscy0zIHsKICAgICAgICBvcGFjaXR5OiAwLjM3MjsKICAgICAgICBjbGlwLXBhdGg6IHVybCgjY2xpcC1wYXRoKTsKICAgICAgfQoKICAgICAgLmNscy00IHsKICAgICAgICBmaWxsOiAjZjVhYTQyOwogICAgICB9CiAgICA8L3N0eWxlPgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJsaW5lYXItZ3JhZGllbnQiIHkxPSIxIiB4Mj0iMSIgZ3JhZGllbnRVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMwMzViZDQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjM2NmZmRhIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGNsaXBQYXRoIGlkPSJjbGlwLXBhdGgiPgogICAgICA8cGF0aCBpZD0iUmVjdGFuZ2xlXzUzMDciIGRhdGEtbmFtZT0iUmVjdGFuZ2xlIDUzMDciIGNsYXNzPSJjbHMtMSIgZD0iTTQsMEgzMTZhNCw0LDAsMCwxLDQsNFY4MGEwLDAsMCwwLDEsMCwwSDBhMCwwLDAsMCwxLDAsMFY0QTQsNCwwLDAsMSw0LDBaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMCAyMCkiLz4KICAgIDwvY2xpcFBhdGg+CiAgPC9kZWZzPgogIDxnIGlkPSJiYWNrZ3JvdW5kLWhlYWQtcGVuZGluZyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTIwIC0yMCkiPgogICAgPHBhdGggaWQ9IlJlY3RhbmdsZV81MzA4IiBkYXRhLW5hbWU9IlJlY3RhbmdsZSA1MzA4IiBjbGFzcz0iY2xzLTIiIGQ9Ik00LDBIMzE2YTQsNCwwLDAsMSw0LDRWODBhMCwwLDAsMCwxLDAsMEgwYTAsMCwwLDAsMSwwLDBWNEE0LDQsMCwwLDEsNCwwWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjAgMjApIi8+CiAgICA8ZyBpZD0iTWFza19Hcm91cF8xMDciIGRhdGEtbmFtZT0iTWFzayBHcm91cCAxMDciIGNsYXNzPSJjbHMtMyI+CiAgICAgIDxlbGxpcHNlIGlkPSJFbGxpcHNlXzEzMCIgZGF0YS1uYW1lPSJFbGxpcHNlIDEzMCIgY2xhc3M9ImNscy00IiBjeD0iMjA0LjUiIGN5PSIxNTEuNDgxIiByeD0iMjA0LjUiIHJ5PSIxNTEuNDgxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtODQgLTE2OC40NjYpIi8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K"

/***/ }),

/***/ 603:
/***/ (function(module, exports) {

module.exports = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzIwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMzIwIDgwIj4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLmNscy0xIHsKICAgICAgICBmaWxsOiB1cmwoI2xpbmVhci1ncmFkaWVudCk7CiAgICAgIH0KCiAgICAgIC5jbHMtMiB7CiAgICAgICAgZmlsbDogI2U2MDAwMDsKICAgICAgfQoKICAgICAgLmNscy0zIHsKICAgICAgICBvcGFjaXR5OiAwLjM3MjsKICAgICAgICBjbGlwLXBhdGg6IHVybCgjY2xpcC1wYXRoKTsKICAgICAgfQoKICAgICAgLmNscy00IHsKICAgICAgICBmaWxsOiAjZmY0MDQwOwogICAgICB9CiAgICA8L3N0eWxlPgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJsaW5lYXItZ3JhZGllbnQiIHkxPSIxIiB4Mj0iMSIgZ3JhZGllbnRVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMwMzViZDQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjM2NmZmRhIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGNsaXBQYXRoIGlkPSJjbGlwLXBhdGgiPgogICAgICA8cGF0aCBpZD0iUmVjdGFuZ2xlXzUzMDciIGRhdGEtbmFtZT0iUmVjdGFuZ2xlIDUzMDciIGNsYXNzPSJjbHMtMSIgZD0iTTQsMEgzMTZhNCw0LDAsMCwxLDQsNFY4MGEwLDAsMCwwLDEsMCwwSDBhMCwwLDAsMCwxLDAsMFY0QTQsNCwwLDAsMSw0LDBaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMCAyMCkiLz4KICAgIDwvY2xpcFBhdGg+CiAgPC9kZWZzPgogIDxnIGlkPSJiYWNrZ3JvdW5kLWhlYWQtcGVuZGluZyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTIwIC0yMCkiPgogICAgPHBhdGggaWQ9IlJlY3RhbmdsZV81MzA4IiBkYXRhLW5hbWU9IlJlY3RhbmdsZSA1MzA4IiBjbGFzcz0iY2xzLTIiIGQ9Ik00LDBIMzE2YTQsNCwwLDAsMSw0LDRWODBhMCwwLDAsMCwxLDAsMEgwYTAsMCwwLDAsMSwwLDBWNEE0LDQsMCwwLDEsNCwwWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjAgMjApIi8+CiAgICA8ZyBpZD0iTWFza19Hcm91cF8xMDciIGRhdGEtbmFtZT0iTWFzayBHcm91cCAxMDciIGNsYXNzPSJjbHMtMyI+CiAgICAgIDxlbGxpcHNlIGlkPSJFbGxpcHNlXzEzMCIgZGF0YS1uYW1lPSJFbGxpcHNlIDEzMCIgY2xhc3M9ImNscy00IiBjeD0iMjA0LjUiIGN5PSIxNTEuNDgxIiByeD0iMjA0LjUiIHJ5PSIxNTEuNDgxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtODQgLTE2OC40NjYpIi8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K"

/***/ }),

/***/ 604:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"bg-gray warp-chlid"},[_c('section',{staticClass:"header bg-header"},[_c('i',{staticClass:"iconfont icon-back",on:{"click":function($event){_vm.$router.go(-1)}}}),_vm._v(" "),_c('p',[_vm._v(_vm._s(_vm.$t('transactionDetail.title')))])]),_vm._v(" "),_c('section',{staticClass:"panel"},[_c('div',{staticClass:"tx-header",class:_vm.classObject},[_c('p',{staticClass:"value"},[_vm._v(_vm._s(_vm.transaction.direct)+_vm._s(_vm.transaction.val)),_c('span',{staticClass:"asset"},[_vm._v("BTM")])]),_vm._v(" "),(_vm.transaction.status_fail)?_c('small',{staticClass:"header-text"},[_vm._v("\n            "+_vm._s(_vm.$t('transactionDetail.fail'))+"\n          ")]):(_vm.transaction.hasOwnProperty('block_timestamp'))?_c('small',{staticClass:"header-text"},[_vm._v("\n            "+_vm._s(_vm.$t('transactionDetail.success'))+"\n          ")]):_c('small',{staticClass:"header-text"},[_vm._v("\n            "+_vm._s(_vm.$t('transactionDetail.pending'))+"\n          ")])]),_vm._v(" "),_c('vue-scroll',[_c('div',{staticClass:"transaction"},[_c('table',{staticStyle:{"margin-bottom":"20px"}},[_c('tbody',[_c('tr',[_c('td',{staticClass:"label"},[_vm._v("\n                      "+_vm._s(_vm.$t('transactionDetail.transactionID'))+"\n                    ")]),_vm._v(" "),_c('td',{staticClass:"value"},[_c('p',[_vm._v(_vm._s(_vm.transaction.hash))])])]),_vm._v(" "),_c('tr',[_c('td',{attrs:{"colspan":"2"}},[_c('div',{staticClass:"divider"})])]),_vm._v(" "),_c('tr',[_c('td',{staticClass:"label"},[_vm._v("\n                      "+_vm._s(_vm.$t('transactionDetail.time'))+"\n                    ")]),_vm._v(" "),_c('td',{staticClass:"value"},[(_vm.transaction.hasOwnProperty('block_timestamp'))?_c('div',[_vm._v("\n                          "+_vm._s(_vm._f("moment")(_vm.transaction.submission_timestamp))+"\n                        ")]):_c('div',[_vm._v("\n                          -\n                        ")])])]),_vm._v(" "),_c('tr',[_c('td',{staticClass:"label"},[_vm._v("\n                        "+_vm._s(_vm.$t('transactionDetail.blockHeight'))+"\n                    ")]),_vm._v(" "),_c('td',{staticClass:"value"},[(_vm.transaction.block_height != undefined)?_c('p',[_vm._v(_vm._s(_vm.transaction.block_height))]):_c('p',[_vm._v("-")])])]),_vm._v(" "),_c('tr',[_c('td',{staticClass:"label"},[_vm._v("\n                      "+_vm._s(_vm.$t('transactionDetail.blockSize'))+"\n                    ")]),_vm._v(" "),_c('td',{staticClass:"value"},[_c('p',[_vm._v(_vm._s(_vm.transaction.size))])])]),_vm._v(" "),_c('tr',[_c('td',{staticClass:"label"},[_vm._v("\n                      "+_vm._s(_vm.$t('transactionDetail.fee'))+"(BTM)\n                    ")]),_vm._v(" "),_c('td',{staticClass:"value"},[_c('p',[_vm._v(_vm._s(_vm.transaction.fee))])])]),_vm._v(" "),_c('tr',[_c('td',{attrs:{"colspan":"2"}},[_c('div',{staticClass:"divider"})])]),_vm._v(" "),_vm._l((_vm.transaction.inputs),function(input,index){return _c('tr',{key:index},[_c('td',{staticClass:"label"},[_vm._v(_vm._s(_vm.$t('transactionDetail.sendAddress'))+_vm._s(_vm.transaction.inputs.length > 1 ? index+1 : ''))]),_vm._v(" "),_c('td',{staticClass:"value"},[_vm._v(_vm._s(input.address)),(input.address == _vm.selfAddress)?_c('span',[_vm._v(" "+_vm._s(_vm.$t('transactionDetail.myAddress')))]):_vm._e()])])}),_vm._v(" "),_vm._l((_vm.transaction.outputs),function(output,index){return _c('tr',{key:index},[_c('td',{staticClass:"label"},[_vm._v(_vm._s(_vm.$t('transactionDetail.receiveAddress'))+_vm._s(_vm.transaction.outputs.length > 1 ? index+1 : ''))]),_vm._v(" "),_c('td',{staticClass:"value"},[_vm._v(_vm._s(output.address)),(output.address == _vm.selfAddress)?_c('span',[_vm._v(" "+_vm._s(_vm.$t('transactionDetail.myAddress')))]):_vm._e()])])})],2)])])])],1),_vm._v(" "),_c('small',{staticClass:"footer color-grey"},[_vm._v(_vm._s(_vm.$t('transactionDetail.tips')))])])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ })

});
//# sourceMappingURL=10.js.map 