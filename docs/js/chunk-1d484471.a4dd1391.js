(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1d484471"],{"20e8":function(t,e,a){"use strict";var s=a("391f"),n=a.n(s);n.a},"26d3":function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{style:t.zoomLevel},[a("v-toolbar",{attrs:{color:"#126496","min-width":"300",collapse:"",dense:""}},[a("v-spacer"),a("h4",{staticClass:"font-weight-medium text-center text-uppercase grey--text text--lighten-3"},[t._v(" Settings ")]),a("v-spacer")],1)],1),a("div",{staticClass:"d-flex flex-nowrap align-start justify-start"},[a("v-card",{staticClass:"mr-3 mt-8",style:t.zoomLevel,attrs:{"min-width":"225",height:t.mainWindowHeight,shaped:""}},[a("TreeView",{attrs:{inputData:{list:this.settingHeaders,listName:"Corevolfx Options"}},on:{selection:t.ChangeSettings}})],1),a("v-container",{style:t.containerStyle},[a("div",{staticClass:"mt-5",style:t.zoomLevel},[a("transition",{attrs:{name:"slide"}},["Dvi Settings"===t.settingSelection?a("DviSetup"):t._e()],1),a("transition",{attrs:{name:"slide"}},["Cross Settings"===t.settingSelection?a("CrossSetup"):t._e()],1),a("transition",{attrs:{name:"slide"}},["Ccy Settings"===t.settingSelection?a("CcySetup"):t._e()],1)],1)])],1)])},n=[],i=(a("99af"),function(){var t=this,e=t.$createElement,a=t._self._c||e;return t.apiDataReturned?a("div",[a("v-card",[a("v-card",[a("v-btn",{attrs:{absolute:"",small:"",fab:"",top:"",right:"",color:"pink",elevation:"12"}},[a("PopUpModal",{attrs:{inputData:this.$store.state.crossList,icon:"mdi-expand-all",color:"white",large:!1,title:"MIRROR CROSS"},on:{selection:t.OpenDialog}})],1)],1)],1),a("v-data-table",{staticClass:"elevation-10 custom-transform-class",attrs:{headers:t.headers,items:t.data,"sort-by":"Cross",dense:"","disable-pagination":"","hide-default-footer":""},scopedSlots:t._u([{key:"top",fn:function(){return[a("v-toolbar",{staticClass:"mb-3",attrs:{dense:"",dark:"",color:"#385F73"}},[a("v-toolbar-title",[t._v("Dvi Settings")]),a("v-spacer"),a("v-dialog",{attrs:{"max-width":"1000px","overlay-opacity":"0.8"},model:{value:t.dialog,callback:function(e){t.dialog=e},expression:"dialog"}},[a("v-card",[a("v-card-title",[a("span",{staticClass:"title"},[t._v(t._s(t.formTitle))])]),a("v-card-text",[a("v-container",[a("v-row",t._l(t.keys,(function(e){return a("v-col",{key:e,attrs:{cols:"12",sm:"6",md:"2"}},[a("v-text-field",{attrs:{label:e},model:{value:t.editedItem[e],callback:function(a){t.$set(t.editedItem,e,a)},expression:"editedItem[key]"}})],1)})),1)],1)],1),a("v-card-actions",[a("v-spacer"),a("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:t.close}},[t._v("Cancel")]),a("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:function(e){return t.save(t.editedItem)}}},[t._v("Save")])],1)],1)],1)],1)]},proxy:!0},{key:"item.mults",fn:function(e){var s=e.item;return[a("v-icon",{attrs:{small:""},on:{click:function(e){return t.viewMultsAndSpreads(s)}}},[t._v("mdi-eye")])]}},{key:"item.actions",fn:function(e){var s=e.item;return[a("v-icon",{staticClass:"mr-2",attrs:{small:""},on:{click:function(e){return t.editItem(s)}}},[t._v("mdi-pencil")]),a("v-icon",{staticClass:"mr-2",attrs:{small:""},on:{click:function(e){return t.deleteItem(s)}}},[t._v("mdi-delete")])]}}],null,!1,2074081009)}),a("v-dialog",{attrs:{"max-width":t.marketTableWidth,"overlay-opacity":"0.8"},model:{value:t.showMarketTable,callback:function(e){t.showMarketTable=e},expression:"showMarketTable"}},[a("v-card",[t.showMarketTable?a("MarketDataTable",{attrs:{crossName:t.selectedCross,title:t.marketTableTitle,incomingData:t.marketData}}):t._e()],1)],1),a("v-dialog",{attrs:{"max-width":t.mainWindowWidth,"overlay-opacity":"0.8"},model:{value:t.showDialogAddNewCross,callback:function(e){t.showDialogAddNewCross=e},expression:"showDialogAddNewCross"}},[a("v-card",[a("v-card-title",[a("span",{staticClass:"title"},[t._v(t._s(t.FormTitleAddNewCross))])]),a("v-card-text",[a("v-container",[a("v-row",t._l(t.dviKeys,(function(e){return a("v-col",{key:e,attrs:{cols:"12",sm:"6",md:"2"}},[a("v-text-field",{attrs:{label:e},model:{value:t.dviEdited[e],callback:function(a){t.$set(t.dviEdited,e,a)},expression:"dviEdited[key]"}})],1)})),1),a("v-divider",{staticClass:"mt-5 mb-10"}),a("v-row",t._l(t.crossKeys,(function(e){return a("v-col",{key:e,attrs:{cols:"12",sm:"6",md:"2"}},[a("v-text-field",{attrs:{label:e},model:{value:t.crossEdited[e],callback:function(a){t.$set(t.crossEdited,e,a)},expression:"crossEdited[key]"}})],1)})),1)],1)],1),a("v-card-actions",[a("v-spacer"),a("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:t.CloseNewCrossDialog}},[t._v("Cancel")]),a("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:function(e){return t.SaveNewCross(t.dviEdited,t.crossEdited)}}},[t._v("Save")])],1)],1)],1)],1):t._e()}),o=[],c=(a("4160"),a("caad"),a("b64b"),a("d3b7"),a("25f0"),a("2532"),a("159b"),a("ddb0"),a("f0c4")),r=a("83e6"),l=a("d017"),d={name:"DviSetup",components:{MarketDataTable:r["a"],PopUpModal:l["a"]},data:function(){return{dialog:!1,showDialogAddNewCross:!1,keys:[],headers:[],data:[],editedItem:{},showMarketTable:!1,marketData:[],marketTableTitle:"",marketTableWidth:"",selectedCross:"",apiDataReturned:!1,dviKeys:[],crossKeys:[],dviEdited:{},crossEdited:{},mirroredCross:""}},computed:{formTitle:function(){return"UPDATE ".concat(this.editedItem.Cross)},FormTitleAddNewCross:function(){return"Mirror ".concat(this.mirroredCross)},mainWindowHeight:function(){return window.innerHeight},mainWindowWidth:function(){return window.innerWidth-10}},watch:{dialog:function(t){t||this.close()}},created:function(){this.initialize()},methods:{initialize:function(){var t=this;this.$store.dispatch("refreshCrossList"),c["a"].GetDviSetup().then((function(e){t.data=JSON.parse(e.data.dviSetup);var a=[];t.keys=Object.keys(t.data[0]),t.keys.forEach((function(t){a.push({text:t,value:t,align:"center"})})),a.push({text:"Mults",value:"mults",align:"center"}),a.push({text:"Actions",value:"actions",align:"center"}),t.headers=a,t.apiDataReturned=!0})).catch((function(e){t.snackbarMessage=" Error: ".concat(e),t.snackbar=!0}))},OpenDialog:function(t){var e=this;c["a"].MirrorCrossDets({Cross:t}).then((function(t){var a=JSON.parse(t.data.dviSetup),s=JSON.parse(t.data.crossSetup);delete s.Cross,e.dviKeys=Object.keys(a),e.crossKeys=Object.keys(s),e.dviEdited=a,e.mirroredCross=e.dviEdited.Cross,e.dviEdited.Cross="",e.crossEdited=s,e.showDialogAddNewCross=!0})).catch((function(t){!0===t.toString().includes("403")&&(t="Admin Rights Required"),e.$store.dispatch("setSnackbar",{text:" ".concat(t),centered:!0})}))},editItem:function(t){this.editedItem=Object.assign({},t),this.dialog=!0},deleteItem:function(t){var e=this;confirm("Are you sure you want to delete ".concat(t.Cross,"?"))&&c["a"].DeleteCcyPairData({Cross:t.Cross}).then((function(a){e.$store.dispatch("setSnackbar",{text:"".concat(t.Cross," deleted succesfully. Status ").concat(a.status),centered:!0}),e.initialize(),e.$emit("ccyPairDeleted",!0)})).catch((function(t){!0===t.toString().includes("403")&&(t="Admin Rights Required"),e.$store.dispatch("setSnackbar",{text:"Delete unsucessful.  ".concat(t),centered:!0})}))},viewMultsAndSpreads:function(t){var e=this,a=t.Cross;c["a"].GetMultsAndSpreads({UserName:this.$store.state.currentUser,Cross:t.Cross}).then((function(t){e.marketData=JSON.parse(t.data.multsAndSpreads),e.selectedCross=a,e.marketTableTitle="MULTIPLERS AND SPREADS",e.marketTableWidth="1000px",e.showMarketTable=!0})).catch((function(t){e.snackbarMessage=" Error: ".concat(t),e.snackbar=!0}))},close:function(){this.dialog=!1,this.$nextTick((function(){}))},save:function(t){var e=this;this.$store.dispatch("setSnackbar",{text:"Processing ".concat(t.Cross," DVI update ..."),centered:!0,timeout:2500}),c["a"].UpdateDviDets({DviInputsUI:t,UserName:this.$store.state.currentUser}).then((function(a){e.$store.dispatch("setSnackbar",{text:"".concat(t.Cross," updated succesfully. Status ").concat(a.status),centered:!0}),e.initialize()})).catch((function(t){!0===t.toString().includes("403")&&(t="Admin Rights Required"),e.$store.dispatch("setSnackbar",{text:"Update unsucessful.  ".concat(t),centered:!0})})),this.close()},CloseNewCrossDialog:function(){this.showDialogAddNewCross=!1,this.$nextTick((function(){}))},SaveNewCross:function(t,e){var a=this;e.Cross=t.Cross,c["a"].AddNewCcyPair({DviInputsUI:t,CrossDetsUI:e}).then((function(e){a.$store.dispatch("refreshCrossList"),a.$store.dispatch("setSnackbar",{text:" ".concat(t.Cross," updated succesfully. Status ").concat(e.status),centered:!0}),a.refreshChildren=!a.refreshChildren,a.initialize()})).catch((function(t){!0===t.toString().includes("403")&&(t="Admin Rights Required"),a.$store.dispatch("setSnackbar",{text:"Update unsucessful.  ".concat(t),centered:!0})})),this.CloseNewCrossDialog()}}},u=d,v=(a("ae0b"),a("2877")),f=a("6544"),m=a.n(f),h=a("8336"),p=a("b0af"),b=a("99d9"),k=a("62ad"),g=a("a523"),C=a("8fea"),y=a("169a"),x=a("ce7e"),S=a("132d"),w=a("0fd9"),_=a("2fa4"),T=a("8654"),D=a("71d9"),V=a("2a7f"),I=Object(v["a"])(u,i,o,!1,null,null,null),R=I.exports;m()(I,{VBtn:h["a"],VCard:p["a"],VCardActions:b["a"],VCardText:b["c"],VCardTitle:b["d"],VCol:k["a"],VContainer:g["a"],VDataTable:C["a"],VDialog:y["a"],VDivider:x["a"],VIcon:S["a"],VRow:w["a"],VSpacer:_["a"],VTextField:T["a"],VToolbar:D["a"],VToolbarTitle:V["a"]});var A=function(){var t=this,e=t.$createElement,a=t._self._c||e;return t.apiDataReturned?a("div",[a("v-data-table",{staticClass:"elevation-10 custom-transform-class",attrs:{headers:t.headers,items:t.data,"sort-by":"Cross",dense:"","disable-pagination":"","hide-default-footer":""},scopedSlots:t._u([{key:"top",fn:function(){return[a("v-toolbar",{staticClass:"mb-3",attrs:{dense:"",dark:"",color:"#385F73"}},[a("v-toolbar-title",[t._v("Cross Settings")]),a("v-spacer"),a("v-dialog",{attrs:{"max-width":"1000px"},model:{value:t.dialog,callback:function(e){t.dialog=e},expression:"dialog"}},[a("v-card",[a("v-card-title",[a("span",{staticClass:"title"},[t._v(t._s(t.formTitle))])]),a("v-card-text",[a("v-container",[a("v-row",t._l(t.keys,(function(e){return a("v-col",{key:e,attrs:{cols:"12",sm:"6",md:"2"}},[a("v-text-field",{attrs:{label:e},model:{value:t.editedItem[e],callback:function(a){t.$set(t.editedItem,e,a)},expression:"editedItem[key]"}})],1)})),1)],1)],1),a("v-card-actions",[a("v-spacer"),a("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:t.close}},[t._v("Cancel")]),a("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:function(e){return t.save(t.editedItem)}}},[t._v("Save")])],1)],1)],1)],1)]},proxy:!0},{key:"item.actions",fn:function(e){var s=e.item;return[a("v-icon",{staticClass:"mr-2",attrs:{small:""},on:{click:function(e){return t.editItem(s)}}},[t._v("mdi-pencil")])]}}],null,!1,1549467766)}),a("div",{staticClass:"text-center ma-2"},[a("v-snackbar",{attrs:{rounded:"pill",centered:"",elevation:"20"},scopedSlots:t._u([{key:"action",fn:function(e){var s=e.attrs;return[a("v-btn",t._b({attrs:{color:"pink",text:""},on:{click:function(e){t.snackbar=!1}}},"v-btn",s,!1),[t._v("Close")])]}}],null,!1,785509422),model:{value:t.snackbar,callback:function(e){t.snackbar=e},expression:"snackbar"}},[t._v(" "+t._s(t.snackbarMessage)+" ")])],1)],1):t._e()},M=[],E={data:function(){return{dialog:!1,keys:[],headers:[],data:[],editedItem:{},snackbar:!1,snackbarMessage:"",apiDataReturned:!1}},computed:{formTitle:function(){return"EDIT ".concat(this.editedItem.Cross)}},watch:{dialog:function(t){t||this.close()}},created:function(){this.initialize()},methods:{initialize:function(){var t=this;c["a"].GetCrossSetup().then((function(e){t.data=JSON.parse(e.data.crossSetup);var a=[];t.keys=Object.keys(t.data[0]),t.keys.forEach((function(t){a.push({text:t,value:t,align:"center"})})),a.push({text:"Actions",value:"actions",align:"center"}),t.headers=a,t.apiDataReturned=!0})).catch((function(e){t.snackbarMessage=" Error: ".concat(e),t.snackbar=!0}))},editItem:function(t){this.editedItem=Object.assign({},t),this.dialog=!0},close:function(){this.dialog=!1,this.$nextTick((function(){}))},save:function(t){var e=this;c["a"].UpdateCrossDets(t).then((function(a){e.snackbarMessage="".concat(t.Cross," updated succesfully. Status ").concat(a.status),e.snackbar=!0,e.initialize()})).catch((function(t){!0===t.toString().includes("403")&&(t="Admin Rights Required"),e.snackbarMessage="Update unsucessful.  ".concat(t),e.snackbar=!0})),this.close()}}},N=E,$=(a("a414"),a("2db4")),O=Object(v["a"])(N,A,M,!1,null,null,null),z=O.exports;m()(O,{VBtn:h["a"],VCard:p["a"],VCardActions:b["a"],VCardText:b["c"],VCardTitle:b["d"],VCol:k["a"],VContainer:g["a"],VDataTable:C["a"],VDialog:y["a"],VIcon:S["a"],VRow:w["a"],VSnackbar:$["a"],VSpacer:_["a"],VTextField:T["a"],VToolbar:D["a"],VToolbarTitle:V["a"]});var U=function(){var t=this,e=t.$createElement,a=t._self._c||e;return t.apiDataReturned?a("div",[a("v-card",[a("v-btn",{attrs:{absolute:"",small:"",fab:"",top:"",right:"",color:"pink",elevation:"12"}},[a("PopUpModal",{attrs:{inputData:t.ccyList,icon:"mdi-expand-all",color:"white",large:!1,title:"MIRROR CCY"},on:{selection:t.AddNewCcy}})],1)],1),a("v-data-table",{staticClass:"elevation-10 custom-transform-class",attrs:{headers:t.headers,items:t.data,"sort-by":"Ccy",dense:"","disable-pagination":"","hide-default-footer":""},scopedSlots:t._u([{key:"top",fn:function(){return[a("v-toolbar",{staticClass:"mb-3",attrs:{dense:"",dark:"",color:"#385F73"}},[a("v-toolbar-title",[t._v("Ccy Settings")]),a("v-spacer"),a("v-dialog",{attrs:{"max-width":"1000px"},model:{value:t.dialog,callback:function(e){t.dialog=e},expression:"dialog"}},[a("v-card",[a("v-card-title",[a("span",{staticClass:"title"},[t._v(t._s(t.formTitle))])]),a("v-card-text",[a("v-container",[a("v-row",t._l(t.keys,(function(e){return a("v-col",{key:e,attrs:{cols:"12",sm:"6",md:"2"}},[a("v-text-field",{attrs:{label:e},model:{value:t.editedItem[e],callback:function(a){t.$set(t.editedItem,e,a)},expression:"editedItem[key]"}})],1)})),1)],1)],1),a("v-card-actions",[a("v-spacer"),a("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:t.close}},[t._v("Cancel")]),a("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:function(e){return t.save(t.editedItem)}}},[t._v("Save")])],1)],1)],1)],1)]},proxy:!0},{key:"item.actions",fn:function(e){var s=e.item;return[a("v-icon",{staticClass:"mr-2",attrs:{small:""},on:{click:function(e){return t.editItem(s)}}},[t._v("mdi-pencil")]),a("v-icon",{attrs:{small:""},on:{click:function(e){return t.deleteItem(s)}}},[t._v("mdi-delete")])]}},{key:"no-data",fn:function(){return[a("v-btn",{attrs:{color:"primary"},on:{click:t.initialize}},[t._v("Reset")])]},proxy:!0}],null,!1,1519027926)}),a("div",{staticClass:"text-center ma-2"},[a("v-snackbar",{attrs:{rounded:"pill",centered:"",elevation:"20"},scopedSlots:t._u([{key:"action",fn:function(e){var s=e.attrs;return[a("v-btn",t._b({attrs:{color:"pink",text:""},on:{click:function(e){t.snackbar=!1}}},"v-btn",s,!1),[t._v("Close")])]}}],null,!1,785509422),model:{value:t.snackbar,callback:function(e){t.snackbar=e},expression:"snackbar"}},[t._v(" "+t._s(t.snackbarMessage)+" ")])],1)],1):t._e()},W=[],j=(a("c975"),a("d81d"),{data:function(){return{dialog:!1,keys:[],headers:[],data:[],editedItem:{},addNew:!1,snackbar:!1,snackbarMessage:"",apiDataReturned:!1}},components:{PopUpModal:l["a"]},computed:{formTitle:function(){return!0===this.addNew?"NEW CCY":"EDIT ".concat(this.editedItem.Ccy)},ccyList:function(){return this.data.map((function(t){return t.Ccy}))}},watch:{dialog:function(t){t||this.close()}},created:function(){c["a"].GetCrossSetup(),this.initialize()},methods:{initialize:function(){var t=this;c["a"].GetCcySetup().then((function(e){t.data=JSON.parse(e.data.ccySetup);var a=[];t.keys=Object.keys(t.data[0]),t.keys.forEach((function(t){a.push({text:t,value:t,align:"center"})})),a.push({text:"Actions",value:"actions",align:"center",sortable:!1}),t.headers=a,t.apiDataReturned=!0})).catch((function(e){t.snackbarMessage=" Error: ".concat(e),t.snackbar=!0}))},editItem:function(t){this.editedItem=Object.assign({},t),this.dialog=!0},AddNewCcy:function(t){this.addNew=!0;var e=this.ccyList.indexOf(t);Object.assign(this.editedItem,this.data[e]),delete this.editedItem.Ccy,this.dialog=!0},deleteItem:function(t){var e=this;confirm("Are you sure you want to delete ".concat(t.Ccy,"?"))&&c["a"].DeleteCcyData({Ccy:t.Ccy}).then((function(a){e.snackbarMessage="".concat(t.Ccy," deleted succesfully. Status ").concat(a.status),e.snackbar=!0,e.initialize()})).catch((function(t){!0===t.toString().includes("403")&&(t="Admin Rights Required"),e.snackbarMessage=" Delete Unsuccessful. ".concat(t),e.snackbar=!0}))},close:function(){this.dialog=!1,this.$nextTick((function(){}))},save:function(t){var e=this;c["a"].UpdateCcyDets(t).then((function(a){e.snackbarMessage="".concat(t.Ccy," updated succesfully. Status ").concat(a.status),e.snackbar=!0,e.initialize()})).catch((function(t){!0===t.toString().includes("403")&&(t="Admin Rights Required"),e.snackbarMessage="Update unsucessful. ".concat(t),e.snackbar=!0})),this.close()}}}),L=j,P=(a("20e8"),Object(v["a"])(L,U,W,!1,null,null,null)),F=P.exports;m()(P,{VBtn:h["a"],VCard:p["a"],VCardActions:b["a"],VCardText:b["c"],VCardTitle:b["d"],VCol:k["a"],VContainer:g["a"],VDataTable:C["a"],VDialog:y["a"],VIcon:S["a"],VRow:w["a"],VSnackbar:$["a"],VSpacer:_["a"],VTextField:T["a"],VToolbar:D["a"],VToolbarTitle:V["a"]});var H=a("52b7"),J={name:"Setup",data:function(){return{settingHeaders:["Dvi Settings","Cross Settings","Ccy Settings"],settingSelection:"Dvi Settings"}},components:{DviSetup:R,CrossSetup:z,CcySetup:F,PopUpModal:l["a"],TreeView:H["a"]},computed:{zoomLevel:function(){var t=window.innerWidth>1700?"90%":"80%";return{zoom:t}},mainWindowHeight:function(){return window.innerHeight},mainWindowWidth:function(){return window.innerWidth-10},containerStyle:function(){return" display: flex;\n            overflow-x: scroll;\n            padding-left: 0px;\n            padding-right: 0px;\n            width: ".concat(this.mainWindowWidth,"px;\n            height: ").concat(this.mainWindowHeight,"px;")}},methods:{ChangeSettings:function(t){this.settingSelection=t}}},q=J,K=(a("3e4b"),Object(v["a"])(q,s,n,!1,null,null,null));e["default"]=K.exports;m()(K,{VCard:p["a"],VContainer:g["a"],VSpacer:_["a"],VToolbar:D["a"]})},2799:function(t,e,a){},"391f":function(t,e,a){},"3e4b":function(t,e,a){"use strict";var s=a("4cd2"),n=a.n(s);n.a},"4ca5":function(t,e,a){"use strict";var s=a("2799"),n=a.n(s);n.a},"4cd2":function(t,e,a){},7546:function(t,e,a){},"83e6":function(t,e,a){"use strict";var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("v-data-table",{staticClass:"elevation-10 custom-transform-class",attrs:{headers:t.headers,items:t.data,dense:"","disable-pagination":"","hide-default-footer":""},scopedSlots:t._u([{key:"top",fn:function(){return[a("v-toolbar",{staticClass:"mb-3",attrs:{dark:"",color:"blue lighten-2",dense:""}},[a("v-toolbar-title",[t._v(t._s(t.tableTitle))]),a("v-spacer"),a("v-dialog",{attrs:{"max-width":"1000px"},model:{value:t.dialog,callback:function(e){t.dialog=e},expression:"dialog"}},[a("v-card",[a("v-card-title",[a("span",{staticClass:"title"},[t._v(t._s(t.formTitle))])]),a("v-card-text",[a("v-container",[a("v-row",t._l(t.keys,(function(e){return a("v-col",{key:e,attrs:{cols:"12",sm:"6",md:"2"}},[a("v-text-field",{attrs:{label:e},model:{value:t.editedItem[e],callback:function(a){t.$set(t.editedItem,e,a)},expression:"editedItem[key]"}})],1)})),1)],1)],1),a("v-card-actions",[a("v-spacer"),a("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:t.close}},[t._v("Cancel")]),a("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:function(e){return t.save(t.editedItem)}}},[t._v("Save")])],1)],1)],1)],1)]},proxy:!0},{key:"item.actions",fn:function(e){var s=e.item;return[a("v-icon",{staticClass:"mr-2",attrs:{small:""},on:{click:function(e){return t.editItem(s)}}},[t._v("mdi-pencil")])]}},{key:"no-data",fn:function(){return[a("v-btn",{attrs:{color:"primary"},on:{click:t.initialize}},[t._v("Reset")])]},proxy:!0}])})],1)},n=[],i=(a("99af"),a("4160"),a("b64b"),a("d3b7"),a("159b"),a("ddb0"),{data:function(){return{dialog:!1,keys:[],headers:[],data:[],editedItem:{}}},components:{},props:{crossName:{type:String},title:{type:String},incomingData:{type:Array}},computed:{formTitle:function(){return"EDIT ".concat(this.editedItem.Term)},tableTitle:function(){return"".concat(this.crossName," ").concat(this.title)}},watch:{dialog:function(t){t||this.close()},crossName:function(){this.initialize()}},created:function(){this.initialize()},methods:{initialize:function(){this.data=this.incomingData;var t=[];this.keys=Object.keys(this.data[0]),this.keys.forEach((function(e){t.push({text:e,value:e,align:"center"})})),t.push({text:"Actions",value:"actions",align:"center"}),this.headers=t},editItem:function(t){this.editedItem=Object.assign({},t),this.dialog=!0},close:function(){this.dialog=!1,this.$nextTick((function(){}))},save:function(){this.close()}}}),o=i,c=(a("4ca5"),a("2877")),r=a("6544"),l=a.n(r),d=a("8336"),u=a("b0af"),v=a("99d9"),f=a("62ad"),m=a("a523"),h=a("8fea"),p=a("169a"),b=a("132d"),k=a("0fd9"),g=a("2fa4"),C=a("8654"),y=a("71d9"),x=a("2a7f"),S=Object(c["a"])(o,s,n,!1,null,null,null);e["a"]=S.exports;l()(S,{VBtn:d["a"],VCard:u["a"],VCardActions:v["a"],VCardText:v["c"],VCardTitle:v["d"],VCol:f["a"],VContainer:m["a"],VDataTable:h["a"],VDialog:p["a"],VIcon:b["a"],VRow:k["a"],VSpacer:g["a"],VTextField:C["a"],VToolbar:y["a"],VToolbarTitle:x["a"]})},a414:function(t,e,a){"use strict";var s=a("a4b2"),n=a.n(s);n.a},a4b2:function(t,e,a){},ae0b:function(t,e,a){"use strict";var s=a("7546"),n=a.n(s);n.a}}]);
//# sourceMappingURL=chunk-1d484471.a4dd1391.js.map