/*!
* Copyright 584069777@qq.com 2019.
*/
define(["babel-runtime/helpers/classCallCheck","babel-runtime/helpers/createClass","babel-runtime/helpers/defineProperty","babel-runtime/core-js/symbol","lodash/isString","lodash/isFunction"],function(l,e,u,t,d,s){"use strict";l=l&&l.hasOwnProperty("default")?l.default:l,e=e&&e.hasOwnProperty("default")?e.default:e,u=u&&u.hasOwnProperty("default")?u.default:u,t=t&&t.hasOwnProperty("default")?t.default:t,d=d&&d.hasOwnProperty("default")?d.default:d,s=s&&s.hasOwnProperty("default")?s.default:s;var f=t(),o=t(),v=t(),h=0;return function(){function r(){var e,t,d,n,a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:window,i=1<arguments.length&&void 0!==arguments[1]?arguments[1]:"lyData";l(this,r),this[o]=i,this[v]={},window.rrrrr=this[v],e=a,t=i,d=this[v],n=function(e){var t=e.detail,n=t.eventType,a=t.data;if(d[n]){var i=d[n];for(var r in i)i[r].fun(a),i[r].once&&delete i[r]}},e.bindEvent?(e.bindEvent[t]&&e.removeEventListener(t,e.bindEvent[t]),e.bindEvent[t]=n):e.bindEvent=u({},t,n),e.addEventListener(t,n),this[f]=a}return e(r,[{key:"addListener",value:function(e,t,n){var a="domEvent"+ ++h,i=void 0,r=void 0;return r=1===arguments.length?(i="default",{fun:e}):2===arguments.length?(i=e||"default",{fun:t}):(i=e||"default",{once:n,fun:t}),this[v][i]?this[v][i][a]=r:this[v][i]=u({},a,r),a}},{key:"removeListener",value:function(e,t){var n=void 0,a=void 0;a=1===arguments.length?(n="default",e):(n=e,t);var i=this[v][n];if(s(a))for(var r in i)if(i[r].fun===a){a=r;break}d(a)&&delete i[a]}},{key:"dispatch",value:function(e,t){var n={};1===arguments.length?(n.eventType="default",n.data=e):2===arguments.length&&(n.eventType=e||"default",n.data=t),this[f].dispatchEvent(new CustomEvent(this[o],{detail:n}))}}]),r}()});
