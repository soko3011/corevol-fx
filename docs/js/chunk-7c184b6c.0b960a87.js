(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-7c184b6c"],{5320:function(t,e,n){"use strict";var s=n("675b"),i=n.n(s);i.a},"675b":function(t,e,n){},dc8f:function(t,e,n){"use strict";n.r(e);var s=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-container",{style:t.containerStyle,attrs:{fluid:!0}},[n("div",{staticClass:"d-flex flex-nowrap",style:t.zoomLevel},[n("div",[n("v-toolbar",{staticClass:"mb-0 mr-2",attrs:{dark:"",height:"30",color:"blue-grey darken-0"}},[n("v-spacer"),n("v-toolbar-title",{staticClass:"text-subtitle-2"},[t._v("Select Ccy")]),n("v-spacer"),n("v-btn",{attrs:{icon:""}},[n("PopUpModal",{attrs:{inputData:t.availableCurrencies,icon:"mdi-plus-box",color:"blue",title:"Select Ccy"},on:{selection:t.GetEvents}})],1)],1),n("v-card",{staticClass:"ma-3",attrs:{elevation:"21"}},[n("div",{ref:"spreadsheet",style:t.ccyEvents.length>0?t.scrollY:t.hold})])],1),n("div",[n("v-toolbar",{staticClass:"mb-0 mr-2",attrs:{dark:"",height:"30",color:"blue-grey darken-0"}},[n("v-spacer"),n("v-toolbar-title",{staticClass:"text-subtitle-2"},[t._v("Generate List")]),n("v-spacer"),n("v-btn",{attrs:{icon:""}},[n("v-icon",{attrs:{color:"yellow"},on:{click:t.GetSelectedEventList}},[t._v("mdi-lightning-bolt")])],1)],1),n("v-card",{staticClass:"ma-3",attrs:{elevation:"21"}},[n("div",{ref:"spreadsheet1"})]),0===t.ccyEvents.length?n("div",{staticClass:"centerWrapper"},[n("h3",[t._v("Start")]),n("v-btn",{attrs:{icon:""}},[n("PopUpModal",{attrs:{inputData:t.availableCurrencies,icon:"mdi-power",color:"red",title:"Select Ccy"},on:{selection:t.GetEvents}})],1)],1):t._e()],1),n("div",[n("v-toolbar",{staticClass:"mb-0 mr-2",attrs:{color:"blue-grey darken-0",dark:"",height:"30"}},[n("v-spacer"),n("v-toolbar-title",{staticClass:"text-subtitle-2"},[t._v("Save Setup To Database")]),n("v-spacer"),n("v-btn",{attrs:{icon:""}},[n("v-icon",{attrs:{color:"green lighten-3"},on:{click:t.SaveEventsToDB}},[t._v("mdi-content-save")])],1)],1),n("v-card",{staticClass:"ma-3",attrs:{elevation:"21"}},[n("div",{ref:"spreadsheet2",style:t.productionList.length>0?t.scrollY:t.hold})])],1)])])},i=[],a=(n("99af"),n("4de4"),n("c740"),n("4160"),n("caad"),n("c975"),n("45fc"),n("2532"),n("159b"),n("b85c")),c=(n("c4fc"),n("0179")),r=n.n(c),o=n("5053"),l=n("4a4a"),v={GetAvailableCurr:function(){return l["a"].get("GetAvailableCurr")},GetEvents:function(t){return l["a"].post("GetEvents",t)},GetSelectedEventList:function(t){return l["a"].post("GetSelectedEventList",t)},SaveDataToDB:function(t){return l["a"].post("SaveDataToDB",t)}},d=n("0cd9"),u={name:"DayWgtSetup",components:{PopUpModal:d["a"]},created:function(){var t=this;v.GetAvailableCurr().then((function(e){t.availableCurrencies=JSON.parse(e.data.availableCurrencies)}))},destroyed:function(){},data:function(){return{currListToggle:!1,availableCurrencies:[],currentCcy:"SELECT CCY",selectedEvents:[],productionList:[],ccyEvents:[]}},computed:{ccyEventsListHeight:function(){return this.$refs.spreadsheet.clientHeight},zoomLevel:function(){var t=window.innerWidth>1700?"100%":"80%";return{zoom:t}},longComponentHeight:function(){var t=window.innerWidth>1700?.9:1.125;return t=this.mainWindowHeight*t,t},mainWindowHeight:function(){return window.innerHeight-75},mainWindowWidth:function(){return window.innerWidth-10},scrollY:function(){return" display: flex;\n              margin-top: 20px;\n              overflow-y: scroll;\n              height: ".concat(this.longComponentHeight,"px;")},hold:function(){return"\n              "},containerStyle:function(){return" display: flex;\n              overflow-x: scroll;\n              padding-left: 0px;\n              padding-right: 0px;\n              width: ".concat(this.mainWindowWidth,"px;\n              height: ").concat(this.mainWindowHeight,"px;")},configAllEvents:function(){return{columnSorting:!1,onchange:this.OnChangeAllEvents,tableOverflow:!1,allowInsertRow:!1,columns:[{type:"checkbox",title:"IncludeEvent",width:110},{type:"text",title:"EventName",width:350}]}},configSelectedEvents:function(){return{columnSorting:!1,onchange:this.OnChangeSelectedEvents,tableOverflow:!1,allowInsertRow:!1,columns:[{type:"checkbox",title:"IncludeEvent",width:110},{type:"text",title:"EventName",width:350},{type:"text",title:"EventWgt",width:110}]}},configProductionList:function(){return{columnSorting:!1,tableOverflow:!1,allowInsertRow:!1,columns:[{type:"text",title:"Event",width:200},{type:"text",title:"Date",width:200},{type:"text",title:"DayWgt",width:100},{type:"text",title:"Time",width:100}]}}},methods:{GetEvents:function(t){var e=this,n={name:t};v.GetEvents(n).then((function(n){e.ccyEvents=JSON.parse(n.data.currencyEvents);var s=n.data.activeEvents,i=[];"null"!==s&&(i=o["b"](JSON.parse(s))),e.jexcelAllEvents.setData(o["b"](e.ccyEvents)),e.selectedEvents=i,e.jexcelSelectedEvents.setData(e.selectedEvents),e.productionList=[],e.jexcelProductionList.setData(e.productionList),e.currentCcy=t,e.currListToggle=!1}))},GetSelectedEventList:function(){var t=this,e=[];this.selectedEvents.forEach((function(t){e.push(t[1])}));var n={name:this.currentCcy,eventNames:e};v.GetSelectedEventList(n).then((function(e){var n,s=Object(a["a"])(JSON.parse(e.data.selectedEvents));try{for(s.s();!(n=s.n()).done;){var i=n.value,c=t.selectedEvents.findIndex((function(t){return t[1]===i.Title})),r=t.jexcelSelectedEvents.getValueFromCoords(2,c);i.Time.includes(":")||(i.Time="00:00");var l={Event:i.Title,Date:i.Date,DayWgt:r,Time:i.Time};t.productionList.push(l)}}catch(v){s.e(v)}finally{s.f()}t.jexcelProductionList.setData(o["b"](t.productionList))}))},OnChangeAllEvents:function(t,e,n,s){var i=n,a=s;if("0"===i){var c=[!0,this.jexcelAllEvents.getValueFromCoords(parseInt(1),parseInt(a)),1],r=this.selectedEvents.some((function(t){return t[1]===c[1]}));r?this.selectedEvents=this.selectedEvents.filter((function(t){return t[1]!=c[1]})):this.selectedEvents.push(c),this.jexcelSelectedEvents.setData(this.selectedEvents)}},OnChangeSelectedEvents:function(t,e,n,s){var i=n,a=s;if("0"===i){var c=this.jexcelSelectedEvents.getValueFromCoords(parseInt(1),parseInt(a)),r=this.selectedEvents.some((function(t){return t[1]===c}));if(r){this.selectedEvents=this.selectedEvents.filter((function(t){return t[1]!=c}));var o=this.jexcelAllEvents.getColumnData(1),l=o.indexOf(c);this.jexcelAllEvents.setValueFromCoords(0,l,!1,!0)}this.jexcelSelectedEvents.setData(this.selectedEvents)}},ConvertSelectedEventsToObjArr:function(){var t=[];return this.jexcelSelectedEvents.getData().forEach((function(e){var n={IncludeEvent:e[0],EventName:e[1],EventWgt:e[2]};t.push(n)})),t},SaveEventsToDB:function(){var t={ccy:this.currentCcy,selectedEvents:JSON.stringify(this.ConvertSelectedEventsToObjArr()),productionList:JSON.stringify(this.productionList)};v.SaveDataToDB(t).then((function(t){alert("Database Upadated. Status "+t.status)})).catch((function(t){alert(t)}))}},mounted:function(){var t=r()(this.$refs["spreadsheet"],this.configAllEvents);t.hideIndex(),Object.assign(this,{jexcelAllEvents:t});var e=r()(this.$refs["spreadsheet1"],this.configSelectedEvents);e.hideIndex(),Object.assign(this,{jexcelSelectedEvents:e});var n=r()(this.$refs["spreadsheet2"],this.configProductionList);n.hideIndex(),Object.assign(this,{jexcelProductionList:n})}},h=u,f=(n("5320"),n("2877")),p=n("6544"),E=n.n(p),g=n("8336"),b=n("b0af"),m=n("a523"),x=n("132d"),y=n("2fa4"),C=n("71d9"),S=n("2a7f"),w=Object(f["a"])(h,s,i,!1,null,null,null);e["default"]=w.exports;E()(w,{VBtn:g["a"],VCard:b["a"],VContainer:m["a"],VIcon:x["a"],VSpacer:y["a"],VToolbar:C["a"],VToolbarTitle:S["a"]})}}]);
//# sourceMappingURL=chunk-7c184b6c.0b960a87.js.map