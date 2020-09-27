<template>
  <v-container :fluid="true" :style="containerStyle">
    <div class="d-flex flex-nowrap" v-bind:style="zoomLevel">
      <div>
        <v-toolbar
          class="mb-0 mr-2"
          dark
          height="30"
          color="blue-grey darken-0"
        >
          <v-spacer></v-spacer>
          <v-toolbar-title class="text-subtitle-2">Select Ccy</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon>
            <PopUpModal
              :inputData="availableCurrencies"
              :icon="'mdi-plus-box'"
              :color="'blue'"
              :title="'Select Ccy'"
              v-on:selection="GetEvents"
            />
          </v-btn>
        </v-toolbar>

        <div :style="scrollY" ref="spreadsheet"></div>
      </div>
      <div>
        <v-toolbar
          class="mb-0 mr-2"
          dark
          height="30"
          color="blue-grey darken-0"
        >
          <v-spacer></v-spacer>
          <v-toolbar-title class="text-subtitle-2"
            >Generate List</v-toolbar-title
          >
          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon color="yellow" v-on:click="GetSelectedEventList"
              >mdi-lightning-bolt</v-icon
            >
          </v-btn>
        </v-toolbar>

        <div :style="scrollY" ref="spreadsheet1"></div>
      </div>
      <div>
        <v-toolbar
          color="blue-grey darken-0"
          class="mb-0 mr-2"
          dark
          height="30"
        >
          <v-spacer></v-spacer>
          <v-toolbar-title class="text-subtitle-2"
            >Save Setup To Databaset</v-toolbar-title
          >
          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon color="blue-grey" v-on:click="SaveEventsToDB"
              >mdi-content-save</v-icon
            >
          </v-btn>
        </v-toolbar>
        <div :style="scrollY" ref="spreadsheet2"></div>
      </div>
    </div>
  </v-container>
</template>

<script>
import jexcelStyle from "jexcel/dist/jexcel.css"; // eslint-disable-line no-unused-vars
import jexcel from "jexcel"; // eslint-disable-line no-unused-vars
import setData from "jexcel"; // eslint-disable-line no-unused-vars
import * as customFunctions from "@/externaljs/customfunctions.js"; // eslint-disable-line no-unused-vars
import DayWgtSetupApi from "@/apis/DayWgtSetupApi";
import PopUpModal from "@/components/PopUpModal.vue";

