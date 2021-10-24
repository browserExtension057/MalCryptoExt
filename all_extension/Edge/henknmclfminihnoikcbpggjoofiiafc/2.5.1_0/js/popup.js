/*! For license information please see popup.js.LICENSE.txt */
(()=>{var e={564:e=>{function t(e,t,n,r,o,i,a){try{var l=e[i](a),u=l.value}catch(e){return void n(e)}l.done?t(u):Promise.resolve(u).then(r,o)}e.exports=function(e){return function(){var n=this,r=arguments;return new Promise((function(o,i){var a=e.apply(n,r);function l(e){t(a,o,i,l,u,"next",e)}function u(e){t(a,o,i,l,u,"throw",e)}l(void 0)}))}}},264:(e,t,n)=>{n(588)},199:function(e){e.exports=function(){"use strict";var e=Object.hasOwnProperty,t=Object.setPrototypeOf,n=Object.isFrozen,r=Object.getPrototypeOf,o=Object.getOwnPropertyDescriptor,i=Object.freeze,a=Object.seal,l=Object.create,u="undefined"!=typeof Reflect&&Reflect,c=u.apply,s=u.construct;c||(c=function(e,t,n){return e.apply(t,n)}),i||(i=function(e){return e}),a||(a=function(e){return e}),s||(s=function(e,t){return new(Function.prototype.bind.apply(e,[null].concat(function(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}(t))))});var f,p=w(Array.prototype.forEach),d=w(Array.prototype.pop),m=w(Array.prototype.push),_=w(String.prototype.toLowerCase),h=w(String.prototype.match),g=w(String.prototype.replace),y=w(String.prototype.indexOf),v=w(String.prototype.trim),b=w(RegExp.prototype.test),x=(f=TypeError,function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return s(f,t)});function w(e){return function(t){for(var n=arguments.length,r=Array(n>1?n-1:0),o=1;o<n;o++)r[o-1]=arguments[o];return c(e,t,r)}}function k(e,r){t&&t(e,null);for(var o=r.length;o--;){var i=r[o];if("string"==typeof i){var a=_(i);a!==i&&(n(r)||(r[o]=a),i=a)}e[i]=!0}return e}function T(t){var n=l(null),r=void 0;for(r in t)c(e,t,[r])&&(n[r]=t[r]);return n}function A(e,t){for(;null!==e;){var n=o(e,t);if(n){if(n.get)return w(n.get);if("function"==typeof n.value)return w(n.value)}e=r(e)}return null}var E=i(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","section","select","shadow","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),S=i(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","filter","font","g","glyph","glyphref","hkern","image","line","lineargradient","marker","mask","metadata","mpath","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),L=i(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),N=i(["animate","color-profile","cursor","discard","fedropshadow","feimage","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),D=i(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover"]),O=i(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),R=i(["#text"]),M=i(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","face","for","headers","height","hidden","high","href","hreflang","id","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","noshade","novalidate","nowrap","open","optimum","pattern","placeholder","playsinline","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","xmlns"]),C=i(["accent-height","accumulate","additive","alignment-baseline","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","targetx","targety","transform","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),F=i(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),P=i(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),U=a(/\{\{[\s\S]*|[\s\S]*\}\}/gm),I=a(/<%[\s\S]*|[\s\S]*%>/gm),j=a(/^data-[\-\w.\u00B7-\uFFFF]/),H=a(/^aria-[\-\w]+$/),z=a(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),W=a(/^(?:\w+script|data):/i),B=a(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),G="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};function q(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}var V=function(){return"undefined"==typeof window?null:window},Y=function(e,t){if("object"!==(void 0===e?"undefined":G(e))||"function"!=typeof e.createPolicy)return null;var n=null,r="data-tt-policy-suffix";t.currentScript&&t.currentScript.hasAttribute(r)&&(n=t.currentScript.getAttribute(r));var o="dompurify"+(n?"#"+n:"");try{return e.createPolicy(o,{createHTML:function(e){return e}})}catch(e){return console.warn("TrustedTypes policy "+o+" could not be created."),null}};return function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:V(),n=function(t){return e(t)};if(n.version="2.2.6",n.removed=[],!t||!t.document||9!==t.document.nodeType)return n.isSupported=!1,n;var r=t.document,o=t.document,a=t.DocumentFragment,l=t.HTMLTemplateElement,u=t.Node,c=t.Element,s=t.NodeFilter,f=t.NamedNodeMap,w=void 0===f?t.NamedNodeMap||t.MozNamedAttrMap:f,K=t.Text,$=t.Comment,X=t.DOMParser,Z=t.trustedTypes,J=c.prototype,Q=A(J,"cloneNode"),ee=A(J,"nextSibling"),te=A(J,"childNodes"),ne=A(J,"parentNode");if("function"==typeof l){var re=o.createElement("template");re.content&&re.content.ownerDocument&&(o=re.content.ownerDocument)}var oe=Y(Z,r),ie=oe&&Ue?oe.createHTML(""):"",ae=o,le=ae.implementation,ue=ae.createNodeIterator,ce=ae.getElementsByTagName,se=ae.createDocumentFragment,fe=r.importNode,pe={};try{pe=T(o).documentMode?o.documentMode:{}}catch(e){}var de={};n.isSupported=le&&void 0!==le.createHTMLDocument&&9!==pe;var me=U,_e=I,he=j,ge=H,ye=W,ve=B,be=z,xe=null,we=k({},[].concat(q(E),q(S),q(L),q(D),q(R))),ke=null,Te=k({},[].concat(q(M),q(C),q(F),q(P))),Ae=null,Ee=null,Se=!0,Le=!0,Ne=!1,De=!1,Oe=!1,Re=!1,Me=!1,Ce=!1,Fe=!1,Pe=!0,Ue=!1,Ie=!0,je=!0,He=!1,ze={},We=k({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]),Be=null,Ge=k({},["audio","video","img","source","image","track"]),qe=null,Ve=k({},["alt","class","for","id","label","name","pattern","placeholder","summary","title","value","style","xmlns"]),Ye=null,Ke=o.createElement("form"),$e=function(e){Ye&&Ye===e||(e&&"object"===(void 0===e?"undefined":G(e))||(e={}),e=T(e),xe="ALLOWED_TAGS"in e?k({},e.ALLOWED_TAGS):we,ke="ALLOWED_ATTR"in e?k({},e.ALLOWED_ATTR):Te,qe="ADD_URI_SAFE_ATTR"in e?k(T(Ve),e.ADD_URI_SAFE_ATTR):Ve,Be="ADD_DATA_URI_TAGS"in e?k(T(Ge),e.ADD_DATA_URI_TAGS):Ge,Ae="FORBID_TAGS"in e?k({},e.FORBID_TAGS):{},Ee="FORBID_ATTR"in e?k({},e.FORBID_ATTR):{},ze="USE_PROFILES"in e&&e.USE_PROFILES,Se=!1!==e.ALLOW_ARIA_ATTR,Le=!1!==e.ALLOW_DATA_ATTR,Ne=e.ALLOW_UNKNOWN_PROTOCOLS||!1,De=e.SAFE_FOR_TEMPLATES||!1,Oe=e.WHOLE_DOCUMENT||!1,Ce=e.RETURN_DOM||!1,Fe=e.RETURN_DOM_FRAGMENT||!1,Pe=!1!==e.RETURN_DOM_IMPORT,Ue=e.RETURN_TRUSTED_TYPE||!1,Me=e.FORCE_BODY||!1,Ie=!1!==e.SANITIZE_DOM,je=!1!==e.KEEP_CONTENT,He=e.IN_PLACE||!1,be=e.ALLOWED_URI_REGEXP||be,De&&(Le=!1),Fe&&(Ce=!0),ze&&(xe=k({},[].concat(q(R))),ke=[],!0===ze.html&&(k(xe,E),k(ke,M)),!0===ze.svg&&(k(xe,S),k(ke,C),k(ke,P)),!0===ze.svgFilters&&(k(xe,L),k(ke,C),k(ke,P)),!0===ze.mathMl&&(k(xe,D),k(ke,F),k(ke,P))),e.ADD_TAGS&&(xe===we&&(xe=T(xe)),k(xe,e.ADD_TAGS)),e.ADD_ATTR&&(ke===Te&&(ke=T(ke)),k(ke,e.ADD_ATTR)),e.ADD_URI_SAFE_ATTR&&k(qe,e.ADD_URI_SAFE_ATTR),je&&(xe["#text"]=!0),Oe&&k(xe,["html","head","body"]),xe.table&&(k(xe,["tbody"]),delete Ae.tbody),i&&i(e),Ye=e)},Xe=k({},["mi","mo","mn","ms","mtext"]),Ze=k({},["foreignobject","desc","title","annotation-xml"]),Je=k({},S);k(Je,L),k(Je,N);var Qe=k({},D);k(Qe,O);var et="http://www.w3.org/1998/Math/MathML",tt="http://www.w3.org/2000/svg",nt="http://www.w3.org/1999/xhtml",rt=function(e){var t=ne(e);t&&t.tagName||(t={namespaceURI:nt,tagName:"template"});var n=_(e.tagName),r=_(t.tagName);if(e.namespaceURI===tt)return t.namespaceURI===nt?"svg"===n:t.namespaceURI===et?"svg"===n&&("annotation-xml"===r||Xe[r]):Boolean(Je[n]);if(e.namespaceURI===et)return t.namespaceURI===nt?"math"===n:t.namespaceURI===tt?"math"===n&&Ze[r]:Boolean(Qe[n]);if(e.namespaceURI===nt){if(t.namespaceURI===tt&&!Ze[r])return!1;if(t.namespaceURI===et&&!Xe[r])return!1;var o=k({},["title","style","font","a","script"]);return!Qe[n]&&(o[n]||!Je[n])}return!1},ot=function(e){m(n.removed,{element:e});try{e.parentNode.removeChild(e)}catch(t){try{e.outerHTML=ie}catch(t){e.remove()}}},it=function(e,t){try{m(n.removed,{attribute:t.getAttributeNode(e),from:t})}catch(e){m(n.removed,{attribute:null,from:t})}t.removeAttribute(e)},at=function(e){var t=void 0,n=void 0;if(Me)e="<remove></remove>"+e;else{var r=h(e,/^[\r\n\t ]+/);n=r&&r[0]}var i=oe?oe.createHTML(e):e;try{t=(new X).parseFromString(i,"text/html")}catch(e){}if(!t||!t.documentElement){var a=(t=le.createHTMLDocument("")).body;a.parentNode.removeChild(a.parentNode.firstElementChild),a.outerHTML=i}return e&&n&&t.body.insertBefore(o.createTextNode(n),t.body.childNodes[0]||null),ce.call(t,Oe?"html":"body")[0]},lt=function(e){return ue.call(e.ownerDocument||e,e,s.SHOW_ELEMENT|s.SHOW_COMMENT|s.SHOW_TEXT,(function(){return s.FILTER_ACCEPT}),!1)},ut=function(e){return!(e instanceof K||e instanceof $||"string"==typeof e.nodeName&&"string"==typeof e.textContent&&"function"==typeof e.removeChild&&e.attributes instanceof w&&"function"==typeof e.removeAttribute&&"function"==typeof e.setAttribute&&"string"==typeof e.namespaceURI&&"function"==typeof e.insertBefore)},ct=function(e){return"object"===(void 0===u?"undefined":G(u))?e instanceof u:e&&"object"===(void 0===e?"undefined":G(e))&&"number"==typeof e.nodeType&&"string"==typeof e.nodeName},st=function(e,t,r){de[e]&&p(de[e],(function(e){e.call(n,t,r,Ye)}))},ft=function(e){var t=void 0;if(st("beforeSanitizeElements",e,null),ut(e))return ot(e),!0;if(h(e.nodeName,/[\u0080-\uFFFF]/))return ot(e),!0;var r=_(e.nodeName);if(st("uponSanitizeElement",e,{tagName:r,allowedTags:xe}),!ct(e.firstElementChild)&&(!ct(e.content)||!ct(e.content.firstElementChild))&&b(/<[/\w]/g,e.innerHTML)&&b(/<[/\w]/g,e.textContent))return ot(e),!0;if(!xe[r]||Ae[r]){if(je&&!We[r])for(var o=ne(e),i=te(e),a=i.length-1;a>=0;--a)o.insertBefore(Q(i[a],!0),ee(e));return ot(e),!0}return e instanceof c&&!rt(e)?(ot(e),!0):"noscript"!==r&&"noembed"!==r||!b(/<\/no(script|embed)/i,e.innerHTML)?(De&&3===e.nodeType&&(t=e.textContent,t=g(t,me," "),t=g(t,_e," "),e.textContent!==t&&(m(n.removed,{element:e.cloneNode()}),e.textContent=t)),st("afterSanitizeElements",e,null),!1):(ot(e),!0)},pt=function(e,t,n){if(Ie&&("id"===t||"name"===t)&&(n in o||n in Ke))return!1;if(Le&&b(he,t));else if(Se&&b(ge,t));else{if(!ke[t]||Ee[t])return!1;if(qe[t]);else if(b(be,g(n,ve,"")));else if("src"!==t&&"xlink:href"!==t&&"href"!==t||"script"===e||0!==y(n,"data:")||!Be[e])if(Ne&&!b(ye,g(n,ve,"")));else if(n)return!1}return!0},dt=function(e){var t=void 0,r=void 0,o=void 0,i=void 0;st("beforeSanitizeAttributes",e,null);var a=e.attributes;if(a){var l={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:ke};for(i=a.length;i--;){var u=t=a[i],c=u.name,s=u.namespaceURI;if(r=v(t.value),o=_(c),l.attrName=o,l.attrValue=r,l.keepAttr=!0,l.forceKeepAttr=void 0,st("uponSanitizeAttribute",e,l),r=l.attrValue,!l.forceKeepAttr&&(it(c,e),l.keepAttr))if(b(/\/>/i,r))it(c,e);else{De&&(r=g(r,me," "),r=g(r,_e," "));var f=e.nodeName.toLowerCase();if(pt(f,o,r))try{s?e.setAttributeNS(s,c,r):e.setAttribute(c,r),d(n.removed)}catch(e){}}}st("afterSanitizeAttributes",e,null)}},mt=function e(t){var n=void 0,r=lt(t);for(st("beforeSanitizeShadowDOM",t,null);n=r.nextNode();)st("uponSanitizeShadowNode",n,null),ft(n)||(n.content instanceof a&&e(n.content),dt(n));st("afterSanitizeShadowDOM",t,null)};return n.sanitize=function(e,o){var i=void 0,l=void 0,c=void 0,s=void 0,f=void 0;if(e||(e="\x3c!--\x3e"),"string"!=typeof e&&!ct(e)){if("function"!=typeof e.toString)throw x("toString is not a function");if("string"!=typeof(e=e.toString()))throw x("dirty is not a string, aborting")}if(!n.isSupported){if("object"===G(t.toStaticHTML)||"function"==typeof t.toStaticHTML){if("string"==typeof e)return t.toStaticHTML(e);if(ct(e))return t.toStaticHTML(e.outerHTML)}return e}if(Re||$e(o),n.removed=[],"string"==typeof e&&(He=!1),He);else if(e instanceof u)1===(l=(i=at("\x3c!----\x3e")).ownerDocument.importNode(e,!0)).nodeType&&"BODY"===l.nodeName||"HTML"===l.nodeName?i=l:i.appendChild(l);else{if(!Ce&&!De&&!Oe&&-1===e.indexOf("<"))return oe&&Ue?oe.createHTML(e):e;if(!(i=at(e)))return Ce?null:ie}i&&Me&&ot(i.firstChild);for(var p=lt(He?e:i);c=p.nextNode();)3===c.nodeType&&c===s||ft(c)||(c.content instanceof a&&mt(c.content),dt(c),s=c);if(s=null,He)return e;if(Ce){if(Fe)for(f=se.call(i.ownerDocument);i.firstChild;)f.appendChild(i.firstChild);else f=i;return Pe&&(f=fe.call(r,f,!0)),f}var d=Oe?i.outerHTML:i.innerHTML;return De&&(d=g(d,me," "),d=g(d,_e," ")),oe&&Ue?oe.createHTML(d):d},n.setConfig=function(e){$e(e),Re=!0},n.clearConfig=function(){Ye=null,Re=!1},n.isValidAttribute=function(e,t,n){Ye||$e({});var r=_(e),o=_(t);return pt(r,o,n)},n.addHook=function(e,t){"function"==typeof t&&(de[e]=de[e]||[],m(de[e],t))},n.removeHook=function(e){de[e]&&d(de[e])},n.removeHooks=function(e){de[e]&&(de[e]=[])},n.removeAllHooks=function(){de={}},n}()}()},588:e=>{var t=function(e){"use strict";var t,n=Object.prototype,r=n.hasOwnProperty,o="function"==typeof Symbol?Symbol:{},i=o.iterator||"@@iterator",a=o.asyncIterator||"@@asyncIterator",l=o.toStringTag||"@@toStringTag";function u(e,t,n){return Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{u({},"")}catch(e){u=function(e,t,n){return e[t]=n}}function c(e,t,n,r){var o=t&&t.prototype instanceof h?t:h,i=Object.create(o.prototype),a=new L(r||[]);return i._invoke=function(e,t,n){var r=f;return function(o,i){if(r===d)throw new Error("Generator is already running");if(r===m){if("throw"===o)throw i;return D()}for(n.method=o,n.arg=i;;){var a=n.delegate;if(a){var l=A(a,n);if(l){if(l===_)continue;return l}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(r===f)throw r=m,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);r=d;var u=s(e,t,n);if("normal"===u.type){if(r=n.done?m:p,u.arg===_)continue;return{value:u.arg,done:n.done}}"throw"===u.type&&(r=m,n.method="throw",n.arg=u.arg)}}}(e,n,a),i}function s(e,t,n){try{return{type:"normal",arg:e.call(t,n)}}catch(e){return{type:"throw",arg:e}}}e.wrap=c;var f="suspendedStart",p="suspendedYield",d="executing",m="completed",_={};function h(){}function g(){}function y(){}var v={};v[i]=function(){return this};var b=Object.getPrototypeOf,x=b&&b(b(N([])));x&&x!==n&&r.call(x,i)&&(v=x);var w=y.prototype=h.prototype=Object.create(v);function k(e){["next","throw","return"].forEach((function(t){u(e,t,(function(e){return this._invoke(t,e)}))}))}function T(e,t){function n(o,i,a,l){var u=s(e[o],e,i);if("throw"!==u.type){var c=u.arg,f=c.value;return f&&"object"==typeof f&&r.call(f,"__await")?t.resolve(f.__await).then((function(e){n("next",e,a,l)}),(function(e){n("throw",e,a,l)})):t.resolve(f).then((function(e){c.value=e,a(c)}),(function(e){return n("throw",e,a,l)}))}l(u.arg)}var o;this._invoke=function(e,r){function i(){return new t((function(t,o){n(e,r,t,o)}))}return o=o?o.then(i,i):i()}}function A(e,n){var r=e.iterator[n.method];if(r===t){if(n.delegate=null,"throw"===n.method){if(e.iterator.return&&(n.method="return",n.arg=t,A(e,n),"throw"===n.method))return _;n.method="throw",n.arg=new TypeError("The iterator does not provide a 'throw' method")}return _}var o=s(r,e.iterator,n.arg);if("throw"===o.type)return n.method="throw",n.arg=o.arg,n.delegate=null,_;var i=o.arg;return i?i.done?(n[e.resultName]=i.value,n.next=e.nextLoc,"return"!==n.method&&(n.method="next",n.arg=t),n.delegate=null,_):i:(n.method="throw",n.arg=new TypeError("iterator result is not an object"),n.delegate=null,_)}function E(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function S(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function L(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(E,this),this.reset(!0)}function N(e){if(e){var n=e[i];if(n)return n.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,a=function n(){for(;++o<e.length;)if(r.call(e,o))return n.value=e[o],n.done=!1,n;return n.value=t,n.done=!0,n};return a.next=a}}return{next:D}}function D(){return{value:t,done:!0}}return g.prototype=w.constructor=y,y.constructor=g,g.displayName=u(y,l,"GeneratorFunction"),e.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===g||"GeneratorFunction"===(t.displayName||t.name))},e.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,y):(e.__proto__=y,u(e,l,"GeneratorFunction")),e.prototype=Object.create(w),e},e.awrap=function(e){return{__await:e}},k(T.prototype),T.prototype[a]=function(){return this},e.AsyncIterator=T,e.async=function(t,n,r,o,i){void 0===i&&(i=Promise);var a=new T(c(t,n,r,o),i);return e.isGeneratorFunction(n)?a:a.next().then((function(e){return e.done?e.value:a.next()}))},k(w),u(w,l,"Generator"),w[i]=function(){return this},w.toString=function(){return"[object Generator]"},e.keys=function(e){var t=[];for(var n in e)t.push(n);return t.reverse(),function n(){for(;t.length;){var r=t.pop();if(r in e)return n.value=r,n.done=!1,n}return n.done=!0,n}},e.values=N,L.prototype={constructor:L,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(S),!e)for(var n in this)"t"===n.charAt(0)&&r.call(this,n)&&!isNaN(+n.slice(1))&&(this[n]=t)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var n=this;function o(r,o){return l.type="throw",l.arg=e,n.next=r,o&&(n.method="next",n.arg=t),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],l=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var u=r.call(a,"catchLoc"),c=r.call(a,"finallyLoc");if(u&&c){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(u){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else{if(!c)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(e,t){for(var n=this.tryEntries.length-1;n>=0;--n){var o=this.tryEntries[n];if(o.tryLoc<=this.prev&&r.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===e||"continue"===e)&&i.tryLoc<=t&&t<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=e,a.arg=t,i?(this.method="next",this.next=i.finallyLoc,_):this.complete(a)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),_},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var n=this.tryEntries[t];if(n.finallyLoc===e)return this.complete(n.completion,n.afterLoc),S(n),_}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var n=this.tryEntries[t];if(n.tryLoc===e){var r=n.completion;if("throw"===r.type){var o=r.arg;S(n)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(e,n,r){return this.delegate={iterator:N(e),resultName:n,nextLoc:r},"next"===this.method&&(this.arg=t),_}},e}(e.exports);try{regeneratorRuntime=t}catch(e){Function("r","regeneratorRuntime = r")(t)}},220:()=>{}},t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={exports:{}};return e[r].call(o.exports,o,o.exports,n),o.exports}n.p="",(()=>{"use strict";var e,t,r,o,i={},a=[],l=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;function u(e,t){for(var n in t)e[n]=t[n];return e}function c(e){var t=e.parentNode;t&&t.removeChild(e)}function s(e,t,n){var r,o,i,a=arguments,l={};for(i in t)"key"==i?r=t[i]:"ref"==i?o=t[i]:l[i]=t[i];if(arguments.length>3)for(n=[n],i=3;i<arguments.length;i++)n.push(a[i]);if(null!=n&&(l.children=n),"function"==typeof e&&null!=e.defaultProps)for(i in e.defaultProps)void 0===l[i]&&(l[i]=e.defaultProps[i]);return f(e,l,r,o,null)}function f(t,n,r,o,i){var a={type:t,props:n,key:r,ref:o,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:null==i?++e.__v:i};return null!=e.vnode&&e.vnode(a),a}function p(e){return e.children}function d(e,t){this.props=e,this.context=t}function m(e,t){if(null==t)return e.__?m(e.__,e.__.__k.indexOf(e)+1):null;for(var n;t<e.__k.length;t++)if(null!=(n=e.__k[t])&&null!=n.__e)return n.__e;return"function"==typeof e.type?m(e):null}function _(e){var t,n;if(null!=(e=e.__)&&null!=e.__c){for(e.__e=e.__c.base=null,t=0;t<e.__k.length;t++)if(null!=(n=e.__k[t])&&null!=n.__e){e.__e=e.__c.base=n.__e;break}return _(e)}}function h(n){(!n.__d&&(n.__d=!0)&&t.push(n)&&!g.__r++||o!==e.debounceRendering)&&((o=e.debounceRendering)||r)(g)}function g(){for(var e;g.__r=t.length;)e=t.sort((function(e,t){return e.__v.__b-t.__v.__b})),t=[],e.some((function(e){var t,n,r,o,i,a;e.__d&&(i=(o=(t=e).__v).__e,(a=t.__P)&&(n=[],(r=u({},o)).__v=o.__v+1,A(a,o,r,t.__n,void 0!==a.ownerSVGElement,null!=o.__h?[i]:null,n,null==i?m(o):i,o.__h),E(n,o),o.__e!=i&&_(o)))}))}function y(e,t,n,r,o,l,u,c,s,d){var _,h,g,y,x,w,k,T=r&&r.__k||a,E=T.length;for(n.__k=[],_=0;_<t.length;_++)if(null!=(y=n.__k[_]=null==(y=t[_])||"boolean"==typeof y?null:"string"==typeof y||"number"==typeof y?f(null,y,null,null,y):Array.isArray(y)?f(p,{children:y},null,null,null):y.__b>0?f(y.type,y.props,y.key,null,y.__v):y)){if(y.__=n,y.__b=n.__b+1,null===(g=T[_])||g&&y.key==g.key&&y.type===g.type)T[_]=void 0;else for(h=0;h<E;h++){if((g=T[h])&&y.key==g.key&&y.type===g.type){T[h]=void 0;break}g=null}A(e,y,g=g||i,o,l,u,c,s,d),x=y.__e,(h=y.ref)&&g.ref!=h&&(k||(k=[]),g.ref&&k.push(g.ref,null,y),k.push(h,y.__c||x,y)),null!=x?(null==w&&(w=x),"function"==typeof y.type&&null!=y.__k&&y.__k===g.__k?y.__d=s=v(y,s,e):s=b(e,y,g,T,x,s),d||"option"!==n.type?"function"==typeof n.type&&(n.__d=s):e.value=""):s&&g.__e==s&&s.parentNode!=e&&(s=m(g))}for(n.__e=w,_=E;_--;)null!=T[_]&&("function"==typeof n.type&&null!=T[_].__e&&T[_].__e==n.__d&&(n.__d=m(r,_+1)),N(T[_],T[_]));if(k)for(_=0;_<k.length;_++)L(k[_],k[++_],k[++_])}function v(e,t,n){var r,o;for(r=0;r<e.__k.length;r++)(o=e.__k[r])&&(o.__=e,t="function"==typeof o.type?v(o,t,n):b(n,o,o,e.__k,o.__e,t));return t}function b(e,t,n,r,o,i){var a,l,u;if(void 0!==t.__d)a=t.__d,t.__d=void 0;else if(null==n||o!=i||null==o.parentNode)e:if(null==i||i.parentNode!==e)e.appendChild(o),a=null;else{for(l=i,u=0;(l=l.nextSibling)&&u<r.length;u+=2)if(l==o)break e;e.insertBefore(o,i),a=i}return void 0!==a?a:o.nextSibling}function x(e,t,n){"-"===t[0]?e.setProperty(t,n):e[t]=null==n?"":"number"!=typeof n||l.test(t)?n:n+"px"}function w(e,t,n,r,o){var i;e:if("style"===t)if("string"==typeof n)e.style.cssText=n;else{if("string"==typeof r&&(e.style.cssText=r=""),r)for(t in r)n&&t in n||x(e.style,t,"");if(n)for(t in n)r&&n[t]===r[t]||x(e.style,t,n[t])}else if("o"===t[0]&&"n"===t[1])i=t!==(t=t.replace(/Capture$/,"")),t=t.toLowerCase()in e?t.toLowerCase().slice(2):t.slice(2),e.l||(e.l={}),e.l[t+i]=n,n?r||e.addEventListener(t,i?T:k,i):e.removeEventListener(t,i?T:k,i);else if("dangerouslySetInnerHTML"!==t){if(o)t=t.replace(/xlink[H:h]/,"h").replace(/sName$/,"s");else if("href"!==t&&"list"!==t&&"form"!==t&&"download"!==t&&t in e)try{e[t]=null==n?"":n;break e}catch(e){}"function"==typeof n||(null!=n&&(!1!==n||"a"===t[0]&&"r"===t[1])?e.setAttribute(t,n):e.removeAttribute(t))}}function k(t){this.l[t.type+!1](e.event?e.event(t):t)}function T(t){this.l[t.type+!0](e.event?e.event(t):t)}function A(t,n,r,o,i,a,l,c,s){var f,m,_,h,g,v,b,x,w,k,T,A=n.type;if(void 0!==n.constructor)return null;null!=r.__h&&(s=r.__h,c=n.__e=r.__e,n.__h=null,a=[c]),(f=e.__b)&&f(n);try{e:if("function"==typeof A){if(x=n.props,w=(f=A.contextType)&&o[f.__c],k=f?w?w.props.value:f.__:o,r.__c?b=(m=n.__c=r.__c).__=m.__E:("prototype"in A&&A.prototype.render?n.__c=m=new A(x,k):(n.__c=m=new d(x,k),m.constructor=A,m.render=D),w&&w.sub(m),m.props=x,m.state||(m.state={}),m.context=k,m.__n=o,_=m.__d=!0,m.__h=[]),null==m.__s&&(m.__s=m.state),null!=A.getDerivedStateFromProps&&(m.__s==m.state&&(m.__s=u({},m.__s)),u(m.__s,A.getDerivedStateFromProps(x,m.__s))),h=m.props,g=m.state,_)null==A.getDerivedStateFromProps&&null!=m.componentWillMount&&m.componentWillMount(),null!=m.componentDidMount&&m.__h.push(m.componentDidMount);else{if(null==A.getDerivedStateFromProps&&x!==h&&null!=m.componentWillReceiveProps&&m.componentWillReceiveProps(x,k),!m.__e&&null!=m.shouldComponentUpdate&&!1===m.shouldComponentUpdate(x,m.__s,k)||n.__v===r.__v){m.props=x,m.state=m.__s,n.__v!==r.__v&&(m.__d=!1),m.__v=n,n.__e=r.__e,n.__k=r.__k,m.__h.length&&l.push(m);break e}null!=m.componentWillUpdate&&m.componentWillUpdate(x,m.__s,k),null!=m.componentDidUpdate&&m.__h.push((function(){m.componentDidUpdate(h,g,v)}))}m.context=k,m.props=x,m.state=m.__s,(f=e.__r)&&f(n),m.__d=!1,m.__v=n,m.__P=t,f=m.render(m.props,m.state,m.context),m.state=m.__s,null!=m.getChildContext&&(o=u(u({},o),m.getChildContext())),_||null==m.getSnapshotBeforeUpdate||(v=m.getSnapshotBeforeUpdate(h,g)),T=null!=f&&f.type===p&&null==f.key?f.props.children:f,y(t,Array.isArray(T)?T:[T],n,r,o,i,a,l,c,s),m.base=n.__e,n.__h=null,m.__h.length&&l.push(m),b&&(m.__E=m.__=null),m.__e=!1}else null==a&&n.__v===r.__v?(n.__k=r.__k,n.__e=r.__e):n.__e=S(r.__e,n,r,o,i,a,l,s);(f=e.diffed)&&f(n)}catch(t){n.__v=null,(s||null!=a)&&(n.__e=c,n.__h=!!s,a[a.indexOf(c)]=null),e.__e(t,n,r)}}function E(t,n){e.__c&&e.__c(n,t),t.some((function(n){try{t=n.__h,n.__h=[],t.some((function(e){e.call(n)}))}catch(t){e.__e(t,n.__v)}}))}function S(e,t,n,r,o,l,u,s){var f,p,d,m,_,h=n.props,g=t.props,v=t.type;if("svg"===v&&(o=!0),null!=l)for(f=0;f<l.length;f++)if(null!=(p=l[f])&&(e==p||p.localName==v)){e=p,l[f]=null;break}if(null==e){if(null===v)return document.createTextNode(g);e=o?document.createElementNS("http://www.w3.org/2000/svg",v):document.createElement(v,g.is&&g),l=null,s=!1}if(null===v)h===g||s&&e.data===g||(e.data=g);else{if(null!=l&&(l=a.slice.call(e.childNodes)),d=(h=n.props||i).dangerouslySetInnerHTML,m=g.dangerouslySetInnerHTML,!s){if(null!=l)for(h={},_=0;_<e.attributes.length;_++)h[e.attributes[_].name]=e.attributes[_].value;(m||d)&&(m&&(d&&m.__html==d.__html||m.__html===e.innerHTML)||(e.innerHTML=m&&m.__html||""))}if(function(e,t,n,r,o){var i;for(i in n)"children"===i||"key"===i||i in t||w(e,i,null,n[i],r);for(i in t)o&&"function"!=typeof t[i]||"children"===i||"key"===i||"value"===i||"checked"===i||n[i]===t[i]||w(e,i,t[i],n[i],r)}(e,g,h,o,s),m)t.__k=[];else if(f=t.props.children,y(e,Array.isArray(f)?f:[f],t,n,r,o&&"foreignObject"!==v,l,u,e.firstChild,s),null!=l)for(f=l.length;f--;)null!=l[f]&&c(l[f]);s||("value"in g&&void 0!==(f=g.value)&&(f!==e.value||"progress"===v&&!f)&&w(e,"value",f,h.value,!1),"checked"in g&&void 0!==(f=g.checked)&&f!==e.checked&&w(e,"checked",f,h.checked,!1))}return e}function L(t,n,r){try{"function"==typeof t?t(n):t.current=n}catch(t){e.__e(t,r)}}function N(t,n,r){var o,i,a;if(e.unmount&&e.unmount(t),(o=t.ref)&&(o.current&&o.current!==t.__e||L(o,null,n)),r||"function"==typeof t.type||(r=null!=(i=t.__e)),t.__e=t.__d=void 0,null!=(o=t.__c)){if(o.componentWillUnmount)try{o.componentWillUnmount()}catch(t){e.__e(t,n)}o.base=o.__P=null}if(o=t.__k)for(a=0;a<o.length;a++)o[a]&&N(o[a],n,r);null!=i&&c(i)}function D(e,t,n){return this.constructor(e,n)}e={__e:function(e,t){for(var n,r,o;t=t.__;)if((n=t.__c)&&!n.__)try{if((r=n.constructor)&&null!=r.getDerivedStateFromError&&(n.setState(r.getDerivedStateFromError(e)),o=n.__d),null!=n.componentDidCatch&&(n.componentDidCatch(e),o=n.__d),o)return n.__E=n}catch(t){e=t}throw e},__v:0},d.prototype.setState=function(e,t){var n;n=null!=this.__s&&this.__s!==this.state?this.__s:this.__s=u({},this.state),"function"==typeof e&&(e=e(u({},n),this.props)),e&&u(n,e),null!=e&&this.__v&&(t&&this.__h.push(t),h(this))},d.prototype.forceUpdate=function(e){this.__v&&(this.__e=!0,e&&this.__h.push(e),h(this))},d.prototype.render=p,t=[],r="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,g.__r=0,n(264),n(564),n(199);var O,R,M,C="undefined"!=typeof document&&"undefined"!=typeof window,F=C?navigator.userAgent||navigator.vendor||window.opera:null;C&&(/(iPad|iPhone|iPod)/i.test(F)||/Android/i.test(F)||/Windows Phone/i.test(F)),C&&document.body.isEqualNode,function(){if(C){var e=document.createElement("fakeelement"),t={transition:"transitionend",OTransition:"oTransitionEnd",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"};Object.keys(t).find((function(t){return void 0!==e.style[t]}))}}(),function(){if(C){var e=document.createElement("fakeelement"),t={animation:"animationend",OAnimation:"oAnimationEnd",MozAnimation:"animationend",WebkitAnimation:"webkitAnimationEnd"};Object.keys(t).find((function(t){return void 0!==e.style[t]}))}}(),C&&navigator.share,O={},R={},M={};const P=n.p+"img/binance__logo.svg",U=n.p+"img/kucoin__logo.svg",I=n.p+"img/huobi__logo.svg",j=n.p+"img/gateio__logo.svg";n(220);var H,z=(H=P,void 0!==chrome.runtime.getURL?chrome.runtime.getURL(H):H);!function(t,n,r){var o,l,u;e.__&&e.__(t,n),l=(o="function"==typeof r)?null:r&&r.__k||n.__k,u=[],A(n,t=(!o&&r||n).__k=s(p,null,[t]),l||i,i,void 0!==n.ownerSVGElement,!o&&r?[r]:l?null:n.firstChild?a.slice.call(n.childNodes):null,u,!o&&r?r:l?l.__e:n.firstChild,o),E(u,t)}(s((function(){return s("div",null,s("div",{className:"bb-u-text__align--center bb-u-padding-1x bb-u-fSize-3 bb-u-lineHeight--readable bb-u-margin-bottom-1x"},s("span",{className:"bb-u-text--nowrap"},"See this extension in action at"),s("br",null),s("a",{href:"https://www.binance.com/en/trade/BTC_USDT",target:"_blank",rel:"noreferrer noopener nofollow",className:"bb-c-btn bb-c-btn--outline bb-c-btn--tiny bb-u-text--boldWeight bb-u-margin-right-2x bb-u-margin-vertical-1x"},s("div",{className:"bb-u-disp--flex bb-u-flex__align--center bb-u-flex__justify--center"},s("img",{src:z,height:"20",alt:"Binance",className:"bb-u-margin-right-small"}),"Binance")),s("a",{href:"https://www.gate.io/trade/BTC_USDT",target:"_blank",rel:"noreferrer noopener nofollow",className:"bb-c-btn bb-c-btn--outline bb-c-btn--tiny bb-u-text--boldWeight bb-u-margin-right-2x bb-u-margin-vertical-1x"},s("div",{className:"bb-u-disp--flex bb-u-flex__align--center bb-u-flex__justify--center"},s("img",{src:j,height:"20",alt:"Gateio",className:"bb-u-margin-right-small"}),"Gate.io")),s("a",{href:"https://trade.kucoin.com/spot",target:"_blank",rel:"noreferrer noopener nofollow",className:"bb-c-btn bb-c-btn--outline bb-c-btn--tiny bb-u-text--boldWeight bb-u-margin-right-2x"},s("div",{className:"bb-u-disp--flex bb-u-flex__align--center bb-u-flex__justify--center"},s("img",{src:U,height:"20",alt:"kucoin",className:"bb-u-margin-right-small"}),"Kucoin")),s("a",{href:"https://www.hbg.com/en-us/exchange/xrp_usdt/",target:"_blank",rel:"noreferrer noopener nofollow",className:"bb-c-btn bb-c-btn--outline bb-c-btn--tiny bb-u-text--boldWeight bb-u-margin-right-2x"},s("div",{className:"bb-u-disp--flex bb-u-flex__align--center bb-u-flex__justify--center"},s("img",{src:I,height:"20",alt:"huobi",className:"bb-u-margin-right-small"}),"Huobi"))),s("div",{className:"bb-u-text__align--center bb-u-padding-1x bb-u-disp--flex bb-u-flex__align--center bb-u-flex__justify--center bb-u-text--lighter"},s("a",{href:"https://bitbns.com/?utm_source=chromePopupBx&utm_medium=extension",target:"_blank",rel:"noreferrer noopener nofollow",className:"bb-u-margin-right-small"},s("img",{src:"./img/bitbns--dark.svg",height:"20",alt:"Bitbns"})),"©",(new Date).getFullYear()))}),null),document.getElementById("popup"))})()})();