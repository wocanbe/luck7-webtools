/*!
* Copyright 584069777@qq.com 2019.
*/
define(["babel-runtime/core-js/promise","babel-runtime/helpers/classCallCheck","babel-runtime/helpers/createClass","babel-runtime/core-js/symbol"],function(a,r,t,e){"use strict";a=a&&a.hasOwnProperty("default")?a.default:a,r=r&&r.hasOwnProperty("default")?r.default:r,t=t&&t.hasOwnProperty("default")?t.default:t,e=e&&e.hasOwnProperty("default")?e.default:e;var n=require("lodash/isString"),s=require("lodash/isArray"),o=require("lodash/isRegExp"),u=e("authConfig"),h=e("initStatus"),f=[];function l(t,e){var i=!1;if(s(e)){for(var r in e)if(i=l(t,e[r]))break}else o(e)?i=e.test(t):n(e)&&(i=e===t);return i}return function(){function i(t){var e=this;r(this,i),t instanceof a?(this[h]=!1,t.then(function(t){e.init(t)})):this.init(t)}return t(i,[{key:"init",value:function(t){var i=this,e={whiteList:["/login"],roles:{}},r=t.whiteList,n=t.roles;r&&(r instanceof a?r.then(function(t){e.whiteList=t}).catch(function(t){throw t}):e.whiteList=r),n&&(n instanceof a?n.then(function(t){e.roles=t}).catch(function(t){throw t}):e.roles=n),this[u]=e,this[h]=!0;for(var s=function(){var e=f.shift();i.getAuth(e.path).then(function(t){e.ready(t)}).catch(function(t){e.error(t)})};0<f.length;)s()}},{key:"getAuth",value:function(i){if(this[h]){if(l(i,this[u].whiteList))return a.resolve(!0);var t=[];for(var e in this[u].roles){l(i,this[u].roles[e])&&t.push(e)}return a.resolve(t)}return new a(function(t,e){f.push({status:"waiting",path:i,ready:t,error:e})})}}]),i}()});