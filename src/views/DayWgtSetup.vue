<template>
  <div class="dayWgtContainer">
    <div>
      <div class="d-flex flex-row mb-5 flex-nowrap">
        <v-toolbar color="#385F73" min-width="400" collapse>
          <v-spacer></v-spacer>
          <div class="d-flex flex-column">
            <h4
              class="font-weight-medium text-center text-uppercase grey--text text--lighten-3"
            >
              corevolFX DAY WEIGHT SETTINGS
              <v-btn icon x-small class="mb-4">
                <PopUpModal
                  :inputData="availableCurrencies"
                  :icon="'mdi-dots-hexagon'"
                  :color="'green lighten-3'"
                  :small="true"
                  :title="'Select Ccy'"
                  v-on:selection="changeCcy"
                />
              </v-btn>
            </h4>
            <h4
              class="font-weight-light text-center text-uppercase green--text text--lighten-3"
              align="center"
              justify="center"
            >
              {{ currentCcy }}
            </h4>
          </div>

          <v-spacer></v-spacer>
        </v-toolbar>
      </div>
      <div class="d-flex flex-row flex-nowrap">
        <div class="dayWgtCol">
          <v-card
            :height="window.height"
            min-width="240"
            class="mr-5 d-flex flex-column"
          >
            <v-list dense>
              <v-list-item-group color="blue">
                <v-subheader>SELECT</v-subheader>
                <v-list-item @click="currListToggle = !currListToggle">
                  <v-list-item-action>
                    <v-btn ripple small icon>
                      <v-icon color="#385F73">mdi-expand-all</v-icon>
                    </v-btn>
                    <ModalNoButton
                      :inputData="availableCurrencies"
                      :title="'Select Ccy'"
                      :vmodel="currListToggle"
                      v-on:setvmodel="data => (currListToggle = data)"
                      v-on:selection="changeCcy"
                    />
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>SELECT CURRENCY</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-subheader>EVENTS</v-subheader>
                <v-list-item @click="dialog = !dialog">
                  <v-list-item-action>
                    <v-btn ripple small icon>
                      <v-icon color="#126496">mdi-calendar-star</v-icon>
                    </v-btn>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>AVAILABLE EVENTS</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-subheader>BUILD</v-subheader>
                <v-list-item @click="buildProductionList">
                  <v-list-item-action>
                    <v-btn ripple small icon>
                      <v-icon color="yellow darken-3"
                        >mdi-lightning-bolt-outline</v-icon
                      >
                    </v-btn>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>BUILD PRODUCTION LIST</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-subheader>SAVE</v-subheader>
                <v-list-item @click="saveEventsToDB">
                  <v-list-item-action>
                    <v-btn ripple small icon>
                      <v-icon color="green lighten-3">mdi-content-save</v-icon>
                    </v-btn>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>SAVE EVENTS TO DB</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
        </div>
        <v-row justify="center">
          <v-dialog v-model="dialog" max-width="410">
            <div class="dayWgtCol" ref="eventsByCcyTable"></div>
          </v-dialog>
        </v-row>
        <div>
          <div class="dayWgtCol mx-5" ref="selectedEventsByCcyTable"></div>
        </div>
        <div>
          <div class="dayWgtCol" ref="productionListTable"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import jexcelStyle from "jexcel/dist/jexcel.css"; // eslint-disable-line no-unused-vars
import jexcel from "jexcel"; // eslint-disable-line no-unused-vars
import setData from "jexcel"; // eslint-disable-line no-unused-vars
import * as customFunctions from "@/externaljs/customfunctions.js"; // eslint-disable-line no-unused-vars
import DayWgtSetupApi from "@/apis/DayWgtSetupApi";
import PopUpModal from "@/components/common/PopUpModal.vue";
import ModalNoButton from "@/components/common/ModalNoButton.vue";

