(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-7f26a8c5"],{"3a66":function(t,i,e){"use strict";e.d(i,"a",(function(){return o}));var n=e("fe6c"),s=e("58df");function o(t){var i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[];return Object(s["a"])(Object(n["b"])(["absolute","fixed"])).extend({name:"applicationable",props:{app:Boolean},computed:{applicationProperty:function(){return t}},watch:{app:function(t,i){i?this.removeApplication(!0):this.callUpdate()},applicationProperty:function(t,i){this.$vuetify.application.unregister(this._uid,i)}},activated:function(){this.callUpdate()},created:function(){for(var t=0,e=i.length;t<e;t++)this.$watch(i[t],this.callUpdate);this.callUpdate()},mounted:function(){this.callUpdate()},deactivated:function(){this.removeApplication()},destroyed:function(){this.removeApplication()},methods:{callUpdate:function(){this.app&&this.$vuetify.application.register(this._uid,this.applicationProperty,this.updateApplication())},removeApplication:function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];(t||this.app)&&this.$vuetify.application.unregister(this._uid,this.applicationProperty)},updateApplication:function(){return 0}}})}},7958:function(t,i,e){},"9d47":function(t,i,e){"use strict";e.r(i);var n=function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("v-app",{staticClass:"blue-grey lighten-5"},[e("TheSidebar",{attrs:{showsidebar:t.drawer}}),e("v-main",[e("v-container",{attrs:{fluid:""}},[e("router-view",{key:t.$route.fullPath})],1)],1),e("TheFooter")],1)},s=[],o=function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("v-navigation-drawer",{attrs:{"mini-variant":t.minify,color:"blue-grey darken-3",app:"",dark:"",permanent:"",width:"200"},scopedSlots:t._u([{key:"append",fn:function(){return[e("v-list-item",{on:{click:function(){return t.$router.push({name:"ManageUsers"}).catch((function(){}))}}},[e("v-list-item-action",[e("v-icon",{attrs:{color:"blue lighten-3"}},[t._v("mdi-account-settings")])],1),e("v-list-item-content",[e("v-list-item-title",[t._v("Manage Users")])],1)],1),e("v-list-item",{staticClass:"float-right",attrs:{"justify-end":""}},[e("v-list-item-action",[e("v-icon",{staticClass:"mt-4",attrs:{color:"green lighten-3"},on:{click:function(i){t.minify=!t.minify}}},[t._v(" "+t._s(t.minify?"mdi-chevron-double-right":"mdi-chevron-double-left")+" ")])],1)],1)]},proxy:!0}])},[e("v-list",{attrs:{dense:""}},[e("v-list-item",{on:{click:function(){return t.$router.push({name:"DashBoard"}).catch((function(){}))}}},[e("v-list-item-action",[e("v-icon",{attrs:{color:"blue lighten-3"}},[t._v("mdi-speedometer")])],1),e("v-list-item-content",[e("v-list-item-title",[t._v("DashBoard")])],1)],1),e("v-list-item",{on:{click:function(){return t.$router.push({name:"Dvi",params:{ccyPair:t.activeCross}}).catch((function(){}))}}},[e("v-list-item-action",[e("v-icon",{attrs:{color:"blue lighten-3"}},[t._v("mdi-apps")])],1),e("v-list-item-content",[e("v-list-item-title",[t._v("Dvi")])],1)],1),e("v-list-item",{on:{click:function(){return t.$router.push({name:"Pricer",params:{viewName:t.pricerTab}}).catch((function(){}))}}},[e("v-list-item-action",[e("v-icon",{attrs:{color:"blue lighten-3"}},[t._v("mdi-calculator")])],1),e("v-list-item-content",[e("v-list-item-title",[t._v("Pricer")])],1)],1),e("v-list-item",{on:{click:function(){return t.$router.push({name:"Charts"}).catch((function(){}))}}},[e("v-list-item-action",[e("v-icon",{attrs:{color:"blue lighten-3"}},[t._v("mdi-chart-line")])],1),e("v-list-item-content",[e("v-list-item-title",[t._v("Charts")])],1)],1),e("v-list-item",{on:{click:function(){return t.$router.push({name:"FxRates"}).catch((function(){}))}}},[e("v-list-item-action",[e("v-icon",{attrs:{color:"blue lighten-3"}},[t._v("mdi-currency-usd")])],1),e("v-list-item-content",[e("v-list-item-title",[t._v("Fx Rates")])],1)],1),e("v-list-item",{on:{click:function(){return t.$router.push({name:"DayWgtSetup"}).catch((function(){}))}}},[e("v-list-item-action",[e("v-icon",{attrs:{color:"blue lighten-3"}},[t._v("mdi-calendar-clock")])],1),e("v-list-item-content",[e("v-list-item-title",[t._v("Day Wgt Setup")])],1)],1),e("v-list-item",{on:{click:function(){return t.$router.push({name:"Settings"}).catch((function(){}))}}},[e("v-list-item-action",[e("v-icon",{attrs:{color:"blue lighten-3"}},[t._v("mdi-cog")])],1),e("v-list-item-content",[e("v-list-item-title",[t._v("Settings")])],1)],1),e("v-list-item",{on:{click:t.logout}},[e("v-list-item-action",[e("v-icon",{attrs:{color:"blue lighten-3"}},[t._v("mdi-exit-to-app")])],1),e("v-list-item-content",[e("v-list-item-title",[t._v("Log Out")])],1)],1)],1)],1)},a=[],r={name:"TheSidebar",data:function(){return{minify:!0}},components:{},props:{showsidebar:{type:Boolean}},methods:{logout:function(){var t=this;confirm("Are you sure you want to log out?")&&this.$store.dispatch("logOutUser").then((function(){t.$router.push({name:"UserLogin"}).catch((function(){}))}))}},computed:{activeCross:function(){return this.$store.getters.activeCrossGetter},pricerTab:function(){return this.$store.getters.lastPricerTabGetter}},watch:{showsidebar:function(){this.drawer=this.showsidebar}}},c=r,h=e("2877"),u=e("6544"),l=e.n(u),p=e("132d"),d=e("8860"),v=e("da13"),m=e("1800"),f=e("5d23"),g=(e("99af"),e("a9e3"),e("c7cd"),e("5530")),b=(e("7958"),e("adda")),y=e("3a66"),w=e("a9ad"),$=e("b848"),A=e("e4cdd"),_=e("e707"),O=e("2b0e"),k=O["a"].extend({name:"ssr-bootable",data:function(){return{isBooted:!1}},mounted:function(){var t=this;window.requestAnimationFrame((function(){t.$el.setAttribute("data-booted","true"),t.isBooted=!0}))}}),B=e("7560"),x=e("a293"),M=e("dc22"),C=e("c3f0"),j=e("80d2"),T=e("58df"),V=Object(T["a"])(Object(y["a"])("left",["isActive","isMobile","miniVariant","expandOnHover","permanent","right","temporary","width"]),w["a"],$["a"],A["a"],_["a"],k,B["a"]),R=V.extend({name:"v-navigation-drawer",provide:function(){return{isInNav:"nav"===this.tag}},directives:{ClickOutside:x["a"],Resize:M["a"],Touch:C["a"]},props:{bottom:Boolean,clipped:Boolean,disableResizeWatcher:Boolean,disableRouteWatcher:Boolean,expandOnHover:Boolean,floating:Boolean,height:{type:[Number,String],default:function(){return this.app?"100vh":"100%"}},miniVariant:Boolean,miniVariantWidth:{type:[Number,String],default:56},permanent:Boolean,right:Boolean,src:{type:[String,Object],default:""},stateless:Boolean,tag:{type:String,default:function(){return this.app?"nav":"aside"}},temporary:Boolean,touchless:Boolean,width:{type:[Number,String],default:256},value:null},data:function(){return{isMouseover:!1,touchArea:{left:0,right:0},stackMinZIndex:6}},computed:{applicationProperty:function(){return this.right?"right":"left"},classes:function(){return Object(g["a"])({"v-navigation-drawer":!0,"v-navigation-drawer--absolute":this.absolute,"v-navigation-drawer--bottom":this.bottom,"v-navigation-drawer--clipped":this.clipped,"v-navigation-drawer--close":!this.isActive,"v-navigation-drawer--fixed":!this.absolute&&(this.app||this.fixed),"v-navigation-drawer--floating":this.floating,"v-navigation-drawer--is-mobile":this.isMobile,"v-navigation-drawer--is-mouseover":this.isMouseover,"v-navigation-drawer--mini-variant":this.isMiniVariant,"v-navigation-drawer--custom-mini-variant":56!==Number(this.miniVariantWidth),"v-navigation-drawer--open":this.isActive,"v-navigation-drawer--open-on-hover":this.expandOnHover,"v-navigation-drawer--right":this.right,"v-navigation-drawer--temporary":this.temporary},this.themeClasses)},computedMaxHeight:function(){if(!this.hasApp)return null;var t=this.$vuetify.application.bottom+this.$vuetify.application.footer+this.$vuetify.application.bar;return this.clipped?t+this.$vuetify.application.top:t},computedTop:function(){if(!this.hasApp)return 0;var t=this.$vuetify.application.bar;return t+=this.clipped?this.$vuetify.application.top:0,t},computedTransform:function(){return this.isActive?0:this.isBottom||this.right?100:-100},computedWidth:function(){return this.isMiniVariant?this.miniVariantWidth:this.width},hasApp:function(){return this.app&&!this.isMobile&&!this.temporary},isBottom:function(){return this.bottom&&this.isMobile},isMiniVariant:function(){return!this.expandOnHover&&this.miniVariant||this.expandOnHover&&!this.isMouseover},isMobile:function(){return!this.stateless&&!this.permanent&&A["a"].options.computed.isMobile.call(this)},reactsToClick:function(){return!this.stateless&&!this.permanent&&(this.isMobile||this.temporary)},reactsToMobile:function(){return this.app&&!this.disableResizeWatcher&&!this.permanent&&!this.stateless&&!this.temporary},reactsToResize:function(){return!this.disableResizeWatcher&&!this.stateless},reactsToRoute:function(){return!this.disableRouteWatcher&&!this.stateless&&(this.temporary||this.isMobile)},showOverlay:function(){return!this.hideOverlay&&this.isActive&&(this.isMobile||this.temporary)},styles:function(){var t=this.isBottom?"translateY":"translateX",i={height:Object(j["h"])(this.height),top:this.isBottom?"auto":Object(j["h"])(this.computedTop),maxHeight:null!=this.computedMaxHeight?"calc(100% - ".concat(Object(j["h"])(this.computedMaxHeight),")"):void 0,transform:"".concat(t,"(").concat(Object(j["h"])(this.computedTransform,"%"),")"),width:Object(j["h"])(this.computedWidth)};return i}},watch:{$route:"onRouteChange",isActive:function(t){this.$emit("input",t)},isMobile:function(t,i){!t&&this.isActive&&!this.temporary&&this.removeOverlay(),null!=i&&this.reactsToResize&&this.reactsToMobile&&(this.isActive=!t)},permanent:function(t){t&&(this.isActive=!0)},showOverlay:function(t){t?this.genOverlay():this.removeOverlay()},value:function(t){this.permanent||(null!=t?t!==this.isActive&&(this.isActive=t):this.init())},expandOnHover:"updateMiniVariant",isMouseover:function(t){this.updateMiniVariant(!t)}},beforeMount:function(){this.init()},methods:{calculateTouchArea:function(){var t=this.$el.parentNode;if(t){var i=t.getBoundingClientRect();this.touchArea={left:i.left+50,right:i.right-50}}},closeConditional:function(){return this.isActive&&!this._isDestroyed&&this.reactsToClick},genAppend:function(){return this.genPosition("append")},genBackground:function(){var t={height:"100%",width:"100%",src:this.src},i=this.$scopedSlots.img?this.$scopedSlots.img(t):this.$createElement(b["a"],{props:t});return this.$createElement("div",{staticClass:"v-navigation-drawer__image"},[i])},genDirectives:function(){var t=this,i=[{name:"click-outside",value:{handler:function(){t.isActive=!1},closeConditional:this.closeConditional,include:this.getOpenDependentElements}}];return this.touchless||this.stateless||i.push({name:"touch",value:{parent:!0,left:this.swipeLeft,right:this.swipeRight}}),i},genListeners:function(){var t=this,i={transitionend:function(i){if(i.target===i.currentTarget){t.$emit("transitionend",i);var e=document.createEvent("UIEvents");e.initUIEvent("resize",!0,!1,window,0),window.dispatchEvent(e)}}};return this.miniVariant&&(i.click=function(){return t.$emit("update:mini-variant",!1)}),this.expandOnHover&&(i.mouseenter=function(){return t.isMouseover=!0},i.mouseleave=function(){return t.isMouseover=!1}),i},genPosition:function(t){var i=Object(j["t"])(this,t);return i?this.$createElement("div",{staticClass:"v-navigation-drawer__".concat(t)},i):i},genPrepend:function(){return this.genPosition("prepend")},genContent:function(){return this.$createElement("div",{staticClass:"v-navigation-drawer__content"},this.$slots.default)},genBorder:function(){return this.$createElement("div",{staticClass:"v-navigation-drawer__border"})},init:function(){this.permanent?this.isActive=!0:this.stateless||null!=this.value?this.isActive=this.value:this.temporary||(this.isActive=!this.isMobile)},onRouteChange:function(){this.reactsToRoute&&this.closeConditional()&&(this.isActive=!1)},swipeLeft:function(t){this.isActive&&this.right||(this.calculateTouchArea(),Math.abs(t.touchendX-t.touchstartX)<100||(this.right&&t.touchstartX>=this.touchArea.right?this.isActive=!0:!this.right&&this.isActive&&(this.isActive=!1)))},swipeRight:function(t){this.isActive&&!this.right||(this.calculateTouchArea(),Math.abs(t.touchendX-t.touchstartX)<100||(!this.right&&t.touchstartX<=this.touchArea.left?this.isActive=!0:this.right&&this.isActive&&(this.isActive=!1)))},updateApplication:function(){if(!this.isActive||this.isMobile||this.temporary||!this.$el)return 0;var t=Number(this.computedWidth);return isNaN(t)?this.$el.clientWidth:t},updateMiniVariant:function(t){this.miniVariant!==t&&this.$emit("update:mini-variant",t)}},render:function(t){var i=[this.genPrepend(),this.genContent(),this.genAppend(),this.genBorder()];return(this.src||Object(j["t"])(this,"img"))&&i.unshift(this.genBackground()),t(this.tag,this.setBackgroundColor(this.color,{class:this.classes,style:this.styles,directives:this.genDirectives(),on:this.genListeners()}),i)}}),N=Object(h["a"])(c,o,a,!1,null,null,null),P=N.exports;l()(N,{VIcon:p["a"],VList:d["a"],VListItem:v["a"],VListItemAction:m["a"],VListItemContent:f["a"],VListItemTitle:f["b"],VNavigationDrawer:R});var S=function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("v-footer",{attrs:{color:"blue-grey lighten-1",app:""}},[e("span",{staticClass:"white--text"},[t._v("Jamie Sokolsky © 2020")]),e("v-spacer"),e("span",{staticClass:"white--text"},[t._v("User: "+t._s(t.currentUser))])],1)},L=[],U={name:"TheFooter",data:function(){return{currentUser:this.$store.state.currentUser}}},E=U,W=(e("b5b6"),e("8dd9")),z=Object(T["a"])(W["a"],Object(y["a"])("footer",["height","inset"]),k).extend({name:"v-footer",props:{height:{default:"auto",type:[Number,String]},inset:Boolean,padless:Boolean},computed:{applicationProperty:function(){return this.inset?"insetFooter":"footer"},classes:function(){return Object(g["a"])(Object(g["a"])({},W["a"].options.computed.classes.call(this)),{},{"v-footer--absolute":this.absolute,"v-footer--fixed":!this.absolute&&(this.app||this.fixed),"v-footer--padless":this.padless,"v-footer--inset":this.inset})},computedBottom:function(){if(this.isPositioned)return this.app?this.$vuetify.application.bottom:0},computedLeft:function(){if(this.isPositioned)return this.app&&this.inset?this.$vuetify.application.left:0},computedRight:function(){if(this.isPositioned)return this.app&&this.inset?this.$vuetify.application.right:0},isPositioned:function(){return Boolean(this.absolute||this.fixed||this.app)},styles:function(){var t=parseInt(this.height);return Object(g["a"])(Object(g["a"])({},W["a"].options.computed.styles.call(this)),{},{height:isNaN(t)?t:Object(j["h"])(t),left:Object(j["h"])(this.computedLeft),right:Object(j["h"])(this.computedRight),bottom:Object(j["h"])(this.computedBottom)})}},methods:{updateApplication:function(){var t=parseInt(this.height);return isNaN(t)?this.$el?this.$el.clientHeight:0:t}},render:function(t){var i=this.setBackgroundColor(this.color,{staticClass:"v-footer",class:this.classes,style:this.styles});return t("footer",i,this.$slots.default)}}),H=e("2fa4"),I=Object(h["a"])(E,S,L,!1,null,null,null),D=I.exports;l()(I,{VFooter:z,VSpacer:H["a"]});var F={data:function(){return{drawer:null}},components:{TheSidebar:P,TheFooter:D}},X=F,J=e("7496"),q=e("a523"),G=(e("bd0c"),k.extend({name:"v-main",props:{tag:{type:String,default:"main"}},computed:{styles:function(){var t=this.$vuetify.application,i=t.bar,e=t.top,n=t.right,s=t.footer,o=t.insetFooter,a=t.bottom,r=t.left;return{paddingTop:"".concat(e+i,"px"),paddingRight:"".concat(n,"px"),paddingBottom:"".concat(s+o+a,"px"),paddingLeft:"".concat(r,"px")}}},render:function(t){var i={staticClass:"v-main",style:this.styles,ref:"main"};return t(this.tag,i,[t("div",{staticClass:"v-main__wrap"},this.$slots.default)])}})),Y=Object(h["a"])(X,n,s,!1,null,null,null);i["default"]=Y.exports;l()(Y,{VApp:J["a"],VContainer:q["a"],VMain:G})},b5b6:function(t,i,e){},bd0c:function(t,i,e){},dc22:function(t,i,e){"use strict";function n(t,i){var e=i.value,n=i.options||{passive:!0};window.addEventListener("resize",e,n),t._onResize={callback:e,options:n},i.modifiers&&i.modifiers.quiet||e()}function s(t){if(t._onResize){var i=t._onResize,e=i.callback,n=i.options;window.removeEventListener("resize",e,n),delete t._onResize}}var o={inserted:n,unbind:s};i["a"]=o},e4cdd:function(t,i,e){"use strict";e("caad"),e("b0c0"),e("a9e3");var n=e("d9bd"),s=e("2b0e");i["a"]=s["a"].extend({name:"mobile",props:{mobileBreakpoint:{type:[Number,String],default:function(){return this.$vuetify?this.$vuetify.breakpoint.mobileBreakpoint:void 0},validator:function(t){return!isNaN(Number(t))||["xs","sm","md","lg","xl"].includes(String(t))}}},computed:{isMobile:function(){var t=this.$vuetify.breakpoint,i=t.mobile,e=t.width,n=t.name,s=t.mobileBreakpoint;if(s===this.mobileBreakpoint)return i;var o=parseInt(this.mobileBreakpoint,10),a=!isNaN(o);return a?e<o:n===this.mobileBreakpoint}},created:function(){this.$attrs.hasOwnProperty("mobile-break-point")&&Object(n["d"])("mobile-break-point","mobile-breakpoint",this)}})}}]);
//# sourceMappingURL=chunk-7f26a8c5.08eaf142.js.map