(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-aadf3312"],{"0cd9":function(t,e,n){"use strict";var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-row",{attrs:{justify:"center"}},[n("v-dialog",{attrs:{"max-width":"300"},scopedSlots:t._u([{key:"activator",fn:function(e){var i=e.on,a=e.attrs;return[n("v-btn",{attrs:{icon:""}},[n("v-icon",t._g(t._b({attrs:{large:t.large,color:t.color}},"v-icon",a,!1),i),[t._v(" "+t._s(t.icon)+" ")])],1)]}}]),model:{value:t.dialog,callback:function(e){t.dialog=e},expression:"dialog"}},[n("v-card",{staticClass:"mx-auto",attrs:{"max-width":"300"}},[n("v-toolbar",{attrs:{height:"40px",color:"blue-grey",dark:""}},[n("v-spacer"),n("v-toolbar-title",{staticClass:"ma-4"},[t._v(t._s(t.title))]),n("v-spacer")],1),n("v-list",[n("v-list-item-group",{attrs:{mandatory:"",color:"indigo"}},t._l(t.inputData,(function(e,i){return n("v-list-item",{key:i,staticClass:"text-center",attrs:{dense:""},on:{click:function(n){return t.emitToParent(e)}}},[n("v-list-item-content",[n("v-list-item-title",[t._v(t._s(e))]),n("v-divider",{staticClass:"mt-2",attrs:{light:""}})],1)],1)})),1)],1),n("v-card-actions",[n("v-spacer"),n("v-btn",{attrs:{color:"green darken-1",text:""},on:{click:function(e){t.dialog=!1}}},[t._v("Cancel")])],1)],1)],1)],1)},a=[],s={data:function(){return{dialog:!1}},props:{inputData:{type:Array},icon:{type:String},large:{type:Boolean},color:{type:String},title:{type:String}},methods:{emitToParent:function(t){this.$emit("selection",t),this.dialog=!1}}},c=s,r=n("2877"),o=n("6544"),l=n.n(o),d=n("8336"),v=n("b0af"),u=n("99d9"),y=n("169a"),h=n("ce7e"),p=n("132d"),m=n("8860"),C=n("da13"),f=n("5d23"),g=n("1baa"),E=n("0fd9"),b=n("2fa4"),w=n("71d9"),B=n("2a7f"),T=Object(r["a"])(c,i,a,!1,null,null,null);e["a"]=T.exports;l()(T,{VBtn:d["a"],VCard:v["a"],VCardActions:u["a"],VDialog:y["a"],VDivider:h["a"],VIcon:p["a"],VList:m["a"],VListItem:C["a"],VListItemContent:f["a"],VListItemGroup:g["a"],VListItemTitle:f["b"],VRow:E["a"],VSpacer:b["a"],VToolbar:w["a"],VToolbarTitle:B["a"]})},"9e6b":function(t,e,n){},dc8f:function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"dayWgtContainer"},[n("div",[n("div",{staticClass:"d-flex flex-row mb-5 flex-nowrap"},[n("v-toolbar",{attrs:{color:"#385F73","min-width":"400",collapse:""}},[n("v-spacer"),n("div",{staticClass:"d-flex flex-column"},[n("h4",{staticClass:"font-weight-medium text-center text-uppercase grey--text text--lighten-3"},[t._v(" corevolFX DAY WEIGHT SETTINGS "),n("v-icon",{staticClass:"mb-4",attrs:{small:"",color:"green lighten-3"}},[t._v("mdi-dots-hexagon")])],1),n("h4",{staticClass:"font-weight-light text-center text-uppercase green--text text--lighten-3",attrs:{align:"center",justify:"center"}},[t._v(" "+t._s(t.currentCcy)+" ")])]),n("v-spacer")],1)],1),n("div",{staticClass:"d-flex flex-row flex-nowrap"},[n("div",{staticClass:"dayWgtCol"},[n("v-card",{staticClass:"mr-5 d-flex flex-column",attrs:{height:t.window.height,"min-width":"240"}},[n("v-list",{attrs:{dense:""}},[n("v-list-item-group",{attrs:{color:"blue"}},[n("v-subheader",[t._v("SELECT")]),n("v-list-item",{on:{click:function(e){t.currListToggle=!t.currListToggle}}},[n("v-list-item-action",[n("v-btn",{attrs:{ripple:"",small:"",icon:""}},[n("v-icon",{attrs:{color:"#385F73"}},[t._v("mdi-expand-all")])],1),n("ModalNoButton",{attrs:{inputData:t.availableCurrencies,title:"Select Ccy",vmodel:t.currListToggle},on:{setvmodel:function(e){return t.currListToggle=e},selection:t.changeCcy}})],1),n("v-list-item-content",[n("v-list-item-title",[t._v("SELECT CURRENCY")])],1)],1),n("v-subheader",[t._v("EVENTS")]),n("v-list-item",{on:{click:function(e){t.dialog=!t.dialog}}},[n("v-list-item-action",[n("v-btn",{attrs:{ripple:"",small:"",icon:""}},[n("v-icon",{attrs:{color:"#126496"}},[t._v("mdi-calendar-star")])],1)],1),n("v-list-item-content",[n("v-list-item-title",[t._v("AVAILABLE EVENTS")])],1)],1),n("v-subheader",[t._v("BUILD")]),n("v-list-item",{on:{click:t.buildProductionList}},[n("v-list-item-action",[n("v-btn",{attrs:{ripple:"",small:"",icon:""}},[n("v-icon",{attrs:{color:"yellow darken-3"}},[t._v("mdi-lightning-bolt-outline")])],1)],1),n("v-list-item-content",[n("v-list-item-title",[t._v("BUILD PRODUCTION LIST")])],1)],1),n("v-subheader",[t._v("SAVE")]),n("v-list-item",{on:{click:t.saveEventsToDB}},[n("v-list-item-action",[n("v-btn",{attrs:{ripple:"",small:"",icon:""}},[n("v-icon",{attrs:{color:"green lighten-3"}},[t._v("mdi-content-save")])],1)],1),n("v-list-item-content",[n("v-list-item-title",[t._v("SAVE EVENTS TO DB")])],1)],1)],1)],1)],1)],1),n("v-row",{attrs:{justify:"center"}},[n("v-dialog",{attrs:{"max-width":"410"},model:{value:t.dialog,callback:function(e){t.dialog=e},expression:"dialog"}},[n("div",{ref:"eventsByCcyTable",staticClass:"dayWgtCol"})])],1),n("div",[n("div",{ref:"selectedEventsByCcyTable",staticClass:"dayWgtCol mx-5"})]),n("div",[n("div",{ref:"productionListTable",staticClass:"dayWgtCol"})])],1)])])},a=[],s=(n("99af"),n("4de4"),n("4160"),n("caad"),n("d81d"),n("45fc"),n("2532"),n("159b"),n("96cf"),n("1da1")),c=(n("c4fc"),n("0179")),r=n.n(c),o=n("5053"),l=n("4a4a"),d={GetAvailableCurr:function(){return l["a"].get("GetAvailableCurr")},GetEvents:function(t){return l["a"].post("GetEvents",t)},BuildProductionList:function(t){return l["a"].post("BuildProductionList",t)},SaveDataToDB:function(t){return l["a"].post("SaveDataToDB",t)}},v=n("0cd9"),u=n("cd71"),y={name:"DayWgtSetup",components:{PopUpModal:v["a"],ModalNoButton:u["a"]},created:function(){var t=this;d.GetAvailableCurr().then((function(e){t.availableCurrencies=JSON.parse(e.data.availableCurrencies)})),window.addEventListener("resize",this.handleResize),this.handleResize()},data:function(){return{currListToggle:!1,availableCurrencies:[],currentCcy:"SELECT CCY",selectedEventsByCcy:[],productionList:[],eventsByCcy:[],dialog:!1,window:{width:0,height:0}}},computed:{configEventsByCcy:function(){return{data:this.eventsByCcy,columnSorting:!1,onchange:this.onChangeByCcyEvents,tableOverflow:!1,allowInsertRow:!1,columns:[{type:"checkbox",title:"IncludeEvent",width:90},{type:"text",title:"EventName",width:320}],nestedHeaders:[[{title:"AVAILABLE EVENTS",colspan:2}]]}},configSelectedEventsByCcy:function(){return{data:this.selectedEventsByCcy,columnSorting:!1,onchange:this.onChangeSelectedEventsByCcy,tableOverflow:!1,allowInsertRow:!1,columns:[{type:"checkbox",title:"IncludeEvent",width:90},{type:"text",title:"EventName",width:310},{type:"text",title:"EventWgt",width:90}],nestedHeaders:[[{title:"SELECTED EVENTS",colspan:3}]]}},configProductionList:function(){return{data:this.productionList,columnSorting:!1,tableOverflow:!1,allowInsertRow:!1,columns:[{type:"text",title:"Event",width:175},{type:"text",title:"Date",width:175},{type:"text",title:"DayWgt",width:75},{type:"text",title:"Time",width:100}],nestedHeaders:[[{title:"PRODUCTION LIST",colspan:4}]]}}},methods:{handleResize:function(){this.window.width=window.innerWidth-100,this.window.height=window.innerHeight-95,this.setContainerDimensions()},setContainerDimensions:function(){document.documentElement.style.setProperty("--main-width","".concat(this.window.width,"px")),document.documentElement.style.setProperty("--main-height","".concat(this.window.height,"px"))},getEvents:function(t){var e=this;return Object(s["a"])(regeneratorRuntime.mark((function n(){var i;return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return n.prev=0,n.next=3,d.GetEvents({Ccy:t});case 3:i=n.sent,e.eventsByCcy=JSON.parse(i.data.eventsByCcy),e.selectedEventsByCcy=JSON.parse(i.data.selectedEvents),e.productionList=JSON.parse(i.data.productionList),e.currentCcy=t,n.next=13;break;case 10:n.prev=10,n.t0=n["catch"](0),alert(n.t0);case 13:case"end":return n.stop()}}),n,null,[[0,10]])})))()},changeCcy:function(t){var e=this;return Object(s["a"])(regeneratorRuntime.mark((function n(){return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return n.next=2,e.getEvents(t);case 2:null===e.selectedEventsByCcy&&(e.selectedEventsByCcy=[]),null===e.productionList&&(e.productionList=[]),e.updateEventsByCcyWithSelectedEvents(),e.selectedEventsByCcyTable.setData(e.selectedEventsByCcy),e.productionListTable.setData(e.productionList);case 7:case"end":return n.stop()}}),n)})))()},buildProductionList:function(){var t=this;return Object(s["a"])(regeneratorRuntime.mark((function e(){var n,i;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(0!==t.selectedEventsByCcy.length){e.next=3;break}return t.$store.dispatch("setSnackbar",{text:" Select Events Before Building List",top:!0}),e.abrupt("return");case 3:return e.prev=3,e.next=6,d.BuildProductionList({Ccy:t.currentCcy,EventNames:t.selectedEventsByCcy.map((function(t){return t.EventName}))});case 6:n=e.sent,i=JSON.parse(n.data.selectedEvents),t.productionList=[],i.forEach((function(e){var n=t.selectedEventsByCcy.filter((function(t){return t.EventName===e.Title}))[0].EventWgt;e.Time.includes(":")||(e.Time="00:00"),t.productionList.push({Event:e.Title,Date:e.Date,DayWgt:n,Time:e.Time})})),t.productionListTable.setData(o["b"](t.productionList)),e.next=16;break;case 13:e.prev=13,e.t0=e["catch"](3),alert(e.t0);case 16:case"end":return e.stop()}}),e,null,[[3,13]])})))()},onChangeByCcyEvents:function(t,e,n,i){var a=n,s=i;if("0"===a){var c={EventName:this.eventsByCcyTable.getValueFromCoords(parseInt(1),parseInt(s)),EventWgt:1,IncludeEvent:!0},r=this.selectedEventsByCcy.some((function(t){return t.EventName===c.EventName}));r?this.selectedEventsByCcy=this.selectedEventsByCcy.filter((function(t){return t.EventName!=c.EventName})):this.selectedEventsByCcy.push(c),this.selectedEventsByCcyTable.setData(this.selectedEventsByCcy)}},onChangeSelectedEventsByCcy:function(t,e,n,i){var a=n,s=i;if("0"===a){var c=this.selectedEventsByCcyTable.getValueFromCoords(parseInt(1),parseInt(s)),r=this.selectedEventsByCcyTable.getValueFromCoords(parseInt(0),parseInt(s));r||(this.selectedEventsByCcy=this.selectedEventsByCcy.filter((function(t){return t.EventName!=c})),this.updateEventsByCcyWithSelectedEvents(),this.selectedEventsByCcyTable.setData(this.selectedEventsByCcy),this.eventsByCcyTable.setData(this.eventsByCcy))}if("2"===a){var o=this.selectedEventsByCcyTable.getValueFromCoords(parseInt(2),parseInt(s));this.selectedEventsByCcy[s].EventWgt=parseFloat(o)}},saveEventsToDB:function(){var t=this,e={ccy:this.currentCcy,selectedEvents:JSON.stringify(this.selectedEventsByCcy),productionList:JSON.stringify(this.productionList)};d.SaveDataToDB(e).then((function(e){t.$store.dispatch("setSnackbar",{text:"Database Upadated With ".concat(t.currentCcy," Events List "),centered:!0})})).catch((function(e){t.$store.dispatch("setSnackbar",{text:"There was an error updating ".concat(t.currentCcy," events: ").concat(e," "),centered:!0})}))},updateEventsByCcyWithSelectedEvents:function(){var t=this;this.eventsByCcy.forEach((function(e){var n=t.selectedEventsByCcy.some((function(t){return t.EventName===e.EventName}));e.IncludeEvent=!0===n}))}},mounted:function(){var t=this;return Object(s["a"])(regeneratorRuntime.mark((function e(){var n,i;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,t.getEvents("USD");case 2:t.updateEventsByCcyWithSelectedEvents(),n=r()(t.$refs["selectedEventsByCcyTable"],t.configSelectedEventsByCcy),n.hideIndex(),Object.assign(t,{selectedEventsByCcyTable:n}),i=r()(t.$refs["productionListTable"],t.configProductionList),i.hideIndex(),Object.assign(t,{productionListTable:i});case 9:case"end":return e.stop()}}),e)})))()},watch:{dialog:function(){var t=this;setTimeout((function(){r.a.destroy(t.$refs["eventsByCcyTable"],!1);var e=r()(t.$refs["eventsByCcyTable"],t.configEventsByCcy);e.hideIndex(),Object.assign(t,{eventsByCcyTable:e})}),500)}}},h=y,p=(n("e766"),n("2877")),m=n("6544"),C=n.n(m),f=n("8336"),g=n("b0af"),E=n("169a"),b=n("132d"),w=n("8860"),B=n("da13"),T=n("1800"),x=n("5d23"),L=n("1baa"),S=n("0fd9"),V=n("2fa4"),I=n("e0c7"),D=n("71d9"),N=Object(p["a"])(h,i,a,!1,null,null,null);e["default"]=N.exports;C()(N,{VBtn:f["a"],VCard:g["a"],VDialog:E["a"],VIcon:b["a"],VList:w["a"],VListItem:B["a"],VListItemAction:T["a"],VListItemContent:x["a"],VListItemGroup:L["a"],VListItemTitle:x["b"],VRow:S["a"],VSpacer:V["a"],VSubheader:I["a"],VToolbar:D["a"]})},e766:function(t,e,n){"use strict";var i=n("9e6b"),a=n.n(i);a.a}}]);
//# sourceMappingURL=chunk-aadf3312.7f4eb73e.js.map