(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-5ab83b1c"],{2799:function(t,e,a){},"4ca5":function(t,e,a){"use strict";var n=a("2799"),s=a.n(n);s.a},"83e6":function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("v-data-table",{staticClass:"elevation-10 custom-transform-class",attrs:{headers:t.headers,items:t.data,dense:"","disable-pagination":"","hide-default-footer":""},scopedSlots:t._u([{key:"top",fn:function(){return[a("v-toolbar",{staticClass:"mb-3",attrs:{dark:"",color:"blue lighten-2",dense:""}},[a("v-toolbar-title",[t._v(t._s(t.tableTitle))]),a("v-spacer"),a("v-dialog",{attrs:{"max-width":"1000px"},model:{value:t.dialog,callback:function(e){t.dialog=e},expression:"dialog"}},[a("v-card",[a("v-card-title",[a("span",{staticClass:"title"},[t._v(t._s(t.formTitle))])]),a("v-card-text",[a("v-container",[a("v-row",t._l(t.keys,(function(e){return a("v-col",{key:e,attrs:{cols:"12",sm:"6",md:"2"}},[a("v-text-field",{attrs:{label:e},model:{value:t.editedItem[e],callback:function(a){t.$set(t.editedItem,e,a)},expression:"editedItem[key]"}})],1)})),1)],1)],1),a("v-card-actions",[a("v-spacer"),a("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:t.close}},[t._v("Cancel")]),a("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:function(e){return t.save(t.editedItem)}}},[t._v("Save")])],1)],1)],1)],1)]},proxy:!0},{key:"item.actions",fn:function(e){var n=e.item;return[a("v-icon",{staticClass:"mr-2",attrs:{small:""},on:{click:function(e){return t.editItem(n)}}},[t._v("mdi-pencil")])]}},{key:"no-data",fn:function(){return[a("v-btn",{attrs:{color:"primary"},on:{click:t.initialize}},[t._v("Reset")])]},proxy:!0}])})],1)},s=[],r=(a("99af"),a("4160"),a("b64b"),a("d3b7"),a("159b"),a("ddb0"),{data:function(){return{dialog:!1,keys:[],headers:[],data:[],editedItem:{}}},components:{},props:{crossName:{type:String},title:{type:String},incomingData:{type:Array}},computed:{formTitle:function(){return"EDIT ".concat(this.editedItem.Term)},tableTitle:function(){return"".concat(this.crossName," ").concat(this.title)}},watch:{dialog:function(t){t||this.close()},crossName:function(){this.initialize()}},created:function(){this.initialize()},methods:{initialize:function(){this.data=this.incomingData;var t=[];this.keys=Object.keys(this.data[0]),this.keys.forEach((function(e){t.push({text:e,value:e,align:"center"})})),t.push({text:"Actions",value:"actions",align:"center"}),this.headers=t},editItem:function(t){this.editedItem=Object.assign({},t),this.dialog=!0},close:function(){this.dialog=!1,this.$nextTick((function(){}))},save:function(){this.close()}}}),i=r,o=(a("4ca5"),a("2877")),c=a("6544"),l=a.n(c),u=a("8336"),d=a("b0af"),f=a("99d9"),p=a("62ad"),h=a("a523"),m=a("8fea"),v=a("169a"),b=a("132d"),g=a("0fd9"),k=a("2fa4"),w=a("8654"),T=a("71d9"),C=a("2a7f"),x=Object(o["a"])(i,n,s,!1,null,null,null);e["a"]=x.exports;l()(x,{VBtn:u["a"],VCard:d["a"],VCardActions:f["a"],VCardText:f["c"],VCardTitle:f["d"],VCol:p["a"],VContainer:h["a"],VDataTable:m["a"],VDialog:v["a"],VIcon:b["a"],VRow:g["a"],VSpacer:k["a"],VTextField:w["a"],VToolbar:T["a"],VToolbarTitle:C["a"]})},"902f":function(t,e,a){},"9bc2":function(t,e,a){"use strict";var n=a("902f"),s=a.n(n);s.a},b33f:function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"d-flex flex-wrap",style:t.zoomLevel},[a("div",{staticClass:"ma-5"},[a("MarketData",{on:{hasData:function(e){t.toggleMarketData=!t.toggleMarketData}}})],1),t.toggleMarketData?a("div",{staticClass:"ma-5"},[a("iframe",{attrs:{src:"https://www.widgets.investing.com/live-currency-cross-rates?theme=darkTheme&roundedCorners=true&cols=last,change,changePerc&pairs=1,3,2,4,7,5,8",frameborder:"0",allowtransparency:"true",height:t.mainWindowHeight+"px",marginwidth:"0",marginheight:"0"}})]):t._e(),t.toggleMarketData?a("div",{staticClass:"ma-5"},[a("iframe",{attrs:{src:"https://www.widgets.investing.com/live-currency-cross-rates?theme=darkTheme&roundedCorners=true&cols=last,change,changePerc&pairs=6,9,10,49,11,13,16,47,51,58,50,53,15,12,52,48,55,54",frameborder:"0",allowtransparency:"true",height:t.mainWindowHeight+"px",marginwidth:"0",marginheight:"0"}})]):t._e(),t.toggleMarketData?a("div",{staticClass:"ma-5"},[a("iframe",{attrs:{src:"https://www.widgets.investing.com/live-currency-cross-rates?theme=darkTheme&roundedCorners=true&cols=last,change,changePerc&pairs=42,155,117,1691,2103,961728,2138,63,650,39,962711,18,17,69,68",frameborder:"0",allowtransparency:"true",height:t.mainWindowHeight+"px",marginwidth:"0",marginheight:"0"}})]):t._e()])},s=[],r=function(){var t=this,e=t.$createElement,a=t._self._c||e;return t.apiDataReturned?a("div",[a("v-card",{attrs:{flat:""}},[a("v-btn",{attrs:{absolute:"",small:"",fab:"",top:"",right:"",color:"pink",elevation:"12",dark:""},on:{click:function(e){t.interfaceToggle=!t.interfaceToggle}}},[a("v-icon",[t._v("mdi-information-variant")])],1)],1),a("v-data-table",{staticClass:"elevation-0 custom-transform-class",attrs:{headers:t.headers,items:t.data,"sort-by":"Cross",dense:"","disable-pagination":"","hide-default-footer":""},scopedSlots:t._u([{key:"top",fn:function(){return[a("v-toolbar",{staticClass:"mb-3",attrs:{dense:"",dark:"",color:"#385F73"}},[a("v-toolbar-title",[t._v("Market Data")]),a("v-spacer"),a("div",{staticClass:"green--text text--lighten-3"},[a("v-toolbar-title",{staticClass:"font-weight-light subtitle-2"},[t._v("Spot:"+t._s(t.spotIface)+" | Swap:"+t._s(t.swapIface))])],1)],1)]},proxy:!0},{key:"item.swaps",fn:function(e){var n=e.item;return[a("v-icon",{attrs:{small:""},on:{click:function(e){return t.viewSwaps(n)}}},[t._v("mdi-eye")])]}},{key:"item.baserates",fn:function(e){var n=e.item;return[a("v-icon",{attrs:{small:""},on:{click:function(e){return t.viewDepos(n)}}},[t._v("mdi-eye")])]}},{key:"item.ratetiles",fn:function(e){var n=e.item;return[a("v-icon",{attrs:{small:""},on:{click:function(e){return t.viewRateTiles(n)}}},[t._v("mdi-eye")])]}}],null,!1,1499848602)}),a("v-dialog",{attrs:{"max-width":t.marketTableWidth},model:{value:t.showMarketTable,callback:function(e){t.showMarketTable=e},expression:"showMarketTable"}},[a("v-card",[t.showMarketTable?a("MarketDataTable",{attrs:{crossName:t.selectedCross,title:t.marketTableTitle,incomingData:t.marketData}}):t._e()],1)],1),a("v-dialog",{attrs:{persistent:"","max-width":"600px"},model:{value:t.interfaceToggle,callback:function(e){t.interfaceToggle=e},expression:"interfaceToggle"}},[a("v-card",[a("v-container",{attrs:{fluid:""}},[a("v-select",{attrs:{items:t.ifaces,label:"Spot Interface"},on:{change:function(e){return t.changeIface(e,"spot")}},model:{value:t.spotIface,callback:function(e){t.spotIface=e},expression:"spotIface"}}),a("v-select",{attrs:{items:t.ifaces,label:"Swaps Interface"},on:{change:function(e){return t.changeIface(e,"swap")}},model:{value:t.swapIface,callback:function(e){t.swapIface=e},expression:"swapIface"}}),a("v-card-actions",[a("v-spacer"),a("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:function(e){return t.close()}}},[t._v("Cancel")]),a("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:function(e){return t.save()}}},[t._v("Save")])],1)],1)],1)],1),a("div",{staticClass:"text-center ma-2"},[a("v-snackbar",{attrs:{rounded:"pill",centered:"",elevation:"20"},scopedSlots:t._u([{key:"action",fn:function(e){var n=e.attrs;return[a("v-btn",t._b({attrs:{color:"pink",text:""},on:{click:function(e){t.snackbar=!1}}},"v-btn",n,!1),[t._v("Close")])]}}],null,!1,785509422),model:{value:t.snackbar,callback:function(e){t.snackbar=e},expression:"snackbar"}},[t._v(" Interfaces Updated => Spot: "+t._s(t.spotIface)+" | Swap :"+t._s(t.swapIface)+" ")])],1)],1):t._e()},i=[],o=(a("4160"),a("b64b"),a("d3b7"),a("159b"),a("ddb0"),a("4a4a")),c={GetSpotRates:function(t){return o["a"].post("SpotRates",t)},CurrentInterfaces:function(t){return o["a"].post("CurrentInterfaces",t)},GetSwaps:function(t){return o["a"].post("GetSwaps",t)},GetBaseRates:function(t){return o["a"].post("GetBaseRates",t)},GetRateTiles:function(t){return o["a"].post("GetRateTiles",t)},ChangeInterface:function(t){return o["a"].post("ChangeInterface",t)}},l=a("83e6"),u={name:"marketData",data:function(){return{dialog:!1,interfaceToggle:!1,keys:[],headers:[],data:[],editedItem:{},showMarketTable:!1,marketData:[],marketTableTitle:"",marketTableWidth:"",selectedCross:"",ifaces:["Barchart","MongoDB","Excel"],spotIface:"",swapIface:"",snackbar:!1,apiDataReturned:!1}},components:{MarketDataTable:l["a"]},props:{refreshComponent:{type:Boolean,default:!1}},computed:{formTitle:function(){return"EDIT ".concat(this.editedItem.Cross)}},watch:{dialog:function(t){t||this.close()},refreshComponent:function(){this.initialize()}},created:function(){this.initialize()},methods:{initialize:function(){var t=this;c.GetSpotRates({userName:this.$store.state.currentUser}).then((function(e){t.data=JSON.parse(e.data.spotRates),t.data.sort((function(t,e){return t.cross>e.cross?1:-1}));var a=[];t.keys=Object.keys(t.data[0]),t.keys.forEach((function(t){a.push({text:t,value:t,align:"center"})})),a.push({text:"Swaps",value:"swaps",sortable:!1,align:"center"}),a.push({text:"BaseRates",value:"baserates",align:"center",sortable:!1}),a.push({text:"RateTiles",value:"ratetiles",align:"center",sortable:!1}),t.headers=a,t.apiDataReturned=!0,t.$emit("hasData",!0)})).catch((function(t){alert(t)})),c.CurrentInterfaces({UserName:this.$store.state.currentUser}).then((function(e){t.spotIface=JSON.parse(e.data.spot),t.swapIface=JSON.parse(e.data.swap)})).catch((function(t){alert(t)}))},viewSwaps:function(t){var e=this;console.log(t),c.GetSwaps({UserName:this.$store.state.currentUser,Cross:t.Cross}).then((function(a){e.marketData=JSON.parse(a.data.swaps),e.selectedCross=t.Cross,e.marketTableTitle="SWAPS",e.marketTableWidth="300px",e.showMarketTable=!0})).catch((function(t){alert(t)}))},viewDepos:function(t){var e=this;c.GetBaseRates({UserName:this.$store.state.currentUser,Cross:t.Cross}).then((function(a){e.marketData=JSON.parse(a.data.depos),e.selectedCross=t.Cross,e.marketTableTitle="BASERATE (".concat(JSON.parse(a.data.depoCcy),")"),e.marketTableWidth="300px",e.showMarketTable=!0})).catch((function(t){alert(t)}))},viewRateTiles:function(t){var e=this;c.GetRateTiles({UserName:this.$store.state.currentUser,Cross:t.Cross}).then((function(a){e.marketData=JSON.parse(a.data.rateTile),e.selectedCross=t.Cross,e.marketTableTitle="RATETILE",e.marketTableWidth="1000px",e.showMarketTable=!0})).catch((function(t){alert(t)}))},close:function(){this.interfaceToggle=!1,this.$nextTick((function(){}))},changeIface:function(t,e){"spot"===e&&(this.spotIface=t),"swap"===e&&(this.swapIface=t)},save:function(){var t=this;c.ChangeInterface({UserName:this.$store.state.currentUser,SpotApi:this.spotIface,SwapApi:this.swapIface}).then((function(e){t.spotIface=JSON.parse(e.data.spot),t.swapIface=JSON.parse(e.data.swap),t.snackbar=!0,t.initialize()})).catch((function(t){alert(t)})),this.close()}}},d=u,f=(a("9bc2"),a("2877")),p=a("6544"),h=a.n(p),m=a("8336"),v=a("b0af"),b=a("99d9"),g=a("a523"),k=a("8fea"),w=a("169a"),T=a("132d"),C=a("b974"),x=a("2db4"),I=a("2fa4"),y=a("71d9"),S=a("2a7f"),_=Object(f["a"])(d,r,i,!1,null,null,null),D=_.exports;h()(_,{VBtn:m["a"],VCard:v["a"],VCardActions:b["a"],VContainer:g["a"],VDataTable:k["a"],VDialog:w["a"],VIcon:T["a"],VSelect:C["a"],VSnackbar:x["a"],VSpacer:I["a"],VToolbar:y["a"],VToolbarTitle:S["a"]});var V={name:"FxRates",components:{MarketData:D},data:function(){return{toggleMarketData:!1}},computed:{zoomLevel:function(){var t=window.innerWidth>1700?"100%":"75%";return{zoom:t}},mainWindowHeight:function(){var t=window.innerWidth>1700?-125:100,e=window.innerHeight+t;return e},mainWindowWidth:function(){return window.innerWidth}},mounted:function(){}},R=V,M=Object(f["a"])(R,n,s,!1,null,null,null);e["default"]=M.exports}}]);
//# sourceMappingURL=chunk-5ab83b1c.97f9745e.js.map