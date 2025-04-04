import{h as t,j as e}from"./main-DeRxjK88.js";import{r as a}from"./vendor-router-Bu4EHm1B.js";import{a as s}from"./vendor-utils-BfOc9lHv.js";
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l=t("Minus",[["path",{d:"M5 12h14",key:"1ays0h"}]]);function i(){const[t,l]=a.useState([]),[i,o]=a.useState(0);return a.useEffect((()=>{(async()=>{try{const t=await s.get("/api/slideShow/getAll");t.data&&l(t.data.map((t=>({url:`/api/logo/download/${t.image}`,altText:t.altText||"Slideshow Image",title:t.title||t.altText||"Slideshow Image"}))))}catch(t){}})()}),[]),a.useEffect((()=>{if(t.length>0){const e=setInterval((()=>{o((e=>(e+1)%t.length))}),3e3);return()=>clearInterval(e)}}),[i,t.length]),e.jsx("div",{className:"w-62 relative h-[55vh] overflow-hidden",children:t.length>0?t.map(((t,a)=>e.jsx("img",{src:t.url,alt:t.altText,title:t.title,className:"w-full h-full absolute object-cover transition-opacity duration-1000 ease-in-out "+(a===i?"opacity-100":"opacity-0")},a))):e.jsx("p",{className:"text-center text-gray-500",children:"Loading images..."})})}export{l as M,i as P};
//# sourceMappingURL=PromoSidebar-CfNtERmp.js.map
