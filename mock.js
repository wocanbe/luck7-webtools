/*!
* Copyright 584069777@qq.com 2019.
*/
define(["babel-runtime/core-js/promise","wurl"],function(e,t){"use strict";e=e&&e.hasOwnProperty("default")?e.default:e,t=t&&t.hasOwnProperty("default")?t.default:t;var i=void 0;function o(u){var s=t("hostname",u.url)+t("path",u.url);return new e(function(t,e){try{var o=i("."+s+".js").default;if(o){console.info("Use mock:","@/mock"+s+".js");var r=u.timeout||24e4,n=o.time_cost||0;n<r?setTimeout(function(){200<=o.status&&o.status<300?t(o):e(o)},n):setTimeout(function(){e(new Error("timeout of "+r+"ms exceeded"))},r)}else t(u)}catch(e){t(u)}})}return function(e){"development"===process.env.NODE_ENV&&(i=require.context("@/mock",!0,/\.js$/),e.interceptors.request.use(o))}});
