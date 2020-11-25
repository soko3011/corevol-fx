(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-c172cb00"],{"269a":function(e,t){e.exports=function(e,t){var n="function"===typeof e.exports?e.exports.extendOptions:e.options;for(var a in"function"===typeof e.exports&&(n.directives=e.exports.options.directives),n.directives=n.directives||{},t)n.directives[a]=n.directives[a]||t[a]}},3530:function(e,t,n){"use strict";n.r(t);var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("div",{staticClass:"d-flex flex-row flex-nowrap"},[n("div",{staticClass:"d-flex flex-column"},[n("v-card",{staticClass:"mr-3 d-flex flex-column",attrs:{"min-width":"225",height:e.window.height}},[n("v-list",{attrs:{dense:""}},[n("v-subheader",[e._v("COREVOLFX ADMIN")]),e._l(this.settingHeaders,(function(t){return n("v-list-item",{key:t,attrs:{ripple:""},on:{click:function(n){return e.ChangeSettings(t)}}},[n("v-list-item-action",[n("v-icon",{attrs:{color:"green darken-3"}},[e._v("mdi-dots-hexagon")])],1),n("v-list-item-content",[n("v-list-item-title",[e._v(e._s(t))])],1)],1)})),n("v-list-item",{attrs:{ripple:""},on:{click:function(t){return e.backupDatabase()}}},[n("v-list-item-action",[e.backupProgress?n("v-progress-circular",{attrs:{indeterminate:"",color:"primary"}}):n("v-icon",{attrs:{color:"green darken-3"}},[e._v("mdi-dots-hexagon")])],1),n("v-list-item-content",[n("v-list-item-title",[e._v("Backup Database")])],1)],1)],2)],1)],1),n("div",{staticClass:"divCol"},[n("transition",{attrs:{name:"slide"}},["System Log"===e.settingSelection?n("v-card",{attrs:{width:"1000",height:e.window.height}},[n("v-btn",{staticClass:"ma-2",attrs:{ripple:"",small:"",icon:""},on:{click:function(t){return e.updateLog()}}},[n("v-icon",{attrs:{color:"blue"}},[e._v("mdi-refresh-circle")])],1),n("v-card-title",[e._v(" System Log "),n("v-spacer"),n("v-text-field",{attrs:{"append-icon":"mdi-magnify",label:"Search","single-line":"","hide-details":""},model:{value:e.search,callback:function(t){e.search=t},expression:"search"}})],1),n("v-data-table",{attrs:{dense:"","items-per-page":15,"sort-by":e.sortBy,"sort-desc":e.sortDesc,headers:e.logHeaders,items:e.log,search:e.search},on:{"update:sortBy":function(t){e.sortBy=t},"update:sort-by":function(t){e.sortBy=t},"update:sortDesc":function(t){e.sortDesc=t},"update:sort-desc":function(t){e.sortDesc=t}},scopedSlots:e._u([{key:"item.LogTime",fn:function(t){var a=t.item;return[n("span",[e._v(e._s(new Date(a.LogTime).toLocaleString()))])]}}],null,!1,3866658068)})],1):e._e()],1),n("transition",{attrs:{name:"slide"}},["Manage Users"===e.settingSelection?n("v-card",{attrs:{width:"1000",height:e.window.height}},[n("v-data-table",{attrs:{headers:e.headers,items:e.data,"sort-by":"UserName",dense:"","disable-pagination":"","hide-default-footer":""},scopedSlots:e._u([{key:"item.IsAdmin",fn:function(t){var a=t.item;return[n("v-simple-checkbox",{directives:[{name:"ripple",rawName:"v-ripple"}],model:{value:a.IsAdmin,callback:function(t){e.$set(a,"IsAdmin",t)},expression:"item.IsAdmin"}})]}},{key:"item.IsAuthed",fn:function(t){var a=t.item;return[n("v-simple-checkbox",{directives:[{name:"ripple",rawName:"v-ripple"}],model:{value:a.IsAuthed,callback:function(t){e.$set(a,"IsAuthed",t)},expression:"item.IsAuthed"}})]}},{key:"top",fn:function(){return[n("v-toolbar",{staticClass:"mb-3",attrs:{dense:"",dark:"",color:"blue-grey darken-2"}},[n("v-toolbar-title",[e._v("Manage Users")]),n("v-spacer")],1)]},proxy:!0},{key:"item.actions",fn:function(t){var a=t.item;return[n("v-icon",{staticClass:"mr-2",attrs:{small:""},on:{click:function(t){return e.save(a)}}},[e._v("mdi-content-save")]),n("v-icon",{attrs:{small:""},on:{click:function(t){return e.deleteItem(a)}}},[e._v("mdi-delete")])]}}],null,!1,1571759814)})],1):e._e()],1)],1)])])},s=[],i=(n("99af"),n("4160"),n("caad"),n("d81d"),n("b64b"),n("d3b7"),n("25f0"),n("2532"),n("159b"),n("ddb0"),n("96cf"),n("1da1")),r=n("4994"),c=n("f0c4"),o={data:function(){return{keys:[],headers:[],data:[],addNew:!1,window:{width:0,height:0},search:"",log:[],logHeaders:[{text:"MESSAGE",align:"start",sortable:!1,value:"Message"},{text:"LOG TIME",value:"LogTime"}],sortBy:"LogTime",sortDesc:!0,settingHeaders:["System Log","Manage Users"],settingSelection:"System Log",backupProgress:!1}},components:{},props:{refreshComponent:{type:Boolean,default:!1}},computed:{userList:function(){return this.data.map((function(e){return e.UserName}))}},watch:{refreshComponent:function(){this.initialize()}},created:function(){window.addEventListener("resize",this.handleResize),this.handleResize(),this.initialize()},methods:{handleResize:function(){this.window.width=window.innerWidth-50,this.window.height=window.innerHeight-65,this.setContainerDimensions()},setContainerDimensions:function(){document.documentElement.style.setProperty("--main-width","".concat(this.window.width,"px")),document.documentElement.style.setProperty("--main-height","".concat(this.window.height,"px"))},ChangeSettings:function(e){this.settingSelection=e},initialize:function(){var e=this;return Object(i["a"])(regeneratorRuntime.mark((function t(){var n,a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,e.updateLog();case 3:return t.next=5,r["a"].GetAllUsers();case 5:n=t.sent,e.data=JSON.parse(n.data.userProfiles),a=[],e.keys=Object.keys(e.data[0]),e.keys.forEach((function(e){a.push({text:e,value:e,align:"center"})})),a.push({text:"Actions",value:"actions",align:"center",sortable:!1}),e.headers=a,t.next=18;break;case 14:t.prev=14,t.t0=t["catch"](0),!0===t.t0.toString().includes("403")&&(t.t0="Admin Rights Required"),e.$store.dispatch("setSnackbar",{text:"  ".concat(t.t0),centered:!0});case 18:case"end":return t.stop()}}),t,null,[[0,14]])})))()},updateLog:function(){var e=this;return Object(i["a"])(regeneratorRuntime.mark((function t(){var n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,c["a"].GetLog();case 3:n=t.sent,e.log=JSON.parse(n.data.log),t.next=10;break;case 7:t.prev=7,t.t0=t["catch"](0),e.$store.dispatch("setSnackbar",{text:"  ".concat(t.t0),centered:!0});case 10:case"end":return t.stop()}}),t,null,[[0,7]])})))()},backupDatabase:function(){var e=this;return Object(i["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,e.backupProgress=!0,e.$store.dispatch("setSnackbar",{text:"Database backup starting...",centered:!0}),t.next=5,r["a"].backupDatabase();case 5:return t.sent,e.backupProgress=!1,e.$store.dispatch("setSnackbar",{text:" Database backup complete",centered:!0}),t.next=10,e.updateLog();case 10:t.next=15;break;case 12:t.prev=12,t.t0=t["catch"](0),e.$store.dispatch("setSnackbar",{text:"  ".concat(t.t0),centered:!0});case 15:case"end":return t.stop()}}),t,null,[[0,12]])})))()},deleteItem:function(e){var t=this;confirm("Are you sure you want to delete ".concat(e.UserName,"?"))&&r["a"].DeleteUser(e).then((function(n){t.$store.dispatch("setSnackbar",{text:"".concat(e.UserName," deleted succesfully. Status ").concat(n.status),centered:!0}),t.initialize()})).catch((function(e){!0===e.toString().includes("403")&&(e="Admin Rights Required"),t.$store.dispatch("setSnackbar",{text:" Delete Unsuccessful. ".concat(e),centered:!0})}))},save:function(e){var t=this;r["a"].UpdateUser(e).then((function(n){t.$store.dispatch("setSnackbar",{text:"".concat(e.UserName," updated succesfully. Status ").concat(n.status),centered:!0}),t.initialize()})).catch((function(e){!0===e.toString().includes("403")&&(e="Admin Rights Required"),t.$store.dispatch("setSnackbar",{text:" Update Unsuccessful. ".concat(e),centered:!0})}))}}},d=o,l=(n("4a9a"),n("2877")),u=n("6544"),p=n.n(u),h=n("8336"),m=n("b0af"),v=n("99d9"),f=n("8fea"),g=n("132d"),b=n("8860"),k=n("da13"),w=n("1800"),x=n("5d23"),y=n("490a"),S=n("9e88"),L=n("2fa4"),C=n("e0c7"),_=n("8654"),D=n("71d9"),V=n("2a7f"),A=n("269a"),I=n.n(A),R=n("5607"),U=Object(l["a"])(d,a,s,!1,null,null,null);t["default"]=U.exports;p()(U,{VBtn:h["a"],VCard:m["a"],VCardTitle:v["d"],VDataTable:f["a"],VIcon:g["a"],VList:b["a"],VListItem:k["a"],VListItemAction:w["a"],VListItemContent:x["a"],VListItemTitle:x["b"],VProgressCircular:y["a"],VSimpleCheckbox:S["a"],VSpacer:L["a"],VSubheader:C["a"],VTextField:_["a"],VToolbar:D["a"],VToolbarTitle:V["a"]}),I()(U,{Ripple:R["a"]})},"4a9a":function(e,t,n){"use strict";var a=n("723d"),s=n.n(a);s.a},"723d":function(e,t,n){}}]);
//# sourceMappingURL=chunk-c172cb00.373b37a9.js.map