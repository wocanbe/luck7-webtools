/*!
* Copyright 584069777@qq.com 2019.
*/
define(["lodash/memoize","hash-sum"],function(a,r){"use strict";return a=a&&a.hasOwnProperty("default")?a.default:a,r=r&&r.hasOwnProperty("default")?r.default:r,function(e,t){var h=a(e,function(){return"r"});h.cache.set("k",[]);var u=function(){var e=(new Date).getTime(),t=r(arguments),a=h.cache.get(t);if(a&&a.t>=e)return a.r;var c=h.apply(void 0,arguments);return function(e,t){var a=h.cache.get("k"),c=[e];for(var r in a){var n=a[r];n!==e&&(h.cache.get(n).t<t?h.cache.delete(n):c.push(n))}h.cache.set("k",c),h.cache.set(e,{r:h.cache.get("r"),t:t+u.catchTime}),h.cache.delete("r")}(t,e),c};return u.catchTime=t,u}});
