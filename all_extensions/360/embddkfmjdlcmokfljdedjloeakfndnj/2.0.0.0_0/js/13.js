// [AIV_SHORT]  Build version: 0.14.0 - Tuesday, June 25th, 2019, 2:12:23 PM  
 webpackJsonp([13],{

/***/ 530:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_menuSettings_vue__ = __webpack_require__(575);
/* empty harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3456c03a_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_menuSettings_vue__ = __webpack_require__(620);
function injectStyle (ssrContext) {
  __webpack_require__(618)
}
var normalizeComponent = __webpack_require__(114)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-3456c03a"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_menuSettings_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3456c03a_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_menuSettings_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),

/***/ 575:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__assets_language__ = __webpack_require__(409);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
            unit: "BTM",
            i18nOptions: [{ label: "中文", value: "cn" }, { label: "English", value: "en" }],
            selected: { label: "中文", value: "cn" },
            hashVersion: ""
        };
    },

    methods: {
        onChange: function onChange(value) {
            if (localStorage.lang != value.value) {
                localStorage.lang = value.value;
                this.$i18n.locale = value.value;
                this.selected = value;
            }
        },
        back: function back() {
            this.$emit("on-back");
        },
        close: function close() {
            this.$emit("on-exit");
        }
    },
    mounted: function mounted() {
        this.hashVersion = "ac829eb";
        if (Object(__WEBPACK_IMPORTED_MODULE_0__assets_language__["c" /* have */])(localStorage.lang)) {
            if (localStorage.lang == "cn") {
                this.selected = { label: "中文", value: "cn" };
            } else if (localStorage.lang == "en") {
                this.selected = { label: "English", value: "en" };
            }
        }
    }
});

/***/ }),

/***/ 618:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(619);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(56)("5abcdaae", content, true, {});

/***/ }),

/***/ 619:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(55)(false);
// imports


// module
exports.push([module.i, ".row[data-v-3456c03a]{margin:25px 0;display:flex;align-items:center}.row .label[data-v-3456c03a]{flex-grow:1}.value[data-v-3456c03a]{font-size:15px;line-height:30px}.setting[data-v-3456c03a]{margin:5px 0 0;width:110px;height:32px;position:relative}.form-item-content .select[data-v-3456c03a]{height:32px}", ""]);

// exports


/***/ }),

/***/ 620:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('MenuPage',{attrs:{"title":_vm.$t('setting.title')},on:{"back":_vm.back}},[_c('div',{staticClass:"row"},[_c('div',{staticClass:"label"},[_c('p',[_vm._v(_vm._s(_vm.$t("setting.lang")))])]),_vm._v(" "),_c('div',{staticClass:"form-item setting"},[_c('v-select',{staticClass:"select",staticStyle:{"height":"32px"},attrs:{"value":_vm.selected,"clearable":false,"onChange":_vm.onChange,"options":_vm.i18nOptions}})],1)]),_vm._v(" "),_c('div',{staticClass:"row"},[_c('div',{staticClass:"label"},[_c('p',[_vm._v(_vm._s(_vm.$t("setting.unit")))])]),_vm._v(" "),_c('div',{staticClass:"form-item setting"},[_c('v-select',{staticClass:"select",staticStyle:{"height":"32px"},attrs:{"value":_vm.unit,"clearable":false,"options":['BTM']}})],1)])])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ })

});
//# sourceMappingURL=13.js.map 