export default {
  name: "DayWgtSetup",
  components: { PopUpModal },
  created: function () {
    DayWgtSetupApi.GetAvailableCurr().then((response) => {
      this.availableCurrencies = JSON.parse(response.data.availableCurrencies);
    });
  },
  destroyed: function () {},

  data() {
    return {
      currListToggle: false,
      availableCurrencies: [],
      currentCcy: "SELECT CCY",
      selectedEvents: [],
      productionList: [],
    };
  },
  computed: {
    zoomLevel() {
      var level = window.innerWidth > 1700 ? "100%" : "80%";
      return {
        zoom: level,
      };
    },
    longComponentHeight() {
      var heightAdjust = window.innerWidth > 1700 ? 1 : 0.9;
      heightAdjust = this.mainWindowWidth * heightAdjust;
      return heightAdjust;
    },
    mainWindowHeight() {
      return window.innerHeight - 75;
    },
    mainWindowWidth() {
      return window.innerWidth - 10;
    },
    scrollY() {
      return ` display: flex;
              margin-top: 20px;
              overflow-y: scroll;
              height: ${this.longComponentHeight}px;`;
    },
    containerStyle() {
      return ` display: flex;
              overflow-x: scroll;
              padding-left: 0px;
              padding-right: 0px;
              width: ${this.mainWindowWidth}px;
              height: ${this.mainWindowHeight}px;`;
    },
    configAllEvents() {
      return {
        columnSorting: false,
        onchange: this.OnChangeAllEvents,
        tableOverflow: false,
        allowInsertRow: false,
        columns: [
          { type: "checkbox", title: "IncludeEvent", width: 110 },
          {
            type: "text",
            title: "EventName",
            width: 350,
          },
        ],
      };
    },
    configSelectedEvents() {
      return {
        columnSorting: false,
        onchange: this.OnChangeSelectedEvents,
        tableOverflow: false,
        allowInsertRow: false,
        columns: [
          { type: "checkbox", title: "IncludeEvent", width: 110 },
          {
            type: "text",
            title: "EventName",
            width: 350,
          },
          {
            type: "text",
            title: "EventWgt",
            width: 110,
          },
        ],
      };
    },
    configProductionList() {
      return {
        columnSorting: false,
        tableOverflow: false,
        allowInsertRow: false,
        columns: [
          {
            type: "text",
            title: "Event",
            width: 200,
          },
          {
            type: "text",
            title: "Date",
            width: 200,
          },
          {
            type: "text",
            title: "DayWgt",
            width: 100,
          },
          {
            type: "text",
            title: "Time",
            width: 100,
          },
        ],
      };
    },
  },
  methods: {
    GetEvents(item) {
      var body = { name: item };
      DayWgtSetupApi.GetEvents(body).then((response) => {
        var ccyEvents = JSON.parse(response.data.currencyEvents);
        var activeEventsFromServer = response.data.activeEvents;
        var activeEvents = [];

        if (activeEventsFromServer !== "null") {
          activeEvents = customFunctions.ReFormatJson(
            JSON.parse(activeEventsFromServer)
          );
        }

        this.jexcelAllEvents.setData(customFunctions.ReFormatJson(ccyEvents));
        this.selectedEvents = activeEvents;
        this.jexcelSelectedEvents.setData(this.selectedEvents);
        this.productionList = [];
        this.jexcelProductionList.setData(this.productionList);
        this.currentCcy = item;
        this.currListToggle = false;
      });
    },
    GetSelectedEventList() {
      var eventNames = [];
      this.selectedEvents.forEach((event) => {
        eventNames.push(event[1]);
      });

      var body = { name: this.currentCcy, eventNames: eventNames };
      DayWgtSetupApi.GetSelectedEventList(body).then((response) => {
        for (var event of JSON.parse(response.data.selectedEvents)) {
          var index = this.selectedEvents.findIndex(
            (e) => e[1] === event.Title
          );
          var wgt = this.jexcelSelectedEvents.getValueFromCoords(2, index);

          if (!event.Time.includes(":")) {
            //if (event.time === "All Day") {
            event.Time = "00:00";
          }
          var addEvent = {
            Event: event.Title,
            Date: event.Date,
            DayWgt: wgt,
            Time: event.Time,
          };
          this.productionList.push(addEvent);
        }

        this.jexcelProductionList.setData(
          customFunctions.ReFormatJson(this.productionList)
        );
      });
    },
    OnChangeAllEvents(instance, cell, x, y) {
      // eslint-disable-line no-unused-vars
      var col = x;
      var row = y;

      if (col === "0") {
        var event = [
          true,
          this.jexcelAllEvents.getValueFromCoords(parseInt(1), parseInt(row)),
          1,
        ];

        var checkList = this.selectedEvents.some((e) => e[1] === event[1]);

        if (!checkList) {
          this.selectedEvents.push(event);
        } else {
          this.selectedEvents = this.selectedEvents.filter(
            (e) => e[1] != event[1]
          );
        }

        this.jexcelSelectedEvents.setData(this.selectedEvents);
      }
    },
    OnChangeSelectedEvents(instance, cell, x, y) {
      // eslint-disable-line no-unused-vars
      var col = x;
      var row = y;

      if (col === "0") {
        var event = this.jexcelSelectedEvents.getValueFromCoords(
          parseInt(1),
          parseInt(row)
        );
        var checkList = this.selectedEvents.some((e) => e[1] === event);

        if (checkList) {
          this.selectedEvents = this.selectedEvents.filter(
            (e) => e[1] != event
          );
          var arr = this.jexcelAllEvents.getColumnData(1);
          var index = arr.indexOf(event);
          this.jexcelAllEvents.setValueFromCoords(0, index, false, true);
        }

        this.jexcelSelectedEvents.setData(this.selectedEvents);
      }
    },
    ConvertSelectedEventsToObjArr() {
      var output = [];
      this.jexcelSelectedEvents.getData().forEach((event) => {
        var newEvent = {
          IncludeEvent: event[0],
          EventName: event[1],
          EventWgt: event[2],
        };

        output.push(newEvent);
      });

      return output;
    },
    SaveEventsToDB() {
      var dbObj = {
        ccy: this.currentCcy,
        selectedEvents: JSON.stringify(this.ConvertSelectedEventsToObjArr()),
        productionList: JSON.stringify(this.productionList),
      };

      DayWgtSetupApi.SaveDataToDB(dbObj)
        .then((response) => {
          alert("Database Upadated. Status " + response.status);
        })
        .catch((error) => {
          alert(error);
        });
    },
  },

  mounted: function () {
    const jexcelAllEvents = jexcel(
      this.$refs["spreadsheet"],
      this.configAllEvents
    );
    jexcelAllEvents.hideIndex();
    Object.assign(this, { jexcelAllEvents });

    const jexcelSelectedEvents = jexcel(
      this.$refs["spreadsheet1"],
      this.configSelectedEvents
    );
    jexcelSelectedEvents.hideIndex();
    Object.assign(this, { jexcelSelectedEvents });

    const jexcelProductionList = jexcel(
      this.$refs["spreadsheet2"],
      this.configProductionList
    );
    jexcelProductionList.hideIndex();
    Object.assign(this, { jexcelProductionList });
  },
};
</script>

<style>
.jexcel > thead > tr > td {
  font-family: Arial;
  font-size: 0.65rem;
  background-color: #3c4b63;
  color: white;
}
.jexcel > tbody > tr > td {
  font-family: Arial;
  font-size: 0.75rem;
  padding: 0px;
  line-height: 1.6em;
}
.jexcel > thead > tr > td.selected {
  color: black;
  background-color: #8f9494;
}
</style>
