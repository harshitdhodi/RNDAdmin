import{b as j}from"./react-DKICu8bO.js";var S={exports:{}},p={};/**
 * @license React
 * use-sync-external-store-with-selector.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var E;function O(){if(E)return p;E=1;var o=j();function y(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var W=typeof Object.is=="function"?Object.is:y,_=o.useSyncExternalStore,R=o.useRef,V=o.useEffect,w=o.useMemo,g=o.useDebugValue;return p.useSyncExternalStoreWithSelector=function(e,t,a,v,c){var n=R(null);if(n.current===null){var u={hasValue:!1,value:null};n.current=u}else u=n.current;n=w(function(){function d(r){if(!x){if(x=!0,f=r,r=v(r),c!==void 0&&u.hasValue){var i=u.value;if(c(i,r))return s=i}return s=r}if(i=s,W(f,r))return i;var m=v(r);return c!==void 0&&c(i,m)?i:(f=r,s=m)}var x=!1,f,s,h=a===void 0?null:a;return[function(){return d(t())},h===null?void 0:function(){return d(h())}]},[t,a,v,c]);var l=_(e,n[0],n[1]);return V(function(){u.hasValue=!0,u.value=l},[l]),g(l),l},p}var q;function U(){return q||(q=1,S.exports=O()),S.exports}var D=U();export{D as w};
