(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-73b9834f"],{"20ad":function(t,e,i){"use strict";i.r(e);var r=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("main",{staticClass:"pa-0"},[i("v-toolbar",{style:t.zoomLevel,attrs:{color:"#385F73","min-width":"300",dense:"",collapse:""}},[i("v-btn",{attrs:{icon:""}},[i("v-icon",{attrs:{color:"blue lighten-2"},on:{click:function(e){t.showSideControl=!t.showSideControl}}},[t._v(" "+t._s(t.showSideControl?"mdi-chevron-down":"mdi-chevron-up")+" ")])],1),i("v-spacer"),i("h4",{staticClass:"font-weight-medium text-center text-uppercase grey--text text--lighten-3"},[t._v(t._s(t.pricerTitle))]),i("v-spacer")],1),t.dataReturned?i("v-container",{staticClass:"cont",attrs:{fluid:""}},[t.showSideControl?i("v-card",{staticClass:"mr-3",style:t.zoomLevel,attrs:{"min-width":"225",shaped:""}},[i("TreeView",{attrs:{inputData:{list:this.activePricers,listName:"Active Pricers"}},on:{selection:t.ReloadPricer}}),i("div",[i("div",{staticStyle:{"margin-bottom":"70px"}}),i("v-card",[i("v-btn",{attrs:{absolute:"",small:"",fab:"",top:"",left:"",color:"pink",elevation:"12"}},[i("PopUpInput",{attrs:{icon:"mdi-expand-all",label:"add name and hit enter",color:"white",title:"ADD NEW PRICER",large:!1},on:{selection:t.UserAddPricer}})],1)],1),i("v-btn",{staticClass:"mb-10",attrs:{absolute:"",small:"",fab:"",bottom:"",right:"",color:"blue-grey",elevation:"12"}},[i("PopUpModal",{attrs:{inputData:this.activePricers,icon:"mdi-delete",color:"white",large:!1,title:"REMOVE VIEW"},on:{selection:t.RemoveTab}})],1)],1)],1):t._e(),i("div",{style:t.containerStyle},[i("transition",{attrs:{name:"fade"}},[i("section",{attrs:{id:"pricer"}},[t.drawer?t._e():i("v-btn",{staticClass:"mt-10 mr-5",attrs:{transition:"fade-transition",fab:"",small:"",color:"pink",dark:"",top:"",right:"",absolute:"",elevation:"12"},on:{click:function(e){t.drawer=!t.drawer}}},[i("v-icon",[t._v("mdi-chevron-double-right")])],1),i("OptionPricer",{style:t.zoomLevel,on:{childToParent:t.setPricerTitle,currentCcyPair:t.setCurrentCcyPair}})],1)])],1)],1):t._e()],1)])},s=[],o=(i("99af"),i("c975"),i("b0c0"),function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{ref:"jexcelPricer"})}),a=[],n=(i("4de4"),i("7db0"),i("c740"),i("4160"),i("a434"),i("d3b7"),i("25f0"),i("6062"),i("3ca3"),i("159b"),i("ddb0"),i("2909")),c=i("b85c"),l=(i("c4fc"),i("0179")),h=i.n(l),u=i("5053"),d=i("0882"),p=i("89fc"),f={name:"optionPricer",components:{},created:function(){document.addEventListener("keydown",this.EventListeners),this.cellPosContainer=this.$store.state.lastPricerCellCoords},destroyed:function(){document.removeEventListener("keydown",this.EventListeners),this.$store.dispatch("setLastCellPosition",this.cellPosContainer)},data:function(){return{currentCcyPair:null,cellPosContainer:[],userFormat:{backgroundColor:"White",fontColor:"Black",rowArray:[]},iData:{},colsW:[],row:[],col:[],obj:null,redObj:[],optData:{},optContainer:[],alphabet:["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]}},computed:{config:function(){return{columnSorting:!1,tableOverflow:!1,columns:[{readOnly:!1}],colHeaders:this.setHeaders(),colWidths:this.setColWidths(),minDimensions:[50],onselection:this.selectionActive,onchange:this.updateOption}},crossListData:function(){return this.$store.state.crossList},apidata:function(){return this.$store.state.rawPricerData},pricerKeys:function(){return JSON.parse(this.apidata.pricerKeys)},activeLayout:function(){return JSON.parse(this.apidata.activeLayout)},storedData:function(){return JSON.parse(this.apidata.storedPricerData)},pricerName:function(){return JSON.parse(this.apidata.storedPricerData).PricerTitle},jExcelOptions:function(){return u["a"](this.pricerKeys,this.config)}},methods:{setHeaders:function(){var t=[];t.push("Key");for(var e=1;e<50;e++)t.push(e);return t},setColWidths:function(){for(var t=[],e=0;e<50;e++)t.push(135);return t},ClearGrid:function(){var t=this.jExcelObj.getData()[0],e=JSON.parse(JSON.stringify(this.jExcelObj.getData())),i=this.EmptyCol();function r(t,r){if(""!=t&&0!=r)for(var s=0;s<i.length;s++)e[s][r]=i[s]}t.forEach(r),this.jExcelObj.setData(e),this.redObj=[],this.optContainer=[]},RestorePricerData:function(t){if(this.ClearGrid(),null!==t){var e=JSON.parse(t.ActivePricerGridDataJSON);if(null!==e){var i,r=Object(c["a"])(e);try{for(r.s();!(i=r.n()).done;){var s=i.value,o=s[0],a=this.pricerKeys.indexOf(o);-1!==a&&(this.jExcelObj.ignoreEvents=!0,this.jExcelObj.setRowData(a,s),this.jExcelObj.ignoreEvents=!1)}}catch(m){r.e(m)}finally{r.f()}}var n=JSON.parse(t.ActiveOptionsContainerJSON);if(null!==n){var l,h=Object(c["a"])(n);try{for(h.s();!(l=h.n()).done;){var u=l.value;this.optContainer.push(u)}}catch(m){h.e(m)}finally{h.f()}}var d=JSON.parse(t.UserOverwrittenInputsJSON);if(null!==d){var p,f=Object(c["a"])(d);try{for(f.s();!(p=f.n()).done;)u=p.value,this.redObj.push(u)}catch(m){f.e(m)}finally{f.f()}}}},BindTableTopage:function(t){var e=this.$refs["parentDiv"];e.childElementCount>0&&e.removeChild(e.childNodes[0]);var i=document.createElement("div");e.appendChild(i);var r=h()(i,t);r.hideIndex(),Object.assign(this,{jExcelObj:r})},emitToParent:function(){this.$emit("childToParent",this.pricerName)},EventListeners:function(t){if("KeyP"==t.code&&t.ctrlKey&&(t.preventDefault(),this.CopyOpt(this.col)),"KeyD"==t.code&&t.ctrlKey&&(t.preventDefault(),this.ClearAll()),"KeyQ"==t.code&&t.ctrlKey&&(t.preventDefault(),this.DelOpt(this.col)),"KeyR"==t.code&&t.ctrlKey){t.preventDefault();var e={name:this.col.toString()},i=this.optContainer.findIndex((function(t){return t.name==e.name}));-1!=i&&(this.optData=this.optContainer[i],this.ReCalcOpt(this.optData))}if("Space"===t.code&&this.row===this.KeyRow("Cross")&&0!=this.col){t.preventDefault();var r=d["a"](this.jExcelObj,this.col,this.row);d["b"](this.jExcelObj,r,"empty","dropdown",this.crossListData,this.col,this.row)}"Space"===t.code&&this.row===this.KeyRow("PremiumType")&&0!=this.col&&(t.preventDefault(),r=d["a"](this.jExcelObj,this.col,this.row),d["b"](this.jExcelObj,r,"empty","dropdown",["Base_Pct","Terms_Pips","Base_Pips","Terms_Pct"],this.col,this.row)),"Space"===t.code&&this.row===this.KeyRow("Call_Put")&&0!=this.col&&(t.preventDefault(),r=d["a"](this.jExcelObj,this.col,this.row),d["b"](this.jExcelObj,r,"empty","dropdown",["CALL","PUT"],this.col,this.row)),"Space"===t.code&&this.row===this.KeyRow("ExpiryText")&&0!=this.col&&(t.preventDefault(),r=d["a"](this.jExcelObj,this.col,this.row),d["b"](this.jExcelObj,r,"empty","calendar",this.crossListData,this.col,this.row)),"Space"===t.code&&this.row===this.KeyRow("UserVol")&&0!=this.col&&(t.preventDefault(),this.$router.push({name:"Dvi",params:{ccyPair:this.KeyVal("Cross")}}))},setOptObj:function(){Object.assign(this.optData,{cross:this.KeyVal("Cross"),spot:this.KeyVal("Spot").toString(),expiryText:this.KeyVal("ExpiryText"),strikeText:this.KeyVal("StrikeText"),call_put:this.KeyVal("Call_Put"),userName:this.$store.state.currentUser})},getSpot:function(){var t=this;this.jExcelObj.updateSelectionFromCoords(this.col,this.KeyRow("ExpiryText"),this.col,this.KeyRow("ExpiryText")),this.jExcelObj.setValueFromCoords(this.col,this.KeyRow("Spot"),[""],!0),p["a"].CheckIfSurfaceExists({cross:this.KeyVal("Cross"),userName:this.$store.state.currentUser}).then((function(e){var i=JSON.parse(e.data.surfExists);if(!1===i){var r=t.KeyVal("Cross");alert("Please Update "+r+" Vols"),t.$store.dispatch("setActivecross",{cross:t.KeyVal("Cross")}),t.$store.dispatch("loadDviWithPayload",{cross:t.KeyVal("Cross")}),t.$router.push({name:"Dvi",params:{ccyPair:t.KeyVal("Cross")}})}else p["a"].GetSingleSpot({cross:t.KeyVal("Cross")}).then((function(e){var i=JSON.parse(e.data.singleSpot);t.jExcelObj.setValueFromCoords(t.col,t.KeyRow("Spot"),[i],!0)}))}))},selectionActive:function(t,e,i,r,s){this.row=i,this.col=e,this.userFormat.rowArray=[i,s],this.currentCcyPair=this.KeyVal("Cross"),0===this.col&&this.SelectCell(this.row,1)},ResetCellPosition:function(t,e){this.RecordCellPosition(t),this.SetCellPosition(e)},pushToArray:function(t,e){var i=t.findIndex((function(t){return t.id===e.id}));i>-1?t[i]=e:t.push(e)},RecordCellPosition:function(){var t=this,e={col:this.col,pricer:this.pricerName},i=this.cellPosContainer.find((function(e){return e.pricer===t.pricerName})),r=this.cellPosContainer.indexOf(i);-1===r?this.cellPosContainer.push(e):this.cellPosContainer[r]=e},SetCellPosition:function(){var t=this,e=this.cellPosContainer.find((function(e){return e.pricer===t.pricerName}));void 0===e?this.SelectCell(0,1):this.SelectCell(0,e.col)},checkProperties:function(t){for(var e in t)if(""===t[e])return!0;return!1},KeyRow:function(t){var e=this.pricerKeys.indexOf(t);return e},KeyVal:function(t){var e=this.jExcelObj.getValueFromCoords(this.col,this.KeyRow(t));return this.checkArr(e)},checkArr:function(t){return Array.isArray(t)?t[0]:t},SelectCell:function(t,e){this.jExcelObj.updateSelectionFromCoords(e,t,e,t)},resetCellFormat:function(t,e){var i=this.col,r=this.KeyRow(e),s=h.a.getColumnNameFromId([i,r]),o=t.indexOf(s);o>-1&&t.splice(o,1)},EmptyCol:function(){for(var t=[],e=this.jExcelObj.getColumnData(0).length,i=0;i<e;i++)t.push("");return t},copyObj:function(t){return Object.assign({},t)},ClearAll:function(){this.optContainer=[],this.redObj=[];var t=this.jExcelObj.getData()[0],e=JSON.parse(JSON.stringify(this.jExcelObj.getData())),i=this.EmptyCol();function r(t,r){if(""!=t&&0!=r)for(var s=0;s<i.length;s++)e[s][r]=i[s]}t.forEach(r),this.jExcelObj.setData(e),this.ReturnCurrent(),this.FormatComplete(),this.SelectCell(1,1)},DynamicFormat:function(t,e,i){var r=[];0===this.KeyVal(e).length?(this.resetCellFormat(this.redObj,e),t[e]=null):(this.setRed(e),r=this.KeyVal(e)/i,t[e]=r.toString()),this.ReCalcOpt(t)},WriteToTable:function(t,e,i,r){t.ignoreEvents=!0,t.setValueFromCoords(e,i,r,!0),t.ignoreEvents=!1},setRed:function(t){var e=this.col,i=this.KeyRow(t),r=h.a.getColumnNameFromId([e,i]);this.redObj.push(r),this.redObj=Object(n["a"])(new Set(this.redObj))},ReCalcOpt:function(t){var e=this;p["a"].ReCalcOpt(t).then((function(t){var i,r=JSON.parse(t.data.result),s=[],o=Object(c["a"])(e.pricerKeys);try{for(o.s();!(i=o.n()).done;){var a=i.value,n=r.findIndex((function(t){return t.Key==a}));s.push(r[n].Value)}}catch(l){o.e(l)}finally{o.f()}e.replaceSingleOpt(s,e.col),e.FormatComplete()})),this.EmptyCol()},replaceSingleOpt:function(t,e){for(var i=JSON.parse(JSON.stringify(this.jExcelObj.getData())),r=0;r<t.length;r++)i[r][e]=t[r];this.jExcelObj.setData(i),this.ReturnCurrent()},ReturnCurrent:function(){var t={UserName:this.$store.state.currentUser,PricerData:{PricerTitle:this.pricerName,ActivePricerGridDataJSON:JSON.stringify(this.jExcelObj.getData()),UserOverwrittenInputsJSON:JSON.stringify(this.redObj),ActiveOptionsContainerJSON:JSON.stringify(this.optContainer),PricerLayoutName:JSON.parse(this.apidata.storedPricerData).PricerLayoutName}};p["a"].ReturnCurrentOpts(t)},updateOption:function(){var t={name:this.col.toString()},e=this.optContainer.findIndex((function(e){return e.name==t.name}));if(-1===e&&(this.optContainer.push(t),e=this.optContainer.findIndex((function(e){return e.name==t.name}))),this.optData=this.optContainer[e],this.row==this.KeyRow("Cross")&&(this.getSpot(),this.RecordCellPosition(this.pricerName)),this.row==this.KeyRow("Spot")||this.row==this.KeyRow("ExpiryText")||this.row==this.KeyRow("StrikeText")){this.setOptObj();var i=this.checkProperties(this.optData);!1===i&&this.ReCalcOpt(this.optData)}this.row==this.KeyRow("Call_Put")&&(Object.assign(this.optData,{call_put:this.KeyVal("Call_Put")}),this.ReCalcOpt(this.optData)),this.row==this.KeyRow("PremiumType")&&(Object.assign(this.optData,{premiumType:this.KeyVal("PremiumType")}),this.ReCalcOpt(this.optData)),this.row==this.KeyRow("UserVol")&&this.DynamicFormat(this.optData,"UserVol",100),this.row==this.KeyRow("AtmVol")&&this.DynamicFormat(this.optData,"AtmVol",100),this.row==this.KeyRow("Rr")&&this.DynamicFormat(this.optData,"Rr",100),this.row==this.KeyRow("Fly")&&this.DynamicFormat(this.optData,"Fly",100),this.row==this.KeyRow("RrMult")&&this.DynamicFormat(this.optData,"RrMult",1),this.row==this.KeyRow("SmileFlyMult")&&this.DynamicFormat(this.optData,"SmileFlyMult",1),this.row==this.KeyRow("FwdPts")&&this.DynamicFormat(this.optData,"FwdPts",1),this.row==this.KeyRow("OutRight")&&this.DynamicFormat(this.optData,"OutRight",1),this.row==this.KeyRow("ForDepo")&&this.DynamicFormat(this.optData,"ForDepo",100),this.row==this.KeyRow("DomDepo")&&this.DynamicFormat(this.optData,"DomDepo",100),this.row==this.KeyRow("Notional")&&this.DynamicFormat(this.optData,"Notional",1),this.row==this.KeyRow("Spot")&&(0===this.KeyVal("Spot").length?(this.resetCellFormat(this.redObj,"Spot"),this.getSpot()):this.setRed("Spot"))},RemoveRedCellsFromArray:function(){var t,e=Object(c["a"])(this.redObj);try{for(e.s();!(t=e.n()).done;){var i=t.value,r=i.charAt(0).toLowerCase(),s=this.alphabet.indexOf(r);if(s==this.col){var o=this.redObj.indexOf(i);this.redObj.splice(o,1)}}}catch(l){e.e(l)}finally{e.f()}var a,n=Object(c["a"])(this.redObj);try{for(n.s();!(a=n.n()).done;)i=a.value,r=i.charAt(0).toLowerCase(),s=this.alphabet.indexOf(r),s==this.col&&(o=this.redObj.indexOf(i),this.redObj.splice(o,1))}catch(l){n.e(l)}finally{n.f()}},AddRedCellsToArray:function(){var t,e=Object(c["a"])(this.redObj);try{for(e.s();!(t=e.n()).done;){var i=t.value,r=i.charAt(0).toLowerCase(),s=this.alphabet.indexOf(r),o=i.substring(1,i.length);if(s==this.col){var a=s+1,n=this.alphabet[a].toUpperCase(),l=n+o;this.redObj.push(l)}}}catch(h){e.e(h)}finally{e.f()}},CopyOpt:function(t){var e=this.jExcelObj.getColumnData(t),i=this.optContainer.filter((function(e){return e.name==t})),r=this.copyObj(i[0]);r.name=(t+1).toString();var s=this.optContainer.findIndex((function(t){return t.name==r.name}));s>0?this.optContainer[s]=r:this.optContainer.push(r),this.AddRedCellsToArray(),this.replaceSingleOpt(e,t+1),this.SelectCell(this.row,this.col+1),this.ReturnCurrent(),this.FormatComplete()},DelOpt:function(t){var e=this.optContainer.filter((function(e){return e.name==t})),i=this.optContainer.findIndex((function(t){return t.name==e[0].name}));this.optContainer.splice(i,1),this.RemoveRedCellsFromArray(),this.replaceSingleOpt(this.EmptyCol(),t),1!=t&&this.SelectCell(this.row,t-1),this.ReturnCurrent(),this.FormatComplete()},FormatRedcell:function(){for(var t=0;t<this.redObj.length;t++)this.jExcelObj.setStyle(this.redObj[t],"background-color","red"),this.jExcelObj.setStyle(this.redObj[t],"color","white")},FormatComplete:function(){for(var t=0;t<this.jExcelObj.rows.length;t++)for(var e=0;e<this.jExcelObj.headers.length;e++){var i=h.a.getColumnNameFromId([e,t]);this.FormatRowColorsByUser(i,t)}this.FormatRedcell()},FormatRowColorsByUser:function(t,e){this.jExcelObj.setStyle(t,"background-color",this.activeLayout[e].Color),this.jExcelObj.setStyle(t,"color",this.activeLayout[e].FontColor)},SetFormat:function(){for(var t=this.userFormat.rowArray[0];t<=this.userFormat.rowArray[1];t++)for(var e=0;e<this.jExcelObj.headers.length;e++){var i=h.a.getColumnNameFromId([e,t]);this.jExcelObj.setStyle(i,"background-color",this.userFormat.backgroundColor),this.jExcelObj.setStyle(i,"color",this.userFormat.fontColor)}},SaveLayout:function(){for(var t=[],e={},i=0;i<this.jExcelObj.rows.length;i++){var r=h.a.getColumnNameFromId([0,i]);e={Key:this.jExcelObj.getValue(r),Color:this.jExcelObj.getCell(r).style.backgroundColor,FontColor:this.jExcelObj.getCell(r).style.color},t.push(e)}var s={layoutName:"LAYOUTALL"};s.layout=t,p["a"].SetPricerLayout(s)},onChildClick:function(t){this.userFormat.backgroundColor=t.backgroundColor,this.userFormat.fontColor=t.fontColor}},mounted:function(){var t=h()(this.$refs["jexcelPricer"],this.jExcelOptions);Object.assign(this,{jExcelObj:t}),t.hideIndex(),this.RestorePricerData(this.storedData),this.SetCellPosition(this.pricerName),this.emitToParent(),this.FormatComplete()},watch:{currentCcyPair:function(){""!==this.currentCcyPair&&this.$emit("currentCcyPair",this.currentCcyPair)}}},m=f,v=(i("a8a6"),i("2877")),y=Object(v["a"])(m,o,a,!1,null,null,null),C=y.exports,O=i("52b7"),b=i("d017"),w=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-row",{attrs:{justify:"center"}},[i("v-dialog",{attrs:{persistent:"","max-width":"400"},scopedSlots:t._u([{key:"activator",fn:function(e){var r=e.on,s=e.attrs;return[i("v-icon",t._g(t._b({attrs:{large:t.large,color:t.color}},"v-icon",s,!1),r),[t._v(t._s(t.icon))])]}}]),model:{value:t.dialog,callback:function(e){t.dialog=e},expression:"dialog"}},[i("v-card",{staticClass:"mx-auto",attrs:{flush:"","max-width":"400"}},[i("v-toolbar",{attrs:{height:"40px",color:"blue-grey",dark:""}},[i("v-spacer"),i("v-toolbar-title",{staticClass:"ma-4"},[t._v(t._s(t.title))]),i("v-spacer")],1),i("v-text-field",{attrs:{label:t.label},on:{change:t.emitToParent}}),i("v-card-actions",[i("v-spacer"),i("v-btn",{attrs:{color:"green darken-1",text:""},on:{click:function(e){t.dialog=!1}}},[t._v("Cancel")])],1)],1)],1)],1)},j=[],g={data:function(){return{dialog:!1}},props:{label:{type:String},icon:{type:String},color:{type:String},title:{type:String},large:{type:Boolean}},methods:{emitToParent:function(t){this.$emit("selection",t)}}},P=g,x=i("6544"),S=i.n(x),D=i("8336"),R=i("b0af"),E=i("99d9"),K=i("169a"),N=i("132d"),F=i("0fd9"),T=i("2fa4"),V=i("8654"),L=i("71d9"),A=i("2a7f"),k=Object(v["a"])(P,w,j,!1,null,null,null),$=k.exports;S()(k,{VBtn:D["a"],VCard:R["a"],VCardActions:E["a"],VDialog:K["a"],VIcon:N["a"],VRow:F["a"],VSpacer:T["a"],VTextField:V["a"],VToolbar:L["a"],VToolbarTitle:A["a"]});var _={name:"PricerView",components:{OptionPricer:C,TreeView:O["a"],PopUpModal:b["a"],PopUpInput:$},data:function(){return{activePricers:[],dataReturned:!1,modalToggle:!1,pricerTitle:"",viewName:this.$route.params.viewName,showSideControl:!1,drawer:!0,currentCcyPair:this.$store.getters.activeCrossGetter,zoomLevel:{zoom:"70%"}}},created:function(){var t=this;this.$store.dispatch("refreshCrossList"),document.addEventListener("keydown",this.EventListeners);var e=this.$route.params.viewName;p["a"].GetListOfActivePricers({userName:this.$store.state.currentUser}).then((function(i){t.activePricers=JSON.parse(i.data.activePricers),-1===t.activePricers.indexOf(e)?t.AddNewPricer(e):t.RefreshPricerData(e)}))},destroyed:function(){document.removeEventListener("keydown",this.EventListeners),this.$store.dispatch("setPricerTab",this.pricerTitle)},computed:{mainWindowHeight:function(){return window.innerHeight-125},mainWindowWidth:function(){return window.innerWidth-10},containerStyle:function(){return" display: flex;\n  overflow-x: scroll;\n  padding-left: 0px;\n  padding-right: 0px;\n  width: ".concat(this.mainWindowWidth,"px;\n  height: ").concat(this.mainWindowHeight,"px;")},crossList:function(){return this.$store.state.crossList}},methods:{focusInput:function(){this.$refs.addPricer.focus()},setUser:function(t){this.$store.dispatch("changeCurrentUser",t)},EventListeners:function(t){"KeyL"==t.code&&t.ctrlKey&&(t.preventDefault(),this.drawer=!this.drawer)},UserAddPricer:function(t){-1===this.activePricers.indexOf(t)?this.AddNewPricer(t.toUpperCase()):alert("Pricer already exist: Choose another name")},AddNewPricer:function(t){var e=this.activePricers.indexOf(t);-1===e&&(this.activePricers.push(t),e=this.activePricers.length),this.modalToggle=!1,this.ReloadPricer(t)},RefreshPricerData:function(t){var e=this;this.dataReturned=!1,this.$store.dispatch("ChangePricer",t).then((function(t){200===t&&(e.dataReturned=!0)})).catch((function(e){alert("There is an issue with: ".concat(t,". \n").concat(e))}))},ReloadPricer:function(t){this.$route.params.viewName=t,this.$router.push({name:this.$route.name,viewName:t}).catch((function(){})),this.RefreshPricerData(t)},setPricerTitle:function(t){this.pricerTitle=t},setCurrentCcyPair:function(t){this.currentCcyPair=t},GotoPricerSettings:function(){this.$router.push("SetupView")},ToggleCrossList:function(){this.modalToggle=!0},RemoveTab:function(t){var e=this,i=this.$route.params.viewName;if(1!==this.activePricers.length){p["a"].RemovePricerFromUse({userName:this.$store.state.currentUser,PricerData:{PricerTitle:t}}).then((function(t){e.activePricers=JSON.parse(t.data.listOfActivePricers)})).catch((function(t){alert(t)}));var r=this.activePricers.indexOf(t);if(this.activePricers[r]===i){var s=0!==r?this.activePricers[r-1]:this.activePricers[r+1];this.ReloadPricer(s)}}else alert("Must have at least one Pricer. Add a new one before deleting ".concat(i))}},mounted:function(){},watch:{crossList:function(){0===this.crossList.length&&this.$store.dispatch("RefreshCrossList")}}},J=_,U=(i("7161"),i("a523")),I=Object(v["a"])(J,r,s,!1,null,null,null);e["default"]=I.exports;S()(I,{VBtn:D["a"],VCard:R["a"],VContainer:U["a"],VIcon:N["a"],VSpacer:T["a"],VToolbar:L["a"]})},7161:function(t,e,i){"use strict";var r=i("8fdb"),s=i.n(r);s.a},"8fdb":function(t,e,i){},a7c8:function(t,e,i){},a8a6:function(t,e,i){"use strict";var r=i("a7c8"),s=i.n(r);s.a}}]);
//# sourceMappingURL=chunk-73b9834f.175eeb8d.js.map