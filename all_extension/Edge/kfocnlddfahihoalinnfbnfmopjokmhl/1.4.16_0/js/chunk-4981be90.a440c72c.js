(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-4981be90"],{"5b25":function(t,s,e){},bb0f:function(t,s,e){"use strict";e.r(s),e("d3b7"),e("3ca3"),e("498a"),e("ddb0"),e("2b3d");var i=e("0a35"),a=e("78dc"),n=e("d88e"),o=e("c8a6"),c=e("14df"),r={name:"Export",components:{KeyIcon:i.i,AppNavigation:a.a,AniInput:n.a,AddressLabel:c.a,SecretTextarea:o.a},data:function(){return{step:0,isLoading:!1,error:{passwd:""},passwd:"",isDisableExportKey:!0,exportKey:""}},mounted:function(){this.focus()},computed:{address:function(){return this.Account.address||"-"},isDisableSubmit:function(){return!(this.passwd.length>7)||null}},methods:{focus:function(){1==this.step?this.$refs.secArea.focus():this.$refs.itemInput.focus()},clickShowSecret:function(t){this.isDisableExportKey=!!t||null},clickSubmit:function(){var t=this;this.isLoading||null==this.isDisableSubmit&&(this.error.passwd="",this.passwd.length<1||this.passwd.trim().length<8?this.error.passwd="message.errSign":(this.isLoading=!0,this.evtBgExportAddress({address:this.address,passwd:this.passwd}).then((function(s){var e=(s.data||{}).key||null;e&&(t.step=1,t.exportKey=e)})).catch((function(s){t.error.passwd=s.msg||""})).finally((function(){t.isLoading=!1}))))},moveHome:function(){this.evtUpdatePage("Home")},clickBack:function(){this.isLoading||this.evtPrevPage()},clickDownload:function(){if(!this.isLoading){this.isLoading=!0;try{var t=document.createElement("a"),s=new Blob([this.exportKey],{type:"octet/stream"});t.href=window.URL.createObjectURL(s),t.download=this.address,t.style.display="none",document.body.appendChild(t),t.click(),t.remove()}catch(t){}finally{this.isLoading=!1}}}}},d=(e("ea6e"),e("2877")),l=Object(d.a)(r,(function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",[e("AppNavigation",{attrs:{title:"export.title",isLeft:1!=t.step},on:{"click:left":t.clickBack}}),e("div",{staticClass:"px-4 d-flex justify-content-center align-items-center"},[e("div",{staticClass:"mt-3"},[e("div",{staticClass:"h6 mt-2 text-center",domProps:{innerHTML:t._s(t.$t("export.info"))}}),1==t.step?e("div",[e("SecretTextarea",{ref:"secArea",staticClass:"mt-4",attrs:{disabled:!0},on:{"update:secret":t.clickShowSecret},model:{value:t.exportKey,callback:function(s){t.exportKey=s},expression:"exportKey"}}),e("button",{staticClass:"mt-3 btn btn-lg wfull bg-primary",attrs:{type:"button"},on:{click:t.moveHome}},[t._v(" "+t._s(t.$t("action.moveHome"))+" ")]),e("vue-ladda",{staticClass:"mt-3 btn btn-lg wfull bg-primary-800",attrs:{type:"button",loading:t.isLoading},on:{click:t.clickDownload}},[t._v(" "+t._s(t.$t("action.download"))+" ")])],1):e("div",[e("div",{staticClass:"mt-3"},[t._v(t._s(t.$t("export.selectTitle")))]),e("AddressLabel",{staticClass:"mt-2",attrs:{address:t.address,inputClass:"form-control-lg text-white",isCopyButton:!0}}),e("div",{staticClass:"mt-4"},[e("AniInput",{ref:"itemInput",attrs:{type:"password",inputClass:"form-control-lg",placeholder:t.$t("form.passwd")},on:{enter:t.clickSubmit},scopedSlots:t._u([{key:"icon",fn:function(){return[e("KeyIcon",{attrs:{size:"1x"}})]},proxy:!0}]),model:{value:t.passwd,callback:function(s){t.passwd=s},expression:"passwd"}}),this.error.passwd.length>0?e("div",{staticClass:"mt-1 text-danger"},[t._v(" "+t._s(t.$t(t.error.passwd))+" ")]):t._e(),e("div",{staticClass:"mt-3"},[e("vue-ladda",{staticClass:"btn btn-lg wfull bg-primary-800",attrs:{type:"button",loading:t.isLoading,disabled:t.isDisableSubmit},on:{click:t.clickSubmit}},[t._v(t._s(t.$t("action.unlock")))])],1)],1)],1)])])],1)}),[],!1,null,"638a542d",null);s.default=l.exports},ea6e:function(t,s,e){"use strict";e("5b25")}}]);