(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-3b484843"],{"002e":function(t,e,a){},"06b9":function(t,e,a){"use strict";var n=a("0864"),s=a.n(n);s.a},"0864":function(t,e,a){},"0cd9":function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-row",{attrs:{justify:"center"}},[a("v-dialog",{attrs:{"max-width":"300"},scopedSlots:t._u([{key:"activator",fn:function(e){var n=e.on,s=e.attrs;return[a("v-btn",{attrs:{icon:""}},[a("v-icon",t._g(t._b({attrs:{large:t.large,color:t.color}},"v-icon",s,!1),n),[t._v(" "+t._s(t.icon)+" ")])],1)]}}]),model:{value:t.dialog,callback:function(e){t.dialog=e},expression:"dialog"}},[a("v-card",{staticClass:"mx-auto",attrs:{"max-width":"300"}},[a("v-toolbar",{attrs:{height:"40px",color:"blue-grey",dark:""}},[a("v-spacer"),a("v-toolbar-title",{staticClass:"ma-4"},[t._v(t._s(t.title))]),a("v-spacer")],1),a("v-list",[a("v-list-item-group",{attrs:{mandatory:"",color:"indigo"}},t._l(t.inputData,(function(e,n){return a("v-list-item",{key:n,staticClass:"text-center",attrs:{dense:""},on:{click:function(a){return t.emitToParent(e)}}},[a("v-list-item-content",[a("v-list-item-title",[t._v(t._s(e))]),a("v-divider",{staticClass:"mt-2",attrs:{light:""}})],1)],1)})),1)],1),a("v-card-actions",[a("v-spacer"),a("v-btn",{attrs:{color:"green darken-1",text:""},on:{click:function(e){t.dialog=!1}}},[t._v("Cancel")])],1)],1)],1)],1)},s=[],i={data:function(){return{dialog:!1}},props:{inputData:{type:Array},icon:{type:String},large:{type:Boolean},color:{type:String},title:{type:String}},methods:{emitToParent:function(t){this.$emit("selection",t),this.dialog=!1}}},r=i,c=a("2877"),o=a("6544"),l=a.n(o),d=a("8336"),u=a("b0af"),v=a("99d9"),f=a("169a"),m=a("ce7e"),p=a("132d"),h=a("8860"),b=a("da13"),k=a("5d23"),g=a("1baa"),C=a("0fd9"),x=a("2fa4"),y=a("71d9"),w=a("2a7f"),S=Object(c["a"])(r,n,s,!1,null,null,null);e["a"]=S.exports;l()(S,{VBtn:d["a"],VCard:u["a"],VCardActions:v["a"],VDialog:f["a"],VDivider:m["a"],VIcon:p["a"],VList:h["a"],VListItem:b["a"],VListItemContent:k["a"],VListItemGroup:g["a"],VListItemTitle:k["b"],VRow:C["a"],VSpacer:x["a"],VToolbar:y["a"],VToolbarTitle:w["a"]})},"0f10":function(t,e,a){"use strict";var n=a("d689"),s=a.n(n);s.a},"1f63":function(t,e,a){"use strict";var n=a("002e"),s=a.n(n);s.a},"26d3":function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-container",{staticClass:"overallContainer",attrs:{fluid:""}},[a("div",[a("div",{staticClass:"d-flex flex-row mb-5 flex-nowrap"},[a("v-toolbar",{attrs:{color:"#126496","min-width":"300",collapse:""}},[a("v-spacer"),a("div",{staticClass:"d-flex flex-column"},[a("h4",{staticClass:"font-weight-medium text-center text-uppercase grey--text text--lighten-3"},[t._v(" Corevolfx "),a("v-icon",{staticClass:"mb-4",attrs:{small:"",color:"green lighten-3"}},[t._v("mdi-dots-hexagon")])],1),a("h6",{staticClass:"font-weight-light text-center text-uppercase green--text text--lighten-3",attrs:{align:"center",justify:"center"}},[t._v(" settings ")])]),a("v-spacer")],1)],1),a("div",{staticClass:"d-flex flex-row flex-nowrap align-start justify-start"},[a("v-card",{staticClass:"mr-3 d-flex flex-column",attrs:{"min-width":"225",height:t.window.height}},[a("v-list",{attrs:{dense:""}},[a("v-subheader",[t._v("COREVOLFX OPTIONS")]),t._l(this.settingHeaders,(function(e){return a("v-list-item",{key:e,attrs:{ripple:""},on:{click:function(a){return t.ChangeSettings(e)}}},[a("v-list-item-action",[a("v-icon",{attrs:{color:"green darken-3"}},[t._v("mdi-dots-hexagon")])],1),a("v-list-item-content",[a("v-list-item-title",[t._v(t._s(e))])],1)],1)}))],2)],1),a("div",{staticClass:"divCol",style:t.zoomLevel},[a("transition",{attrs:{name:"slide"}},["Dvi Settings"===t.settingSelection?a("DviSetup"):t._e()],1),a("transition",{attrs:{name:"slide"}},["Cross Settings"===t.settingSelection?a("CrossSetup"):t._e()],1),a("transition",{attrs:{name:"slide"}},["Ccy Settings"===t.settingSelection?a("CcySetup"):t._e()],1),a("transition",{attrs:{name:"slide"}},["Expiry Cut Settings"===t.settingSelection?a("ExpiryCutSettings"):t._e()],1),a("transition",{attrs:{name:"slide"}},["User Settings"===t.settingSelection?a("UserSettings"):t._e()],1)],1)],1)])])},s=[],i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return t.apiDataReturned?a("div",[a("v-card",[a("v-card",[a("v-btn",{attrs:{absolute:"",small:"",fab:"",top:"",right:"",color:"pink",elevation:"12"}},[a("PopUpModal",{attrs:{inputData:this.$store.state.crossList,icon:"mdi-expand-all",color:"white",large:!1,title:"MIRROR CROSS"},on:{selection:t.OpenDialog}})],1)],1)],1),a("v-data-table",{staticClass:"elevation-10 custom-transform-class",attrs:{headers:t.headers,items:t.data,"sort-by":"Cross",dense:"","disable-pagination":"","hide-default-footer":""},scopedSlots:t._u([{key:"top",fn:function(){return[a("v-toolbar",{staticClass:"mb-3",attrs:{dense:"",dark:"",color:"#385F73"}},[a("v-toolbar-title",[t._v("Dvi Settings")]),a("v-spacer"),a("v-dialog",{attrs:{"max-width":"1000px","overlay-opacity":"0.8"},model:{value:t.dialog,callback:function(e){t.dialog=e},expression:"dialog"}},[a("v-card",[a("v-card-title",[a("span",{staticClass:"title"},[t._v(t._s(t.formTitle))])]),a("v-card-text",[a("v-container",[a("v-row",t._l(t.keys,(function(e){return a("v-col",{key:e,attrs:{cols:"12",sm:"6",md:"2"}},[a("v-text-field",{attrs:{label:e},model:{value:t.editedItem[e],callback:function(a){t.$set(t.editedItem,e,a)},expression:"editedItem[key]"}})],1)})),1)],1)],1),a("v-card-actions",[a("v-spacer"),a("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:t.close}},[t._v("Cancel")]),a("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:function(e){return t.save(t.editedItem)}}},[t._v("Save")])],1)],1)],1)],1)]},proxy:!0},{key:"item.mults",fn:function(e){var n=e.item;return[a("v-icon",{attrs:{small:""},on:{click:function(e){return t.viewMultsAndSpreads(n)}}},[t._v("mdi-eye")])]}},{key:"item.actions",fn:function(e){var n=e.item;return[a("v-icon",{staticClass:"mr-2",attrs:{small:""},on:{click:function(e){return t.editItem(n)}}},[t._v("mdi-pencil")]),a("v-icon",{staticClass:"mr-2",attrs:{small:""},on:{click:function(e){return t.deleteItem(n)}}},[t._v("mdi-delete")])]}}],null,!1,2074081009)}),a("v-dialog",{attrs:{"max-width":t.marketTableWidth,"overlay-opacity":"0.8"},model:{value:t.showMarketTable,callback:function(e){t.showMarketTable=e},expression:"showMarketTable"}},[a("v-card",[t.showMarketTable?a("MarketDataTable",{attrs:{crossName:t.selectedCross,title:t.marketTableTitle,incomingData:t.marketData}}):t._e()],1)],1),a("v-dialog",{attrs:{"max-width":t.mainWindowWidth,"overlay-opacity":"0.8"},model:{value:t.showDialogAddNewCross,callback:function(e){t.showDialogAddNewCross=e},expression:"showDialogAddNewCross"}},[a("v-card",[a("v-card-title",[a("span",{staticClass:"title"},[t._v(t._s(t.FormTitleAddNewCross))])]),a("v-card-text",[a("v-container",[a("v-row",t._l(t.dviKeys,(function(e){return a("v-col",{key:e,attrs:{cols:"12",sm:"6",md:"2"}},[a("v-text-field",{attrs:{label:e},model:{value:t.dviEdited[e],callback:function(a){t.$set(t.dviEdited,e,a)},expression:"dviEdited[key]"}})],1)})),1),a("v-divider",{staticClass:"mt-5 mb-10"}),a("v-row",t._l(t.crossKeys,(function(e){return a("v-col",{key:e,attrs:{cols:"12",sm:"6",md:"2"}},[a("v-text-field",{attrs:{label:e},model:{value:t.crossEdited[e],callback:function(a){t.$set(t.crossEdited,e,a)},expression:"crossEdited[key]"}})],1)})),1)],1)],1),a("v-card-actions",[a("v-spacer"),a("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:t.CloseNewCrossDialog}},[t._v("Cancel")]),a("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:function(e){return t.SaveNewCross(t.dviEdited,t.crossEdited)}}},[t._v("Save")])],1)],1)],1)],1):t._e()},r=[],c=(a("99af"),a("4160"),a("caad"),a("b64b"),a("d3b7"),a("25f0"),a("2532"),a("159b"),a("ddb0"),a("96cf"),a("1da1")),o=a("f0c4"),l=a("6029"),d=a("0cd9"),u={name:"DviSetup",components:{MarketDataTable:l["a"],PopUpModal:d["a"]},data:function(){return{dialog:!1,showDialogAddNewCross:!1,keys:[],headers:[],data:[],editedItem:{},showMarketTable:!1,marketData:[],marketTableTitle:"",marketTableWidth:"",selectedCross:"",apiDataReturned:!1,dviKeys:[],crossKeys:[],dviEdited:{},crossEdited:{},mirroredCross:""}},computed:{formTitle:function(){return"UPDATE ".concat(this.editedItem.Cross)},FormTitleAddNewCross:function(){return"Mirror ".concat(this.mirroredCross)},mainWindowHeight:function(){return window.innerHeight},mainWindowWidth:function(){return window.innerWidth-10}},watch:{dialog:function(t){t||this.close()}},created:function(){this.initialize()},methods:{initialize:function(){var t=this;this.$store.dispatch("refreshCrossList"),o["a"].GetDviSetup().then((function(e){t.data=JSON.parse(e.data.dviSetup);var a=[];t.keys=Object.keys(t.data[0]),t.keys.forEach((function(t){a.push({text:t,value:t,align:"center"})})),a.push({text:"Mults",value:"mults",align:"center"}),a.push({text:"Actions",value:"actions",align:"center"}),t.headers=a,t.apiDataReturned=!0})).catch((function(e){t.snackbarMessage=" Error: ".concat(e),t.snackbar=!0}))},OpenDialog:function(t){var e=this;o["a"].MirrorCrossDets({Cross:t}).then((function(t){var a=JSON.parse(t.data.dviSetup),n=JSON.parse(t.data.crossSetup);delete n.Cross,e.dviKeys=Object.keys(a),e.crossKeys=Object.keys(n),e.dviEdited=a,e.mirroredCross=e.dviEdited.Cross,e.dviEdited.Cross="",e.crossEdited=n,e.showDialogAddNewCross=!0})).catch((function(t){!0===t.toString().includes("403")&&(t="Admin Rights Required"),e.$store.dispatch("setSnackbar",{text:" ".concat(t),centered:!0})}))},editItem:function(t){this.editedItem=Object.assign({},t),this.dialog=!0},deleteItem:function(t){var e=this;confirm("Are you sure you want to delete ".concat(t.Cross,"?"))&&o["a"].DeleteCcyPairData({Cross:t.Cross}).then((function(a){e.$store.dispatch("setSnackbar",{text:"".concat(t.Cross," deleted succesfully. Status ").concat(a.status),centered:!0}),e.initialize(),e.$emit("ccyPairDeleted",!0)})).catch((function(t){!0===t.toString().includes("403")&&(t="Admin Rights Required"),e.$store.dispatch("setSnackbar",{text:"Delete unsucessful.  ".concat(t),centered:!0})}))},viewMultsAndSpreads:function(t){var e=this,a=t.Cross;o["a"].GetMultsAndSpreads({UserName:this.$store.state.currentUser,Cross:t.Cross}).then((function(t){e.marketData=JSON.parse(t.data.multsAndSpreads),e.selectedCross=a,e.marketTableTitle="MULTIPLERS AND SPREADS",e.marketTableWidth="1000px",e.showMarketTable=!0})).catch((function(t){e.snackbarMessage=" Error: ".concat(t),e.snackbar=!0}))},close:function(){this.dialog=!1,this.$nextTick((function(){}))},save:function(t){var e=this;this.$store.dispatch("setSnackbar",{text:"Processing ".concat(t.Cross," DVI update ..."),centered:!0,timeout:2500}),o["a"].UpdateDviDets({DviInputsUI:t,UserName:this.$store.state.currentUser}).then((function(a){e.$store.dispatch("setSnackbar",{text:"".concat(t.Cross," updated succesfully."),centered:!0}),e.initialize()})).catch((function(t){!0===t.toString().includes("403")&&(t="Admin Rights Required"),e.$store.dispatch("setSnackbar",{text:"Update unsucessful.  ".concat(t),centered:!0})})),this.close()},CloseNewCrossDialog:function(){this.showDialogAddNewCross=!1,this.$nextTick((function(){}))},SaveNewCross:function(t,e){var a=this;return Object(c["a"])(regeneratorRuntime.mark((function n(){return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return e.Cross=t.Cross,n.prev=1,n.next=4,o["a"].AddNewCcyPair({DviInputsUI:t,CrossDetsUI:e});case 4:n.sent,a.$store.dispatch("refreshCrossList"),a.$store.dispatch("setSnackbar",{text:" ".concat(t.Cross," updated succesfully."),centered:!0}),a.refreshChildren=!a.refreshChildren,a.initialize(),n.next=15;break;case 11:n.prev=11,n.t0=n["catch"](1),!0===n.t0.toString().includes("403")&&(n.t0="Admin Rights Required"),a.$store.dispatch("setSnackbar",{text:"Update unsucessful.  ".concat(n.t0),centered:!0});case 15:a.CloseNewCrossDialog();case 16:case"end":return n.stop()}}),n,null,[[1,11]])})))()}}},v=u,f=(a("06b9"),a("2877")),m=a("6544"),p=a.n(m),h=a("8336"),b=a("b0af"),k=a("99d9"),g=a("62ad"),C=a("a523"),x=a("8fea"),y=a("169a"),w=a("ce7e"),S=a("132d"),I=a("0fd9"),_=a("2fa4"),T=a("8654"),V=a("71d9"),D=a("2a7f"),R=Object(f["a"])(v,i,r,!1,null,null,null),N=R.exports;p()(R,{VBtn:h["a"],VCard:b["a"],VCardActions:k["a"],VCardText:k["c"],VCardTitle:k["d"],VCol:g["a"],VContainer:C["a"],VDataTable:x["a"],VDialog:y["a"],VDivider:w["a"],VIcon:S["a"],VRow:I["a"],VSpacer:_["a"],VTextField:T["a"],VToolbar:V["a"],VToolbarTitle:D["a"]});var O=function(){var t=this,e=t.$createElement,a=t._self._c||e;return t.apiDataReturned?a("div",[a("v-data-table",{staticClass:"elevation-10 custom-transform-class",attrs:{headers:t.headers,items:t.data,"sort-by":"Cross",dense:"","disable-pagination":"","hide-default-footer":""},scopedSlots:t._u([{key:"top",fn:function(){return[a("v-toolbar",{staticClass:"mb-3",attrs:{dense:"",dark:"",color:"#385F73"}},[a("v-toolbar-title",[t._v("Cross Settings")]),a("v-spacer"),a("v-dialog",{attrs:{"max-width":"1000px"},model:{value:t.dialog,callback:function(e){t.dialog=e},expression:"dialog"}},[a("v-card",[a("v-card-title",[a("span",{staticClass:"title"},[t._v(t._s(t.formTitle))])]),a("v-card-text",[a("v-container",[a("v-row",t._l(t.keys,(function(e){return a("v-col",{key:e,attrs:{cols:"12",sm:"6",md:"2"}},[a("v-text-field",{attrs:{label:e},model:{value:t.editedItem[e],callback:function(a){t.$set(t.editedItem,e,a)},expression:"editedItem[key]"}})],1)})),1)],1)],1),a("v-card-actions",[a("v-spacer"),a("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:t.close}},[t._v("Cancel")]),a("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:function(e){return t.save(t.editedItem)}}},[t._v("Save")])],1)],1)],1)],1)]},proxy:!0},{key:"item.actions",fn:function(e){var n=e.item;return[a("v-icon",{staticClass:"mr-2",attrs:{small:""},on:{click:function(e){return t.editItem(n)}}},[t._v("mdi-pencil")])]}}],null,!1,1549467766)}),a("div",{staticClass:"text-center ma-2"},[a("v-snackbar",{attrs:{rounded:"pill",centered:"",elevation:"20"},scopedSlots:t._u([{key:"action",fn:function(e){var n=e.attrs;return[a("v-btn",t._b({attrs:{color:"pink",text:""},on:{click:function(e){t.snackbar=!1}}},"v-btn",n,!1),[t._v("Close")])]}}],null,!1,785509422),model:{value:t.snackbar,callback:function(e){t.snackbar=e},expression:"snackbar"}},[t._v(" "+t._s(t.snackbarMessage)+" ")])],1)],1):t._e()},E=[],A={data:function(){return{dialog:!1,keys:[],headers:[],data:[],editedItem:{},snackbar:!1,snackbarMessage:"",apiDataReturned:!1}},computed:{formTitle:function(){return"EDIT ".concat(this.editedItem.Cross)}},watch:{dialog:function(t){t||this.close()}},created:function(){this.initialize()},methods:{initialize:function(){var t=this;o["a"].GetCrossSetup().then((function(e){t.data=JSON.parse(e.data.crossSetup);var a=[];t.keys=Object.keys(t.data[0]),t.keys.forEach((function(t){a.push({text:t,value:t,align:"center"})})),a.push({text:"Actions",value:"actions",align:"center"}),t.headers=a,t.apiDataReturned=!0})).catch((function(e){t.snackbarMessage=" Error: ".concat(e),t.snackbar=!0}))},editItem:function(t){this.editedItem=Object.assign({},t),this.dialog=!0},close:function(){this.dialog=!1,this.$nextTick((function(){}))},save:function(t){var e=this;return Object(c["a"])(regeneratorRuntime.mark((function a(){return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return a.prev=0,a.next=3,o["a"].UpdateCrossDets(t);case 3:a.sent,e.snackbarMessage="".concat(t.Cross," updated succesfully."),e.snackbar=!0,e.initialize(),a.next=14;break;case 9:a.prev=9,a.t0=a["catch"](0),!0===a.t0.toString().includes("403")&&(a.t0="Admin Rights Required"),e.snackbarMessage="Update unsucessful.  ".concat(a.t0),e.snackbar=!0;case 14:e.close();case 15:case"end":return a.stop()}}),a,null,[[0,9]])})))()}}},U=A,$=(a("546a"),a("2db4")),M=Object(f["a"])(U,O,E,!1,null,null,null),z=M.exports;p()(M,{VBtn:h["a"],VCard:b["a"],VCardActions:k["a"],VCardText:k["c"],VCardTitle:k["d"],VCol:g["a"],VContainer:C["a"],VDataTable:x["a"],VDialog:y["a"],VIcon:S["a"],VRow:I["a"],VSnackbar:$["a"],VSpacer:_["a"],VTextField:T["a"],VToolbar:V["a"],VToolbarTitle:D["a"]});var j=function(){var t=this,e=t.$createElement,a=t._self._c||e;return t.apiDataReturned?a("div",[a("v-card",[a("v-btn",{attrs:{absolute:"",small:"",fab:"",top:"",right:"",color:"pink",elevation:"12"}},[a("PopUpModal",{attrs:{inputData:t.ccyList,icon:"mdi-expand-all",color:"white",large:!1,title:"MIRROR CCY"},on:{selection:t.AddNewCcy}})],1)],1),a("v-data-table",{staticClass:"elevation-10 custom-transform-class",attrs:{headers:t.headers,items:t.data,"sort-by":"Ccy",dense:"","disable-pagination":"","hide-default-footer":""},scopedSlots:t._u([{key:"top",fn:function(){return[a("v-toolbar",{staticClass:"mb-3",attrs:{dense:"",dark:"",color:"#385F73"}},[a("v-toolbar-title",[t._v("Ccy Settings")]),a("v-spacer"),a("v-dialog",{attrs:{"max-width":"1000px"},model:{value:t.dialog,callback:function(e){t.dialog=e},expression:"dialog"}},[a("v-card",[a("v-card-title",[a("span",{staticClass:"title"},[t._v(t._s(t.formTitle))])]),a("v-card-text",[a("v-container",[a("v-row",t._l(t.keys,(function(e){return a("v-col",{key:e,attrs:{cols:"12",sm:"6",md:"2"}},[a("v-text-field",{attrs:{label:e},model:{value:t.editedItem[e],callback:function(a){t.$set(t.editedItem,e,a)},expression:"editedItem[key]"}})],1)})),1)],1)],1),a("v-card-actions",[a("v-spacer"),a("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:t.close}},[t._v("Cancel")]),a("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:function(e){return t.save(t.editedItem)}}},[t._v("Save")])],1)],1)],1)],1)]},proxy:!0},{key:"item.actions",fn:function(e){var n=e.item;return[a("v-icon",{staticClass:"mr-2",attrs:{small:""},on:{click:function(e){return t.editItem(n)}}},[t._v("mdi-pencil")]),a("v-icon",{attrs:{small:""},on:{click:function(e){return t.deleteItem(n)}}},[t._v("mdi-delete")])]}},{key:"no-data",fn:function(){return[a("v-btn",{attrs:{color:"primary"},on:{click:t.initialize}},[t._v("Reset")])]},proxy:!0}],null,!1,1519027926)}),a("div",{staticClass:"text-center ma-2"},[a("v-snackbar",{attrs:{rounded:"pill",centered:"",elevation:"20"},scopedSlots:t._u([{key:"action",fn:function(e){var n=e.attrs;return[a("v-btn",t._b({attrs:{color:"pink",text:""},on:{click:function(e){t.snackbar=!1}}},"v-btn",n,!1),[t._v("Close")])]}}],null,!1,785509422),model:{value:t.snackbar,callback:function(e){t.snackbar=e},expression:"snackbar"}},[t._v(" "+t._s(t.snackbarMessage)+" ")])],1)],1):t._e()},L=[],F=(a("c975"),a("d81d"),{data:function(){return{dialog:!1,keys:[],headers:[],data:[],editedItem:{},addNew:!1,snackbar:!1,snackbarMessage:"",apiDataReturned:!1}},components:{PopUpModal:d["a"]},computed:{formTitle:function(){return!0===this.addNew?"NEW CCY":"EDIT ".concat(this.editedItem.Ccy)},ccyList:function(){return this.data.map((function(t){return t.Ccy}))}},watch:{dialog:function(t){t||this.close()}},created:function(){o["a"].GetCrossSetup(),this.initialize()},methods:{initialize:function(){var t=this;o["a"].GetCcySetup().then((function(e){t.data=JSON.parse(e.data.ccySetup);var a=[];t.keys=Object.keys(t.data[0]),t.keys.forEach((function(t){a.push({text:t,value:t,align:"center"})})),a.push({text:"Actions",value:"actions",align:"center",sortable:!1}),t.headers=a,t.apiDataReturned=!0})).catch((function(e){t.snackbarMessage=" Error: ".concat(e),t.snackbar=!0}))},editItem:function(t){this.editedItem=Object.assign({},t),this.dialog=!0},AddNewCcy:function(t){this.addNew=!0;var e=this.ccyList.indexOf(t);Object.assign(this.editedItem,this.data[e]),delete this.editedItem.Ccy,this.dialog=!0},deleteItem:function(t){var e=this;confirm("Are you sure you want to delete ".concat(t.Ccy,"?"))&&o["a"].DeleteCcyData({Ccy:t.Ccy}).then((function(a){e.snackbarMessage="".concat(t.Ccy," deleted succesfully."),e.snackbar=!0,e.initialize()})).catch((function(t){!0===t.toString().includes("403")&&(t="Admin Rights Required"),e.snackbarMessage=" Delete Unsuccessful. ".concat(t),e.snackbar=!0}))},close:function(){this.dialog=!1,this.$nextTick((function(){}))},save:function(t){var e=this;return Object(c["a"])(regeneratorRuntime.mark((function a(){return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return a.prev=0,a.next=3,o["a"].UpdateCcyDets(t);case 3:a.sent,e.snackbarMessage="".concat(t.Ccy," updated succesfully."),e.snackbar=!0,e.initialize(),a.next=14;break;case 9:a.prev=9,a.t0=a["catch"](0),!0===a.t0.toString().includes("403")&&(a.t0="Admin Rights Required"),e.snackbarMessage="Update unsucessful. ".concat(a.t0),e.snackbar=!0;case 14:e.close();case 15:case"end":return a.stop()}}),a,null,[[0,9]])})))()}}}),Z=F,P=(a("0f10"),Object(f["a"])(Z,j,L,!1,null,null,null)),G=P.exports;p()(P,{VBtn:h["a"],VCard:b["a"],VCardActions:k["a"],VCardText:k["c"],VCardTitle:k["d"],VCol:g["a"],VContainer:C["a"],VDataTable:x["a"],VDialog:y["a"],VIcon:S["a"],VRow:I["a"],VSnackbar:$["a"],VSpacer:_["a"],VTextField:T["a"],VToolbar:V["a"],VToolbarTitle:D["a"]});var J=function(){var t=this,e=t.$createElement,a=t._self._c||e;return t.apiDataReturned?a("div",[a("v-card",[a("v-btn",{attrs:{absolute:"",dark:"",small:"",fab:"",top:"",right:"",color:"pink",elevation:"12"},on:{click:t.addNewOptionCut}},[a("v-icon",[t._v("mdi-expand-all")])],1)],1),a("v-data-table",{staticClass:"elevation-10 custom-transform-class",attrs:{headers:t.headers,items:t.data,"sort-by":"CutName",dense:"","disable-pagination":"","hide-default-footer":""},scopedSlots:t._u([{key:"top",fn:function(){return[a("v-toolbar",{staticClass:"mb-3",attrs:{dense:"",dark:"",color:"#385F73"}},[a("v-toolbar-title",[t._v("expiry cut Settings")]),a("v-spacer"),a("v-dialog",{attrs:{"max-width":"500"},model:{value:t.dialog,callback:function(e){t.dialog=e},expression:"dialog"}},[a("v-card",[a("v-card-title",[a("v-spacer"),a("span",{staticClass:"title"},[t._v(t._s(t.formTitle))]),a("v-spacer")],1),a("v-card-text",[a("v-text-field",{attrs:{label:"CutName"},model:{value:t.editedItem["CutName"],callback:function(e){t.$set(t.editedItem,"CutName",e)},expression:"editedItem['CutName']"}}),a("v-select",{attrs:{items:t.cutIds,label:"TimeZone"},model:{value:t.editedItem["TimeZone"],callback:function(e){t.$set(t.editedItem,"TimeZone",e)},expression:"editedItem['TimeZone']"}}),a("v-text-field",{attrs:{label:"TimeAtCutCenter"},model:{value:t.editedItem["TimeAtCutCenter"],callback:function(e){t.$set(t.editedItem,"TimeAtCutCenter",e)},expression:"editedItem['TimeAtCutCenter']"}})],1),a("v-card-actions",[a("v-spacer"),a("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:t.close}},[t._v("Cancel")]),a("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:function(e){return t.save(t.editedItem)}}},[t._v("Save")]),a("v-spacer")],1)],1)],1)],1)]},proxy:!0},{key:"item.actions",fn:function(e){var n=e.item;return[a("v-icon",{staticClass:"mr-2",attrs:{small:""},on:{click:function(e){return t.editItem(n)}}},[t._v("mdi-pencil")]),a("v-icon",{attrs:{small:""},on:{click:function(e){return t.deleteItem(n)}}},[t._v("mdi-delete")])]}},{key:"no-data",fn:function(){return[a("v-btn",{attrs:{color:"primary"},on:{click:t.initialize}},[t._v("Reset")])]},proxy:!0}],null,!1,1405272777)}),a("div",{staticClass:"text-center ma-2"},[a("v-snackbar",{attrs:{rounded:"pill",centered:"",elevation:"20"},scopedSlots:t._u([{key:"action",fn:function(e){var n=e.attrs;return[a("v-btn",t._b({attrs:{color:"pink",text:""},on:{click:function(e){t.snackbar=!1}}},"v-btn",n,!1),[t._v("Close")])]}}],null,!1,785509422),model:{value:t.snackbar,callback:function(e){t.snackbar=e},expression:"snackbar"}},[t._v(" "+t._s(t.snackbarMessage)+" ")])],1)],1):t._e()},W=[],B={data:function(){return{dialog:!1,keys:[],headers:[],data:[],editedItem:{},addNew:!1,snackbar:!1,snackbarMessage:"",apiDataReturned:!1,cutIds:[]}},components:{PopUpModal:d["a"]},computed:{formTitle:function(){return!0===this.addNew?"NEW CUT":"EDIT ".concat(this.editedItem.CutName," CUT")}},watch:{dialog:function(t){t||this.close()}},created:function(){var t=this;this.initialize(),o["a"].GetTimeZoneInfos().then((function(e){t.cutIds=JSON.parse(e.data.tzInfo)}))},methods:{initialize:function(){var t=this;o["a"].GetOptCutSettings().then((function(e){t.data=JSON.parse(e.data.optCuts);var a=[];t.keys=Object.keys(t.data[0]),t.keys.forEach((function(t){a.push({text:t,value:t,align:"center"})})),a.push({text:"Actions",value:"actions",align:"center",sortable:!1}),t.headers=a,t.apiDataReturned=!0})).catch((function(e){t.snackbarMessage=" Error: ".concat(e),t.snackbar=!0}))},editItem:function(t){this.editedItem=Object.assign({},t),this.dialog=!0},addNewOptionCut:function(){this.addNew=!0,this.dialog=!0},deleteItem:function(t){var e=this;confirm("Are you sure you want to delete ".concat(t.CutName,"?"))&&o["a"].DeleteOptionCut({Cut:t.CutName}).then((function(a){e.snackbarMessage="".concat(t.CutName," deleted succesfully."),e.snackbar=!0,e.initialize()})).catch((function(t){!0===t.toString().includes("403")&&(t="Admin Rights Required"),e.snackbarMessage=" Delete Unsuccessful. ".concat(t),e.snackbar=!0}))},close:function(){this.dialog=!1,this.$nextTick((function(){}))},save:function(t){var e=this;return Object(c["a"])(regeneratorRuntime.mark((function a(){return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return a.prev=0,a.next=3,o["a"].UpdateOptionCut(t);case 3:a.sent,e.snackbarMessage="".concat(t.CutName," updated succesfully."),e.snackbar=!0,e.initialize(),a.next=14;break;case 9:a.prev=9,a.t0=a["catch"](0),!0===a.t0.toString().includes("403")&&(a.t0="Admin Rights Required"),e.snackbarMessage="Update unsucessful. ".concat(a.t0),e.snackbar=!0;case 14:e.close();case 15:case"end":return a.stop()}}),a,null,[[0,9]])})))()}}},q=B,K=(a("fb73"),a("b974")),H=Object(f["a"])(q,J,W,!1,null,null,null),X=H.exports;p()(H,{VBtn:h["a"],VCard:b["a"],VCardActions:k["a"],VCardText:k["c"],VCardTitle:k["d"],VDataTable:x["a"],VDialog:y["a"],VIcon:S["a"],VSelect:K["a"],VSnackbar:$["a"],VSpacer:_["a"],VTextField:T["a"],VToolbar:V["a"],VToolbarTitle:D["a"]});var Y=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-container",{attrs:{fluid:""}},[a("div",{staticClass:"d-flex flex-column"},[a("v-select",{attrs:{items:t.spotIfaces,label:"Spot Interface"},on:{change:function(e){return t.changeIface()}},model:{value:t.spotIface,callback:function(e){t.spotIface=e},expression:"spotIface"}}),a("v-select",{attrs:{items:t.swapIfaces,label:"Swaps Interface"},on:{change:function(e){return t.changeIface()}},model:{value:t.swapIface,callback:function(e){t.swapIface=e},expression:"swapIface"}}),a("v-select",{attrs:{items:t.timeZones,label:"TimeZone"},on:{change:function(e){return t.updateTimeZone()}},model:{value:t.timeZone,callback:function(e){t.timeZone=e},expression:"timeZone"}}),a("v-select",{attrs:{items:t.crossList,label:"Starter Cross"},on:{change:function(e){return t.updateStarterFxCross()}},model:{value:t.starterFxCross,callback:function(e){t.starterFxCross=e},expression:"starterFxCross"}})],1)])},Q=[],tt=a("5530"),et=a("2f62"),at=a("4c35"),nt=a("4994"),st={created:function(){var t=this;return Object(c["a"])(regeneratorRuntime.mark((function e(){var a,n,s;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,t.$store.dispatch("checkLoginStatus");case 3:return a=e.sent,e.next=6,o["a"].GetTimeZoneInfos();case 6:return n=e.sent,e.next=9,at["a"].CurrentInterfaces({UserName:t.currentUser});case 9:s=e.sent,t.spotIface=JSON.parse(s.data.spot),t.swapIface=JSON.parse(s.data.swap),t.timeZones=JSON.parse(n.data.tzInfo),t.timeZone=a.Timezone,t.starterFxCross=a.StarterFxCross,e.next=20;break;case 17:e.prev=17,e.t0=e["catch"](0),alert(e.t0);case 20:case"end":return e.stop()}}),e,null,[[0,17]])})))()},data:function(){return{spotIfaces:["InvestingDotCom","MongoDB"],swapIfaces:["EmpireFX","MongoDB"],spotIface:"",swapIface:"",timeZones:[],timeZone:"",starterFxCross:""}},computed:Object(tt["a"])({},Object(et["b"])({crossList:function(t){return t.crossList},currentUser:function(t){return t.currentUser}})),methods:{changeIface:function(){var t=this;at["a"].ChangeInterface({UserName:this.$store.state.currentUser,SpotApi:this.spotIface,SwapApi:this.swapIface}).then((function(e){t.spotIface=JSON.parse(e.data.spot),t.swapIface=JSON.parse(e.data.swap),t.$store.dispatch("setSnackbar",{text:"User Settings Updated",top:!0}),t.$store.dispatch("setSnackbar",{text:"Interface Updated",bottom:!0})})).catch((function(e){t.$store.dispatch("setSnackbar",{text:"".concat(e,"  -method: UserSettings(changeIface)"),top:!0})}))},updateStarterFxCross:function(){var t=this;return Object(c["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,nt["a"].updateUserStartFxCross({UserName:t.$store.state.currentUser,StarterFxCross:t.starterFxCross});case 3:t.$store.dispatch("setSnackbar",{text:"Starter Cross Updated To ".concat(t.starterFxCross),bottom:!0}),e.next=9;break;case 6:e.prev=6,e.t0=e["catch"](0),alert(e.t0);case 9:case"end":return e.stop()}}),e,null,[[0,6]])})))()},updateTimeZone:function(){var t=this;return Object(c["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,nt["a"].updateUserTimeZone({UserName:t.$store.state.currentUser,Timezone:t.timeZone});case 3:t.$store.dispatch("setSnackbar",{text:"User TimeZone Changed To ".concat(t.timeZone),bottom:!0}),e.next=9;break;case 6:e.prev=6,e.t0=e["catch"](0),alert(e.t0);case 9:case"end":return e.stop()}}),e,null,[[0,6]])})))()}}},it=st,rt=Object(f["a"])(it,Y,Q,!1,null,null,null),ct=rt.exports;p()(rt,{VContainer:C["a"],VSelect:K["a"]});var ot={name:"Setup",created:function(){window.addEventListener("resize",this.handleResize),this.handleResize()},destroyed:function(){window.removeEventListener("resize",this.handleResize)},data:function(){return{settingHeaders:["Dvi Settings","Cross Settings","Ccy Settings","Expiry Cut Settings","User Settings"],settingSelection:"Dvi Settings",window:{width:0,height:0}}},components:{DviSetup:N,CrossSetup:z,CcySetup:G,PopUpModal:d["a"],UserSettings:ct,ExpiryCutSettings:X},computed:{zoomLevel:function(){var t=window.innerWidth>1700?"100%":"90%";return{zoom:t}}},methods:{ChangeSettings:function(t){this.settingSelection=t},handleResize:function(){this.window.width=window.innerWidth,this.window.height=window.innerHeight-65,document.documentElement.style.setProperty("--main-width","".concat(this.window.width,"px")),document.documentElement.style.setProperty("--main-height","".concat(this.window.height,"px"))}}},lt=ot,dt=(a("e1c8"),a("8860")),ut=a("da13"),vt=a("1800"),ft=a("5d23"),mt=a("e0c7"),pt=Object(f["a"])(lt,n,s,!1,null,null,null);e["default"]=pt.exports;p()(pt,{VCard:b["a"],VContainer:C["a"],VIcon:S["a"],VList:dt["a"],VListItem:ut["a"],VListItemAction:vt["a"],VListItemContent:ft["a"],VListItemTitle:ft["b"],VSpacer:_["a"],VSubheader:mt["a"],VToolbar:V["a"]})},"4c35":function(t,e,a){"use strict";var n=a("4a4a");e["a"]={GetSpotRates:function(t){return n["a"].post("SpotRates",t)},CurrentInterfaces:function(t){return n["a"].post("CurrentInterfaces",t)},GetSwaps:function(t){return n["a"].post("GetSwaps",t)},GetBaseRates:function(t){return n["a"].post("GetBaseRates",t)},GetRateTiles:function(t){return n["a"].post("GetRateTiles",t)},ChangeInterface:function(t){return n["a"].post("ChangeInterface",t)}}},"546a":function(t,e,a){"use strict";var n=a("a927"),s=a.n(n);s.a},6029:function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("v-data-table",{staticClass:"elevation-10 custom-transform-class",attrs:{headers:t.headers,items:t.data,dense:"","disable-pagination":"","hide-default-footer":""},scopedSlots:t._u([{key:"top",fn:function(){return[a("v-toolbar",{staticClass:"mb-3",attrs:{dark:"",color:"blue lighten-2",dense:""}},[a("v-toolbar-title",[t._v(t._s(t.tableTitle))]),a("v-spacer"),a("v-dialog",{attrs:{"max-width":"1000px"},model:{value:t.dialog,callback:function(e){t.dialog=e},expression:"dialog"}},[a("v-card",[a("v-card-title",[a("span",{staticClass:"title"},[t._v(t._s(t.formTitle))])]),a("v-card-text",[a("v-container",[a("v-row",t._l(t.keys,(function(e){return a("v-col",{key:e,attrs:{cols:"12",sm:"6",md:"2"}},[a("v-text-field",{attrs:{label:e},model:{value:t.editedItem[e],callback:function(a){t.$set(t.editedItem,e,a)},expression:"editedItem[key]"}})],1)})),1)],1)],1),a("v-card-actions",[a("v-spacer"),a("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:t.close}},[t._v("Cancel")]),a("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:function(e){return t.save(t.editedItem)}}},[t._v("Save")])],1)],1)],1)],1)]},proxy:!0},{key:"item.actions",fn:function(e){var n=e.item;return[a("v-icon",{staticClass:"mr-2",attrs:{small:""},on:{click:function(e){return t.editItem(n)}}},[t._v("mdi-pencil")])]}},{key:"no-data",fn:function(){return[a("v-btn",{attrs:{color:"primary"},on:{click:t.initialize}},[t._v("Reset")])]},proxy:!0}])})],1)},s=[],i=(a("99af"),a("4160"),a("b64b"),a("d3b7"),a("159b"),a("ddb0"),{data:function(){return{dialog:!1,keys:[],headers:[],data:[],editedItem:{}}},components:{},props:{crossName:{type:String},title:{type:String},incomingData:{type:Array}},computed:{formTitle:function(){return"EDIT ".concat(this.editedItem.Term)},tableTitle:function(){return"".concat(this.crossName," ").concat(this.title)}},watch:{dialog:function(t){t||this.close()},crossName:function(){this.initialize()}},created:function(){this.initialize()},methods:{initialize:function(){this.data=this.incomingData;var t=[];this.keys=Object.keys(this.data[0]),this.keys.forEach((function(e){t.push({text:e,value:e,align:"center"})})),t.push({text:"Actions",value:"actions",align:"center"}),this.headers=t},editItem:function(t){this.editedItem=Object.assign({},t),this.dialog=!0},close:function(){this.dialog=!1,this.$nextTick((function(){}))},save:function(){this.close()}}}),r=i,c=(a("1f63"),a("2877")),o=a("6544"),l=a.n(o),d=a("8336"),u=a("b0af"),v=a("99d9"),f=a("62ad"),m=a("a523"),p=a("8fea"),h=a("169a"),b=a("132d"),k=a("0fd9"),g=a("2fa4"),C=a("8654"),x=a("71d9"),y=a("2a7f"),w=Object(c["a"])(r,n,s,!1,null,null,null);e["a"]=w.exports;l()(w,{VBtn:d["a"],VCard:u["a"],VCardActions:v["a"],VCardText:v["c"],VCardTitle:v["d"],VCol:f["a"],VContainer:m["a"],VDataTable:p["a"],VDialog:h["a"],VIcon:b["a"],VRow:k["a"],VSpacer:g["a"],VTextField:C["a"],VToolbar:x["a"],VToolbarTitle:y["a"]})},"865a":function(t,e,a){},a927:function(t,e,a){},bfeb:function(t,e,a){},d689:function(t,e,a){},e1c8:function(t,e,a){"use strict";var n=a("865a"),s=a.n(n);s.a},fb73:function(t,e,a){"use strict";var n=a("bfeb"),s=a.n(n);s.a}}]);
//# sourceMappingURL=chunk-3b484843.4335b3cb.js.map