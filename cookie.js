/*!
* Copyright 584069777@qq.com 2019.
*/
define(["babel-runtime/helpers/classCallCheck","babel-runtime/helpers/createClass"],function(t,n){"use strict";return t=t&&t.hasOwnProperty("default")?t.default:t,n=n&&n.hasOwnProperty("default")?n.default:n,function(){function e(){t(this,e)}return n(e,[{key:"get",value:function(t){var e=document.cookie.split(";").find(function(e){return 0===e.trim().indexOf(t+"=")});return e?unescape(e.trim().replace(t+"=","")):void 0}},{key:"set",value:function(e,t,n){var a,i,r,s,o,u,c=e+"="+escape(t);n&&(n.expires&&(c+=";expires="+(a=n.expires,i=new Date,r=a.match(/(\d+)[dD]/),s=/(\d+)[hH]/.exec(a),o=a.match(/(\d+)[mM]/),u=a.match(/(\d+)[sS]/),r&&i.setDate(i.getDate()+parseInt(r[1])),s&&i.setHours(i.getHours()+parseInt(s[1])),o&&i.setMinutes(i.getMinutes()+parseInt(o[1])),u&&i.setSeconds(i.getSeconds()+parseInt(u[1])),i.toGMTString())),n.path&&(c+=";path="+n.path),n.domain&&(c+=";domain="+n.domain)),document.cookie=c}},{key:"del",value:function(e,t){var n=new Date;n.setTime(n.getTime()-1);var a=e+"=d;expires="+n.toGMTString();t&&(t.path&&(a+=";path="+t.path),t.domain&&(a+=";domain="+t.domain)),document.cookie=a}}]),e}()});
