import{N as e}from"./NotificationsClass.1488b90c.js";import{d as a,l,C as o,m as s,G as t,o as i,c as d,a as n,E as r,j as c,N as u}from"./index.3d8eecac.js";import{_ as v}from"./_plugin-vue_export-helper.cdc0426e.js";const p=v(a({__name:"MyDialogC",props:{animateDirection:{type:String,default:()=>"top"},disabled:{type:Boolean,default:()=>!1}},setup(a,{expose:v}){const p=a,m=l(!1),f=l(),y=l(),g=l(!1);async function w(){p.disabled||(m.value=!0,await u(),g.value=!0,y.value&&(y.value.classList.add(`w3-animate-${p.animateDirection}`),f.value.style.display="block",t.dialogGlobOpen.value=!0))}function h(){f.value&&(f.value.style.display="none"),m.value=!1}return o(y,(a=>{e.isShowing()||h()})),s((()=>t.dialogGlobOpen.value),(()=>{t.dialogGlobOpen.value||h()})),v({closeModal:h}),(e,a)=>(i(),d("div",null,[n("div",{onClick:w},[r(e.$slots,"trigger",{},void 0,!0)]),m.value?(i(),d("div",{key:0,ref_key:"modal",ref:f,class:"w3-modal blur",style:{"max-height":"100vh",overflow:"hidden"}},[n("div",{id:"modals",ref_key:"content",ref:y,class:"w3-modal-content w3-card-4 w3-theme w3-round-large w3-padding-small w3-border-theme",style:{"max-height":"85vh",overflow:"auto"}},[r(e.$slots,"content",{style:"overflow: auto"},void 0,!0)],512)],512)):c("",!0)]))}}),[["__scopeId","data-v-a66be0a5"]]);export{p as _};