export default {
  name: "DayWgtSetup",
  components: { PopUpModal, ModalNoButton },
  created() {
    DayWgtSetupApi.GetAvailableCurr().then(response => {
      this.availableCurrencies = JSON.parse(response.data.availableCurrencies);
    });

    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },

  data() {
    return {
      currListToggle: false,
      availableCurrencies: [],
      currentCcy: "SELECT CCY",
      selectedEventsByCcy: [],
      productionList: [],
      eventsByCcy: [],
      dialog: false,
      window: {
        width: 0,
        height: 0
      }
    };
  },
  computed: {
    configEventsByCcy() {
      return {
        data: this.eventsByCcy,
        columnSorting: false,
        onchange: this.onChangeByCcyEvents,
        tableOverflow: false,
        allowInsertRow: false,
        columns: [
          { type: "checkbox", title: "IncludeEvent", width: 90 },
          {
            type: "text",
            title: "EventName",
            width: 320
          }
        ],
        nestedHeaders: [
          [
            {
              title: "AVAILABLE EVENTS",
              colspan: 2
            }
          ]
        ]
      };
    },
    configSelectedEventsByCcy() {
      return {
        data: this.selectedEventsByCcy,
        columnSorting: false,
        onchange: this.onChangeSelectedEventsByCcy,
        tableOverflow: false,
        allowInsertRow: false,
        columns: [
          { type: "checkbox", title: "IncludeEvent", width: 90 },
          {
            type: "text",
            title: "EventName",
            width: 310
          },
          {
            type: "text",
            title: "EventWgt",
            width: 90
          }
        ],
        nestedHeaders: [
          [
            {
              title: "SELECTED EVENTS",
              colspan: 3
            }
          ]
        ]
      };
    },
    configProductionList() {
      return {
        data: this.productionList,
        columnSorting: false,
        tableOverflow: false,
        allowInsertRow: false,
        columns: [
          {
            type: "text",
            title: "Event",
            width: 175
          },
          {
            type: "text",
            title: "Date",
            width: 175
          },
          {
            type: "text",
            title: "DayWgt",
            width: 75
          },
          {
            type: "text",
            title: "Time",
            width: 100
          }
        ],
        nestedHeaders: [
          [
            {
              title: "PRODUCTION LIST",
              colspan: 4
            }
          ]
        ]
      };
    }
  },
  methods: {
    handleResize() {
      this.window.width = window.innerWidth - 100;
      this.window.height = window.innerHeight - 95;
      this.setContainerDimensions();
    },
    setContainerDimensions() {
      document.documentElement.style.setProperty(
        "--main-width",
        `${this.window.width}px`
      );

      document.documentElement.style.setProperty(
        "--main-height",
        `${this.window.height}px`
      );
    },
    async getEvents(ccy) {
      try {
        let response = await DayWgtSetupApi.GetEvents({ Ccy: ccy });

        this.eventsByCcy = JSON.parse(response.data.eventsByCcy);
        this.selectedEventsByCcy = JSON.parse(response.data.selectedEvents);
        this.productionList = JSON.parse(response.data.productionList);
        this.currentCcy = ccy;
      } catch (error) {
        alert(error);
      }
    },

    async changeCcy(ccy) {
      await this.getEvents(ccy);
      if (this.selectedEventsByCcy === null) {
        this.selectedEventsByCcy = [];
      }
      if (this.productionList === null) {
        this.productionList = [];
      }
      this.updateEventsByCcyWithSelectedEvents();
      this.selectedEventsByCcyTable.setData(this.selectedEventsByCcy);
      this.productionListTable.setData(this.productionList);
    },
    async buildProductionList() {
      if (this.selectedEventsByCcy.length === 0) {
        this.$store.dispatch("setSnackbar", {
          text: ` Select Events Before Building List`,
          top: true
        });
        return;
      }
      try {
        let response = await DayWgtSetupApi.BuildProductionList({
          Ccy: this.currentCcy,
          EventNames: this.selectedEventsByCcy.map(x => x.EventName)
        });

        const productionEvents = JSON.parse(response.data.selectedEvents);

        this.productionList = [];

        productionEvents.forEach(element => {
          let dayWgt = this.selectedEventsByCcy.filter(
            x => x.EventName === element.Title
          )[0].EventWgt;

          if (!element.Time.includes(":")) {
            element.Time = "00:00";
          }

          this.productionList.push({
            Event: element.Title,
            Date: element.Date,
            DayWgt: dayWgt,
            Time: element.Time
          });
        });

        this.productionListTable.setData(
          customFunctions.ReFormatJson(this.productionList)
        );
      } catch (error) {
        alert(error);
      }
    },
    onChangeByCcyEvents(instance, cell, x, y) {
      var col = x;
      var row = y;

      if (col === "0") {
        var addEvent = {
          EventName: this.eventsByCcyTable.getValueFromCoords(
            parseInt(1),
            parseInt(row)
          ),
          EventWgt: 1.0,
          IncludeEvent: true
        };

        var checkList = this.selectedEventsByCcy.some(
          e => e.EventName === addEvent.EventName
        );

        if (!checkList) {
          this.selectedEventsByCcy.push(addEvent);
        } else {
          this.selectedEventsByCcy = this.selectedEventsByCcy.filter(
            e => e.EventName != addEvent.EventName
          );
        }

        this.selectedEventsByCcyTable.setData(this.selectedEventsByCcy);
      }
    },
    onChangeSelectedEventsByCcy(instance, cell, x, y) {
      var col = x;
      var row = y;

      if (col === "0") {
        var event = this.selectedEventsByCcyTable.getValueFromCoords(
          parseInt(1),
          parseInt(row)
        );

        const checkBox = this.selectedEventsByCcyTable.getValueFromCoords(
          parseInt(0),
          parseInt(row)
        );

        if (!checkBox) {
          this.selectedEventsByCcy = this.selectedEventsByCcy.filter(
            e => e.EventName != event
          );

          this.updateEventsByCcyWithSelectedEvents();
          this.selectedEventsByCcyTable.setData(this.selectedEventsByCcy);
          this.eventsByCcyTable.setData(this.eventsByCcy);
        }
      }
      if (col === "2") {
        const wgt = this.selectedEventsByCcyTable.getValueFromCoords(
          parseInt(2),
          parseInt(row)
        );

        this.selectedEventsByCcy[row].EventWgt = parseFloat(wgt);
      }
    },

    saveEventsToDB() {
      var dbObj = {
        ccy: this.currentCcy,
        selectedEvents: JSON.stringify(this.selectedEventsByCcy),
        productionList: JSON.stringify(this.productionList)
      };

      DayWgtSetupApi.SaveDataToDB(dbObj)
        .then(response => {
          this.$store.dispatch("setSnackbar", {
            text: `Database Upadated With ${this.currentCcy} Events List `,
            centered: true
          });
        })
        .catch(error => {
          this.$store.dispatch("setSnackbar", {
            text: `There was an error updating ${this.currentCcy} events: ${error} `,
            centered: true
          });
        });
    },
    updateEventsByCcyWithSelectedEvents() {
      this.eventsByCcy.forEach(element => {
        var checkList = this.selectedEventsByCcy.some(
          e => e.EventName === element.EventName
        );

        element.IncludeEvent = checkList === true ? true : false;
      });
    }
  },

  async mounted() {
    await this.getEvents("USD");
    this.updateEventsByCcyWithSelectedEvents();

    const selectedEventsByCcyTable = jexcel(
      this.$refs["selectedEventsByCcyTable"],
      this.configSelectedEventsByCcy
    );
    selectedEventsByCcyTable.hideIndex();
    Object.assign(this, { selectedEventsByCcyTable });

    const productionListTable = jexcel(
      this.$refs["productionListTable"],
      this.configProductionList
    );
    productionListTable.hideIndex();
    Object.assign(this, { productionListTable });
  },
  watch: {
    dialog() {
      setTimeout(() => {
        jexcel.destroy(this.$refs["eventsByCcyTable"], false);
        const eventsByCcyTable = jexcel(
          this.$refs["eventsByCcyTable"],
          this.configEventsByCcy
        );
        eventsByCcyTable.hideIndex();
        Object.assign(this, { eventsByCcyTable });
      }, 500);
    }
  }
};
</script>

<style lang="scss">
$mainHeight: var(--main-height);
$mainWidth: var(--main-width);

.dayWgtContainer {
  display: flex;
  overflow: auto;
  padding-left: 0px;
  padding-right: 0px;
  height: $mainHeight;
  width: $mainWidth;
}
.dayWgtContainer .dayWgtCol {
  display: flex;
  overflow-y: auto;
  height: $mainHeight;
}

.jexcel > thead > tr.jexcel_nested > td {
  background-color: #385f73 !important;
  font-family: Arial;
  font-size: 0.9rem;
  padding: 0px;
  line-height: 2em;
}
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

.centerWrapper {
  width: 100%;
  height: 400px;

  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
