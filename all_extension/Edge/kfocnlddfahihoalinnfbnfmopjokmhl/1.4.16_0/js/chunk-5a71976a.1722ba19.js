(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-5a71976a"],{"0bb0":function(t,e,a){"use strict";a("69b9")},"2e07":function(t,e,a){"use strict";a.r(e),a("99af"),a("4de4"),a("7db0"),a("d81d"),a("b0c0"),a("b680"),a("d3b7"),a("07ac"),a("4d63"),a("ac1f"),a("25f0"),a("5319"),a("498a"),a("96cf");var s=a("1da1"),o=a("1157"),n=a.n(o),r=a("c1df"),i=a.n(r),l=a("9dcd"),c=a.n(l),u=a("2083"),m=a.n(u),d=a("3698"),f=a("0a35"),h=a("133f"),v=a.n(h),p=(a("deaa"),a("78dc")),g=a("b85c"),k={name:"TypeHead",props:{listTag:{type:String,default:"div"},itemTag:{type:String,default:"div"},listClass:{type:[Array,String],default:""},dataKey:{type:[String,null],default:null},searchKey:{type:[Array,String,null],default:null},items:{type:Array,default:function(){return[]}},placeholder:{type:[String,null],default:null},value:{type:String,default:""}},data:function(){return{val:"",isFocus:!1}},careated:function(){this.val=this.value},watch:{value:function(t,e){t!==e&&this.val!=t&&(this.val=t)},val:function(t,e){t!==e&&this.value!=t&&this.$emit("input",t)}},computed:{isSlot:function(){try{return!!this.$scopedSlots.typeheadItem}catch(t){return!1}},clsList:function(){var t=["v_typehaed-list"];if(this.isFocus&&t.push("v_typehead-focused"),this.listClass){var e=this.listClass;Array.isArray(e)||(e=[e]),t=t.concat(e)}return t},typeHeadList:function(){var t=this,e=(this.value||"").trim().toLocaleLowerCase(),a=new RegExp(e);return null!=this.searchKey?this.items.filter((function(e){if(Array.isArray(t.searchKey)){var s,o=!1,n=Object(g.a)(t.searchKey);try{for(n.s();!(s=n.n()).done;){var r=e[s.value]||"";if(o=a.test(r.toLocaleLowerCase()))break}}catch(t){n.e(t)}finally{n.f()}return o}var i=e[t.searchKey]||"";return a.test(i.toLocaleLowerCase())})):this.items.filter((function(t){try{return a.test(t.toLocaleLowerCase())}catch(t){return console.warn("items data is not string."),!0}}))}},methods:{searchFocus:function(){this.isFocus=!0,this.$emit("focus")},searchBlur:function(){this.isHover||(this.isFocus=!1,this.$emit("blur"))},mouseOverWrap:function(){this.isHover=!0},mouseLeaveWrap:function(){this.isHover=!1},clickSelectItem:function(t){this.isFocus=!1,this.isHover=!1,null!=this.dataKey?this.val=t[this.dataKey]:this.val=t}}},y=(a("0bb0"),a("2877")),C=Object(y.a)(k,(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"v_typehead",on:{mouseover:t.mouseOverWrap,mouseleave:t.mouseLeaveWrap}},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.val,expression:"val"}],staticClass:"form-control",attrs:{type:"text",placeholder:t.placeholder},domProps:{value:t.val},on:{focus:t.searchFocus,blur:t.searchBlur,input:function(e){e.target.composing||(t.val=e.target.value)}}}),t.typeHeadList.length>0?a(t.listTag,{tag:"component",class:t.clsList},t._l(t.typeHeadList,(function(e,s){return a(t.itemTag,{key:"typeHead"+s,tag:"component"},[t.isSlot?a("div",{staticClass:"v_typehead-item",on:{click:function(a){return t.clickSelectItem(e)}}},[t._t("typeheadItem",null,{itemKey:s,item:e})],2):null!=t.dataKey?a("div",{staticClass:"v_typehead-item",on:{click:function(a){return t.clickSelectItem(e)}}},[t._v(" "+t._s(e[t.dataKey])+" ")]):a("div",{staticClass:"v_typehead-item",on:{click:function(a){return t.clickSelectItem(e)}}},[t._v(t._s(e))])])})),1):t._e()],1)}),[],!1,null,"703c3d20",null).exports,b=a("b3dc");n.a.extend(!0,n.a.fn.datetimepicker.defaults,{icons:{time:"far fa-clock",date:"far fa-calendar",up:"fas fa-arrow-up",down:"fas fa-arrow-down",previous:"fas fa-chevron-left",next:"fas fa-chevron-right",today:"fas fa-calendar-check",clear:"far fa-trash-alt",close:"far fa-times-circle"}});var _=Date.now(),x={name:"Transfer",components:{CalendarIcon:f.a,CoolSelect:d.a,Cleave:m.a,DatePicker:v.a,AppNavigation:p.a,TokenItem:b.a,TypeHead:C},data:function(){return{isLoading:!1,copyTimeout:null,copyMessage:"",amountPrefix:"",cleaveOption:{numeral:!0,delimiter:",",delimiterLazyShow:!0,rawValueTrimPrefix:!0,numeralThousandsGroupStyle:"thousand",numeralDecimalScale:0},cleaveValue:{amount:0},selectedToken:{},datePickerOption:{showClear:!0,showClose:!0,minDate:_,format:"YYYY-MM-DD HH:mm"},error:{tokenId:"",address:"",amount:"",tag:"",memo:"",unlockDate:"",msg:""},unlockDate:null,form:{tokenId:0,address:"",amount:0,tag:"",memo:"",unlockDate:""}}},created:function(){var t=this;return Object(s.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.registerEvent();case 2:return e.next=4,t.evtBgGetAddressBook();case 4:t.datePickerOption.format=t.$t("format.date");case 5:case"end":return e.stop()}}),e)})))()},beforeMount:function(){this.pageData&&this.pageData.tokenId?this.updateTokenId(this.pageData.tokenId||0):this.updateTokenId(0)},beforeDestroy:function(){this.removeEvent()},watch:{unlockDate:function(t){var e=null;null!=t&&(e=i()(t).format("X")),this.form.unlockDate=e},"form.tokenId":function(t,e){t!==e&&(this.amountPrefix=this.selectedToken.symbol,null!=t&&this.selectedToken.decimal!=this.cleaveOption.numeralDecimalScale&&(this.cleaveOption.numeralDecimalScale=this.selectedToken.decimal),this.validateForm("tokenId"))},"form.address":function(){this.validateForm("address")},"cleaveValue.amount":function(t,e){t!==e&&t!=this.form.amount&&this.validateAmount(t)},"form.tag":function(){this.validateForm("tag")},"form.memo":function(){this.validateForm("memo")},"form.unlockDate":function(){this.validateForm("unlockDate")}},computed:{address:function(){return this.Account.address||""},tokenItems:function(){return(Object.values(this.AccountTokenItems)||[]).sort((function(t,e){return t.id-e.id}))},addressBookItems:function(){var t=this,e=(this.AddressBook||[]).sort((function(t,e){return t.name&&e.name?t.count==e.count?t.timestamp-e.timestamp:t.count-e.count:t.name?-1:e.name?1:void 0}))||[],a=(Object.values(this.AccountsItems)||[]).filter((function(e){return e.address!=t.address})).sort((function(t,e){return t.sort-e.sort})).map((function(t){return{name:t.name||"",address:t.address}}));return e.concat(a)},isDisableSumit:function(){var t=this.form||{},e=this.error||{};return!(t.tokenId>=0&&t.address.length>0&&t.amount>0&&e.tokenId.length<1&&e.address.length<1&&e.amount.length<1&&e.tag.length<1&&e.memo.length<1&&e.unlockDate.length<1)||null}},methods:{registerEvent:function(){this.removeEvent();var t=this;this.timeoutData=setTimeout((function(){var e=t.address||null;e&&t.evtBgSelectAddress({address:e}),t.registerEvent()}),1e4)},removeEvent:function(){this.timeoutData&&(clearTimeout(this.timeoutData),this.timeoutData=null)},isAddress:function(t){return/^(MT[a-zA-Z0-9]{38})$/.test(t)},validateForm:function(t){c.a.DP=parseInt(this.selectedToken.decimal||0);var e=new c.a(this.selectedToken.amount||0);switch(t){case"tokenId":this.error.tokenId="",this.form.tokenId||0==this.form.tokenId||(this.error.tokenId="message.errNotfoundTokenId");break;case"address":this.error.address="",this.form.address.trim()?this.isAddress(this.form.address)||(this.error.address="message.errValidateAddress"):this.error.address="message.errNotfoundAddress";break;case"amount":if(this.error.amount="",!this.form.tokenId&&0!=this.form.tokenId){this.error.amount="message.errNotfoundTokenId";break}if(!this.form.amount&&0!=this.form.amount){this.error.amount="message.errNotfoundAmount";break}e.lt(new c.a(this.form.amount||0))&&(this.error.amount="message.errValidateAmount");break;case"tag":this.error.tag="",this.form.tag&&this.form.tag.length>128&&(this.error.tag="message.errLengthTag");break;case"memo":this.error.memo="",this.form.memo&&this.form.memo.length>128&&(this.error.memo="message.errLengthComment")}},updateTokenId:function(t){var e=(this.tokenItems||[]).find((function(e){return e.id==t}))||null;e&&(this.form.tokenId=e.id,this.selectedToken=e,this.amountPrefix=e.symbol||"",this.cleaveOption.numeralDecimalScale=e.decimal||"0")},changeToken:function(t){this.selectedToken=t,this.amountPrefix=t.symbol||"",this.cleaveOption.numeralDecimalScale=t.decimal||"0",this.form.amount=0,this.validateAmount(this.amount)},focusCoinInput:function(){var t=this.$refs.coinSelect||null;null!=t&&setTimeout((function(){t.$refs["IZ-select__input-for-text"].focus()}),200)},filterCoinSearch:function(t,e){if(e.length>0){var a=(e.trim()||"").toLocaleLowerCase(),s=new RegExp("(".concat(a,")")),o=(t.symbol||"").toLocaleLowerCase(),n=(t.name||"").toLocaleLowerCase();return s.test(o)||s.test(n)}return!0},openCalendar:function(){(this.$refs.datepicker.dp||{}).toggle()},cutAddress:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:10,a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:8;return"".concat(t.substr(0,e),"...").concat(t.substr(-1*a))},validateAmount:function(t){var e=this;if(!this.selectedToken.id&&0!=this.selectedToken.id)return this.$nextTick((function(){e.cleaveValue.amount=e.form.amount=0}));try{c.a.DP=parseInt(this.selectedToken.decimal||0);var a=new c.a(this.selectedToken.amount||0);if(a.eq("0"))return this.$nextTick((function(){e.cleaveValue.amount=e.form.amount=0}));var s=t||"0";a.lt(String(s||"0"))?this.$nextTick((function(){e.cleaveValue.amount=e.form.amount=a.toFixed(parseInt(e.selectedToken.decimal||0)).replace(/\.[0]+$/,"")})):this.$nextTick((function(){e.form.amount=s})),this.$nextTick((function(){e.validateForm("amount")}))}catch(t){this.cleaveValue.amount=this.form.amount=0}},clickBack:function(){this.isLoading||this.evtPrevPage()},clickSubmit:function(){var t=this;if(!this.isLoading&&!this.isDisableSumit){this.isLoading=!0;var e=this.form||{},a={from:this.address,to:e.address,tokenId:e.tokenId||0,amount:e.amount||0,tag:e.tag||"",memo:e.memo||"",unlockDate:e.unlockDate||""};this.evtBgTransfer(a).then((function(e){e.msg&&t.$toast.open({message:t.$t(e.msg),type:"success"}),t.evtUpdatePage("Home")})).catch((function(){})).finally((function(){t.isLoading=!1}))}}}},I=Object(y.a)(x,(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("AppNavigation",{attrs:{title:"transfer.title",isLeft:!0},on:{"click:left":t.clickBack}}),a("div",{staticClass:"p-3"},[a("div",{staticClass:"form-group row mb-3"},[a("label",{staticClass:"col-form-label col-12"},[t._v(" "+t._s(t.$t("form.coin"))+" "),a("span",{staticClass:"ml-1 text-danger"},[t._v("*")])]),a("div",{staticClass:"col-12"},[a("cool-select",{ref:"coinSelect",staticClass:"select__input_media",attrs:{items:t.tokenItems,"item-value":"id",placeholder:t.$t("form.searchCoin"),filter:t.filterCoinSearch},on:{focus:t.focusCoinInput,select:t.changeToken},scopedSlots:t._u([{key:"no-data",fn:function(){return[t._v(t._s(t.$t("message.errNotfoundSearch")))]},proxy:!0},{key:"item",fn:function(e){var s=e.item;return[a("TokenItem",{staticClass:"my-2 mx-1 align-items-center",attrs:{item:s},scopedSlots:t._u([{key:"right",fn:function(){return[a("div",{staticClass:"ml-2"},[a("span",{staticClass:"badge badge-primary"},[t._v("TokenID: "+t._s(s.id))])])]},proxy:!0}],null,!0)})]}},{key:"selection",fn:function(e){var s=e.item;return[a("TokenItem",{staticClass:"py-2 px-3 wfull align-items-center",attrs:{item:s},scopedSlots:t._u([{key:"right",fn:function(){return[a("div",{staticClass:"ml-2"},[a("span",{staticClass:"badge badge-primary"},[t._v("TokenID: "+t._s(s.id))])])]},proxy:!0}],null,!0)})]}}]),model:{value:t.form.tokenId,callback:function(e){t.$set(t.form,"tokenId",e)},expression:"form.tokenId"}})],1),this.error.tokenId.length>0?a("div",{staticClass:"mt-1 col-12 text-danger"},[t._v(" "+t._s(t.$t(t.error.tokenId))+" ")]):t._e()]),a("div",{staticClass:"form-group row mb-2"},[a("label",{staticClass:"col-form-label col-4"},[t._v(" "+t._s(t.$t("form.address"))+" "),a("span",{staticClass:"ml-1 text-danger"},[t._v("*")])]),a("div",{staticClass:"col-8"},[a("TypeHead",{attrs:{searchKey:["name","address"],"data-key":"address",items:t.addressBookItems,placeholder:t.$t("placeholder.address")},scopedSlots:t._u([{key:"typeheadItem",fn:function(e){var s=e.item;return[a("div",{staticClass:"text-white"},[t._v(t._s(s.name))]),a("div",{staticClass:"text-muted text-of"},[t._v(" "+t._s(t.cutAddress(s.address))+" ")])]}}]),model:{value:t.form.address,callback:function(e){t.$set(t.form,"address",e)},expression:"form.address"}})],1),this.error.address.length>0?a("div",{staticClass:"mt-1 offset-4 col-8 text-danger"},[t._v(" "+t._s(t.$t(t.error.address))+" ")]):t._e()]),a("div",{staticClass:"form-group row mb-2"},[a("label",{staticClass:"col-form-label col-4"},[t._v(" "+t._s(t.$t("form.amount"))+" "),a("span",{staticClass:"ml-1 text-danger"},[t._v("*")])]),a("div",{staticClass:"col-8"},[a("div",{staticClass:"input-group input-group-unit"},[a("cleave",{staticClass:"form-control text-right",attrs:{options:t.cleaveOption,placeholder:t.$t("placeholder.amount")},model:{value:t.cleaveValue.amount,callback:function(e){t.$set(t.cleaveValue,"amount",e)},expression:"cleaveValue.amount"}}),a("span",{staticClass:"input-group-prepend"},[a("span",{staticClass:"input-group-text"},[t._v(t._s(t.amountPrefix))])])],1)]),this.error.amount.length>0?a("div",{staticClass:"mt-1 offset-4 col-8 text-danger"},[t._v(" "+t._s(t.$t(t.error.amount))+" ")]):t._e()]),a("div",{staticClass:"form-group row mb-2"},[a("label",{staticClass:"col-form-label col-4"},[t._v(t._s(t.$t("form.tag")))]),a("div",{staticClass:"col-8"},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.form.tag,expression:"form.tag"}],staticClass:"form-control",attrs:{type:"text",placeholder:t.$t("placeholder.tag"),maxlength:"256"},domProps:{value:t.form.tag},on:{input:function(e){e.target.composing||t.$set(t.form,"tag",e.target.value)}}})]),this.error.tag.length>0?a("div",{staticClass:"mt-1 offset-4 col-8 text-danger"},[t._v(" "+t._s(t.$t(t.error.tag))+" ")]):t._e()]),a("div",{staticClass:"form-group row mb-2"},[a("label",{staticClass:"col-form-label col-4"},[t._v(t._s(t.$t("form.comment")))]),a("div",{staticClass:"col-8"},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.form.memo,expression:"form.memo"}],staticClass:"form-control",attrs:{type:"text",placeholder:t.$t("placeholder.comment"),maxlength:"256"},domProps:{value:t.form.memo},on:{input:function(e){e.target.composing||t.$set(t.form,"memo",e.target.value)}}})]),this.error.memo.length>0?a("div",{staticClass:"mt-1 offset-4 col-8 text-danger"},[t._v(" "+t._s(t.$t(t.error.memo))+" ")]):t._e()]),a("div",{staticClass:"form-group row mb-2"},[a("label",{staticClass:"col-form-label col-4"},[t._v(t._s(t.$t("form.unlockDate")))]),a("div",{staticClass:"col-8"},[a("div",{staticClass:"input-group"},[a("date-picker",{ref:"datepicker",attrs:{placeholder:t.$t("placeholder.unlockDate"),config:t.datePickerOption},model:{value:t.unlockDate,callback:function(e){t.unlockDate=e},expression:"unlockDate"}}),a("span",{staticClass:"input-group-prepend cur-point",on:{click:t.openCalendar}},[a("span",{staticClass:"input-group-text"},[a("CalendarIcon",{attrs:{size:"1x"}})],1)])],1)]),this.error.unlockDate.length>0?a("div",{staticClass:"mt-1 offset-4 col-8 text-danger"},[t._v(" "+t._s(t.$t(t.error.unlockDate))+" ")]):t._e()]),a("vue-ladda",{staticClass:"mt-3 mb-2 btn btn-lg wfull btn-primary",attrs:{type:"button",loading:t.isLoading,disabled:t.isDisableSumit},on:{click:t.clickSubmit}},[t._v(t._s(t.$t("action.processed")))])],1)],1)}),[],!1,null,null,null);e.default=I.exports},"69b9":function(t,e,a){},deaa:function(t,e,a){}}]);