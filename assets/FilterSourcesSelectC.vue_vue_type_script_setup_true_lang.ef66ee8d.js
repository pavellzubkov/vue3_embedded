import{d as e,l as a,C as t,o as l,c as s,a as o,E as r,b as n,w as d,j as i,k as c,P as u,g as p,J as v,e as m,t as w,u as g,F as f,r as b,H as y,I as h}from"./index.3861adcb.js";import{b as _}from"./NotificationsClass.9d659df0.js";const x={key:0,class:"w3-dropdown-content w3-card w3-round w3-show animate__faster w3-theme-l4",style:{height:"180px",width:"200px","overflow-y":"auto","overflow-x":"hidden"}},k=e({__name:"MySelectC",setup(e,{expose:u}){const p=a(!1),v=a(),m=()=>{p.value=!p.value};return t(v,(e=>{p.value=!1})),u({toggleVis:m}),(e,a)=>(l(),s("div",{class:"w3-dropdown-click",ref_key:"content",ref:v},[o("div",{onClick:m,style:{position:"relative"}},[r(e.$slots,"trigget")]),n(c,{appear:"","enter-active-class":"animate__animated animate__fadeInUp","leave-active-class":"animate__animated animate__fadeOutDown",mode:"out-in"},{default:d((()=>[p.value?(l(),s("div",x,[r(e.$slots,"options",{class:"w3-bar w3-bar-block"})])):i("",!0)])),_:3})],512))}}),A={class:"w3-button w3-border w3-round padding-2"},V={class:"w3-ul w3-hover-border-theme",style:{"min-width":"180px"}},C={class:"w3-display-left"},S=["onUpdate:modelValue","onChange"],j={class:"w3-padding-small"},E=e({__name:"FilterSourcesSelectC",props:{modelValue:{type:Array,reqired:!0,default:()=>[]},butText:{type:String,default:()=>"Источники"},onlyOne:{type:Boolean,default:!1}},emits:["update:modelValue"],setup(e,{emit:t}){const r=e,i=u(r,"modelValue",t),c=a("alarm"),x=a(),E=p((()=>v.availableEcus.value.map((e=>(e.selected=-1!==i.value.findIndex((a=>a===e.srcAdr)),e))))),I=p((()=>{let e="все";c.value="ok";const a=E.value.filter((e=>e.selected)).length;return 0===a||a===E.value.length||(e=a.toString(),c.value="warn"),e}));return(a,t)=>{const u=_,p=k;return l(),m(p,{ref_key:"select",ref:x},{trigget:d((()=>[o("button",A,w(e.butText),1),n(u,{"badge-text":g(I),"text-right-proc":-20,"text-top-proc":-20,"badge-type":c.value},null,8,["badge-text","badge-type"])])),options:d((()=>[o("ul",V,[(l(!0),s(f,null,b(g(E),(e=>(l(),s("li",{key:e.srcAdr,class:"w3-display-container w3-border-0 w3-margin"},[o("div",C,[y(o("input",{class:"w3-check w3-theme",type:"checkbox","onUpdate:modelValue":a=>e.selected=a,onChange:a=>(e=>{const a=E.value.filter((e=>e.selected));if(r.onlyOne){if(e.selected)return 1!=a.length&&E.value.forEach((a=>{a.selected=a.srcAdr===e.srcAdr})),i.value=[e.srcAdr],void x.value.toggleVis();i.value=[],x.value.toggleVis()}else i.value=a.map((e=>e.srcAdr))})(e)},null,40,S),[[h,e.selected]]),o("label",j,w(e.srcAdr)+" ("+w(e.alias)+")",1)])])))),128))])])),_:1},512)}}});export{k as _,E as a};